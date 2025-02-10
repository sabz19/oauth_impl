import crypto from 'node:crypto';
import { AuthGrantType, AuthAccessTokenType } from './authtypes';

/**
 * Class AuthProfile to store the auth profile of a client
 */

class AuthProfile{

    private accessTokenList: AuthAccessTokenType [];
    private refreshTokenList: AuthAccessTokenType [];
    private authGrantCodeList: AuthGrantType [];
    private scopes: [];
    private clientId: string;
    private clientSecret: string;
    
    constructor(clientIdName: string){
        this.clientId = clientIdName;
    }

    /**
     * 
     * @returns auth code
     */

    generateAuthCodeGrant(): string{

        const authCode = crypto.randomBytes(16).toString('hex');   
        const authCodeVal: AuthGrantType = {
            'code': authCode,
            'accessToken': this.generateAccessToken(authCode),
            'expiration': new Date(Date.now() * 1000)
        };

        this.authGrantCodeList.push(authCodeVal);
        return authCode;
    }
    /**
     * 
     * @param authCodeGrant 
     * @returns a JWT access token
     */
    generateAccessToken(authCodeGrant: string): string{
        // Generate a JWT token
        // Add it to token list
        return "";
    }
    /**
     * Validate if a given request from a user already has a valid auth code rather than
     * generating a new one
     * @param authCode 
     * @returns 
     */
    private validateAuthCodeGrant(authCode: string): Boolean {

        return false;
    }

    // Automate a process of a removing expired code grants


}


export default AuthProfile;