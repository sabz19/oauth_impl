import { AuthGrantType } from './authtypes';
import * as jose from 'jose';

/**
 * Class AuthProfile to store the auth profile of a client
 */

class AuthProfile{

    // List of JWT access tokens
    private accessTokenList: jose.SignJWT [];
    private refreshTokenList: jose.SignJWT [];
    
    // List of generated auth codes that need to be verified before providing the access token
    private authGrantCodeList: AuthGrantType [];
    // A list of scopes that the client has access to
    private scopes: string [];
    // Client ID
    private clientId: string;
    private clientSecrets: string[];

    private redirectUris: string [];
    
    constructor(clientIdName: string){
        this.clientId = clientIdName;
        this.accessTokenList = [];
        this.authGrantCodeList = [];
        this.refreshTokenList = [];
        this.scopes = [];
        this.redirectUris = [];
    }

    addRedirectUri(redirectUri: string): void{
        this.redirectUris.push(redirectUri);
    }

    addAuthrantCode(authGrantCode: AuthGrantType): void{
        this.authGrantCodeList.push(authGrantCode);
    }

    addAccessToken(accessToken: jose.SignJWT): void{
        this.accessTokenList.push(accessToken);
    }
}


export default AuthProfile;