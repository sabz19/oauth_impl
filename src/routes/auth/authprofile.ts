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

    addRedirectUri(redirectUri: string): this{
        this.redirectUris.push(redirectUri);
        return this;
    }

    addAuthrantCode(authGrantCode: AuthGrantType): this{
        this.authGrantCodeList.push(authGrantCode);
        return this;
    }

    addAccessToken(accessToken: jose.SignJWT): this{
        this.accessTokenList.push(accessToken);
        return this;
    }

    addRefreshToken(refreshToken: jose.SignJWT): this{
        this.refreshTokenList.push(refreshToken);
        return this;
    }
}


export default AuthProfile;