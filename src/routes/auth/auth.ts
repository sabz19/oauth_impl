import * as jose from 'jose';
import crypto from 'node:crypto';
import fs from 'node:fs';
import pathList from '../../env/path';
import registeredClients from './registeredclients';
import AuthProfile from './authprofile';
import { Request, Response, NextFunction } from 'express';
import { AuthGrantType, JwtPayload } from './authtypes';

/**
 * Authorization middleware for clients
 * grant code flow - for auth code grant to be generated, the client must be registered & the user must be authenticated
 * access token flow - 
 * refresh token flow - 
 * @param req - request from client
 * @param res - response to send back to client
 * @param next - call next middleware or router
 */
function authorize(req: Request, res: Response, next: NextFunction): void{

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
        const state = req.query.state;
        
        switch(responseType?.toString()){
            case 'code':  
            if(userIsAuthenticated(req)){
                for(const profile of registeredClients){
                    if(profile['clientId'] == clientId?.toString() 
                        && profile['redirectUris']?.includes(redirectUri?.toString())){{
                            unauthorized = false;
                            res.locals.profile = profile;
                            next();
                        }
                    }
                }
            }
            //other cases such as implicit grant flow
        }
    }

    if(req.method == 'POST'){
        const responseType = req.body.response_type;
        const clientId = req.body.client_id;
        const redirectUri = req.body.redirect_uri;
        const state = req.body.state;
    
        if(responseType?.toString() == 'token'){
            console.log('Response type is token');
            if(clientId?.toString() in registeredClients){
                console.log('Client ID is valid');
                let redirectUriList = registeredClients[clientId.toString()]['redirectUris'];
                if(redirectUriList?.includes(redirectUri)){
                    unauthorized = false;
                    next();
                }
            }
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
    // Returning default true for this demo, but must be dependent on user session authentication
    return true;
}

/**
 * Generate a one time auth code that is valid for 30 seconds
 * Store code -> access token mapping to retrieve the access token for future requests
 * @returns auth code
 */

async function generateAuthCodeGrant(profile: AuthProfile): Promise<string>{

    const authCode = crypto.randomBytes(16).toString('hex');   
    const payload: JwtPayload = {
        'sub': profile['clientId'],
        'aud': '',
        'exp': Date.now() + 24 * 1000 * 60 * 60,
        'iat': Date.now(),
        'iss': ''
    } 
    const authCodeObj: AuthGrantType = {
        'code': authCode,
        'accessToken': await generateAccessToken(profile, payload),
        'expiration': new Date(Date.now() + 30 * 1000)
    };

    profile.addAuthrantCode(authCodeObj);
    return authCode;
    }
/**
 * Generate a JWT access token 
 * @param authCodeGrant string
 * @returns a JWT access token
 */
async function generateAccessToken(profile: AuthProfile, payload: JwtPayload): Promise<jose.SignJWT>{
        
    // Check if grant code is valid & within expiration 
    // Generate a JWT token

    let jwt = null;
    try{
        const privateKey = await fs.promises.readFile(pathList.pKeyPath, 'utf8');
        const key = await jose.importPKCS8(privateKey, 'RS256');
        jwt = await new jose.SignJWT({payload})
        .setProtectedHeader({ alg: 'RS256' })
        .setIssuedAt()
        .setExpirationTime('12h')
        .sign(key);

        profile.addAccessToken(jwt);
        
    }catch(error){
        console.error('Error generating JWT token:', error);
        throw error;
    }

    return jwt;
}
/**
 * Validate if a given request from a user is a valid auth code grant
 * @param authCode 
 * @returns 
 */
function validateAuthCode(authCode: string): Boolean {
    return false;
}

/**
 * 
 * @param accessToken JWT
 * @returns Boolean
 */
function validateAccessToken(accessToken: jose.SignJWT): Boolean {
    return false;
}


export { authorize, generateAccessToken, generateAuthCodeGrant, validateAuthCode };