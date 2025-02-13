import { Request, Response, NextFunction } from 'express';
import { AuthGrantType, JwtPayload, Token} from './authtypes';
import * as jose from 'jose';
import AuthProfile from './authprofile';
import crypto from 'node:crypto';
import fs from 'node:fs';
import pathList from '../../env/path';
import registeredClients from './registeredclients';

/**
 * Authorization middleware for clients
 * grant code flow - for auth code grant to be generated, the client must be registered & the user must be authenticated
 * access token flow - 
 * refresh token flow - 
 * @param req - request from client
 * @param res - response to send back to client
 * @param next - call next middleware or router
 */
async function authorize(req: Request, res: Response, next: NextFunction): Promise<void>{

    // check request parameters for client_id & redirect_uri & response_type
    // if response_type = code do the following
    // check if client_id is valid 
    // check if redirect_uri is valid
    // Then generate code JWT token & match it with the redirect_uri

    let unauthorized: Boolean = true;

    if(req.method == 'GET'){
        const responseType = req.query.response_type;
        const clientId = req.query.client_id;
        const redirectUri = req.query.redirect_uri;
        
        switch(responseType?.toString()){
            case 'code':  
                if(userIsAuthenticated(req) && validateClientAndUri(clientId?.toString(), redirectUri?.toString(), res)){
                    unauthorized = false;
                    next();
                }
            break;
            //other cases such as implicit grant flow

            default: console.log('Invalid Response Type');
        }
    }

    if(req.method == 'POST'){
        
        const grantType = req.body.grant_type;
        const clientId = req.body.client_id;
        const redirectUri = req.body.redirect_uri;
        const code = req.body.code;
        const refreshToken = req.body.refresh_token;

        switch(grantType?.toString()){
            case 'authorization_code':
                if(validateClientAndUri(clientId?.toString(), redirectUri?.toString(), res)){
                    if(validateAuthCode(res.locals.profile, code)){
                        console.log('Auth code is valid, sending back token');
                        unauthorized = false;
                        res.locals.grantType = grantType.toString();
                        next();
                    }
                }
            break;

            case 'refresh_token':
                    if(validateClientAndUri(clientId?.toString(), redirectUri?.toString(), res)){
                        console.log('Validating refresh token...');
                        if(await validateRefreshToken(res.locals.profile, refreshToken?.toString())){
                            unauthorized = false;
                            res.locals.grantType = grantType.toString();
                            next();
                    }
                }
            break;
            
            default: console.log('Invalid Grant Type');
        }       
    }

    if(unauthorized){
        res.status(401).send('Unauthorized');
    }
}

/**
 * Method must verify the user's session information
 * Identity providers can be different from resource owner
 * @returns true if user is authenticated
 */
function userIsAuthenticated(req: Request): Boolean {
    // Returning default true for this demo, but must be based on real user session authentication
    return true;
}

/**
 * Generate a one time auth code that is valid for 30 seconds
 * Store code -> access token mapping to retrieve the access token for future requests
 * @returns auth code
 */

async function generateAuthCodeGrant(profile: AuthProfile): Promise<string>{

    const authCode = crypto.randomBytes(16).toString('hex');   
    const accessTokenPayload = createJWTPayload(profile, Token.Access);
    const refreshTokenPayload = createJWTPayload(profile, Token.Refresh);

    const [accessToken,refreshToken] = await generateAccessAndRefreshToken(profile, accessTokenPayload, refreshTokenPayload);

    // Expiration time for auth code set to 30 seconds
    const authCodeObj: AuthGrantType = {
        'code': authCode,
        'accessToken': accessToken,
        'refreshToken': refreshToken,
        'expiration': new Date(Date.now() + 30 * 1000)
    };

    profile.addAuthrantCode(authCodeObj);
    return authCode;
    }
/**
 * Generate both JWT access token & JWT refresh token
 * @param authCodeGrant string
 * @returns a JWT access token
 */
async function generateAccessAndRefreshToken(profile: AuthProfile, accessTokenPayload: JwtPayload, refreshTokenPayload: JwtPayload): Promise<[jose.SignJWT, jose.SignJWT]>{
        
    // Check if grant code is valid & within expiration 
    // Generate a JWT token

    let accessToken = null;
    let refreshToken = null;

    try{
        const privateKey = await fs.promises.readFile(pathList.pKeyPath, 'utf8');
        const key = await jose.importPKCS8(privateKey, 'RS256');
        accessToken = await new jose.SignJWT({accessTokenPayload})
        .setProtectedHeader({ alg: 'RS256' })
        .setIssuedAt()
        .setExpirationTime('1h')
        .sign(key);

        refreshToken = await new jose.SignJWT({refreshTokenPayload})
        .setProtectedHeader({ alg: 'RS256' })
        .setIssuedAt()
        .setExpirationTime('1d')
        .sign(key);

        profile.addAccessToken(accessToken)
        .addRefreshToken(refreshToken);
        
    }catch(error){
        console.error('Error generating JWT token:', error);
        throw error;
    }

    return [accessToken, refreshToken];
}
/**
 * Validate if a given request from a user is a valid auth code grant
 * If auth code has expired, remove it from the list
 * @param authCode 
 * @returns 
 */
function validateAuthCode(profile: AuthProfile, authCode: string): Boolean {
    for(const code of profile['authGrantCodeList']){
        if(code['code'] == authCode && code['expiration'] > new Date()){
            return true;
        }
        // Invalidate the code if it is expired
        if(code['code'] == authCode && code['expiration'] < new Date()){
            profile['authGrantCodeList'] = profile['authGrantCodeList'].filter((code: AuthGrantType) => code['code'] != authCode);
            console.log('Token validity is expired');
            return false;
        }
    }
    console.log('Auth code invalid');
    return false;
}

/**
 * Refresh token validation should be three steps 
 * 1. Verify with the public key 
 * 2. Check if it exists in the list of refresh tokens issued 
 * 3. Check if it is expired
 * @param profile 
 * @param refreshToken 
 * @returns 
 */
async function validateRefreshToken(profile: AuthProfile, refreshToken: string): Promise<Boolean> {
    try{
        const payload: jose.JWTVerifyResult<JwtPayload> = (await jose.jwtVerify(refreshToken, await loadRSAPublicKey()));
        const expTime = ((JSON.parse(JSON.stringify(payload))['payload']['refreshTokenPayload']['exp']));
        console.log( Number(Date.now()));
        if(expTime > Number(Date.now())){
            for(const token of profile['refreshTokenList']){
                if(token.toString() == refreshToken){
                    console.log(['Refresh token is valid!']);
                    return true;
                }
            }
        }
    }catch(error){
        console.error('Error validating refresh token:', error);
    }

    return false;
}

function validateClientAndUri(clientId: string, redirectUri: string, res: Response): Boolean {
    for(const profile of registeredClients){
        if(profile['clientId'] == clientId?.toString() 
            && profile['redirectUris']?.includes(redirectUri?.toString())){
            res.locals.profile = profile;
            return true;
        }
    }
}

async function retrieveTokensWithGrant(profile: AuthProfile, authCode: string): Promise<[jose.SignJWT, jose.SignJWT] | null> {
    for(const code of profile['authGrantCodeList']){
        console.log('code = ' + code);
        if(code['code'] == authCode){
            return [code['accessToken'], code['refreshToken']];
        }
    }
    return null;
}

/**
 * Assuming user tries to access resources, this method needs to be called to validate the access token & expiration
 * @param accessToken JWT
 * @returns Boolean
 */
function validateAccessToken(accessToken: jose.SignJWT): Boolean {
    return false;
}

async function loadRSAPublicKey(): Promise<jose.KeyLike>{
    try{
        const publicPem = await fs.promises.readFile(pathList.publicKeyPath, 'utf8');
        return await jose.importSPKI(publicPem, 'RS256');
    }catch(error){
        console.error('Error loading public key:', error);
        throw error;
    }

}

function createJWTPayload(profile: AuthProfile, tokenType: Token): JwtPayload{
    
    const accessTokenExpiry = Date.now() + 1000 * 60 * 60;
    const refreshTokenExpiry = Date.now() + 1000 * 60 * 60 * 24;

    const payload: JwtPayload = {
        'sub': profile['clientId'],
        'aud': '',
        'iss': '',
        'iat': Date.now(),
        'exp': tokenType == Token.Access? accessTokenExpiry : refreshTokenExpiry
    };
    
    return payload;

}


export { authorize, generateAccessAndRefreshToken, generateAuthCodeGrant, validateAuthCode, retrieveTokensWithGrant, createJWTPayload };