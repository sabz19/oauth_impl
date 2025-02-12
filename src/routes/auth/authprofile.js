"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Class AuthProfile to store the auth profile of a client
 */
var AuthProfile = /** @class */ (function () {
    function AuthProfile(clientIdName) {
        this.clientId = clientIdName;
        this.accessTokenList = [];
        this.authGrantCodeList = [];
        this.refreshTokenList = [];
        this.scopes = [];
        this.redirectUris = [];
    }
    AuthProfile.prototype.addRedirectUri = function (redirectUri) {
        this.redirectUris.push(redirectUri);
    };
    AuthProfile.prototype.addAuthrantCode = function (authGrantCode) {
        this.authGrantCodeList.push(authGrantCode);
    };
    AuthProfile.prototype.addAccessToken = function (accessToken) {
        this.accessTokenList.push(accessToken);
    };
    return AuthProfile;
}());
exports.default = AuthProfile;
