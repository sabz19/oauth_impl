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
        return this;
    };
    AuthProfile.prototype.addAuthrantCode = function (authGrantCode) {
        this.authGrantCodeList.push(authGrantCode);
        return this;
    };
    AuthProfile.prototype.addAccessToken = function (accessToken) {
        this.accessTokenList.push(accessToken);
        return this;
    };
    AuthProfile.prototype.addRefreshToken = function (refreshToken) {
        this.refreshTokenList.push(refreshToken);
        return this;
    };
    return AuthProfile;
}());
exports.default = AuthProfile;
