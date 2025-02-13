"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = authorize;
exports.generateAccessAndRefreshToken = generateAccessAndRefreshToken;
exports.generateAuthCodeGrant = generateAuthCodeGrant;
exports.validateAuthCode = validateAuthCode;
exports.retrieveTokensWithGrant = retrieveTokensWithGrant;
exports.createJWTPayload = createJWTPayload;
var authtypes_1 = require("./authtypes");
var jose = __importStar(require("jose"));
var node_crypto_1 = __importDefault(require("node:crypto"));
var node_fs_1 = __importDefault(require("node:fs"));
var path_1 = __importDefault(require("../../env/path"));
var registeredclients_1 = __importDefault(require("./registeredclients"));
/**
 * Authorization middleware for clients
 * grant code flow - for auth code grant to be generated, the client must be registered & the user must be authenticated
 * access token flow -
 * refresh token flow -
 * @param req - request from client
 * @param res - response to send back to client
 * @param next - call next middleware or router
 */
function authorize(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var unauthorized, responseType, clientId, redirectUri, grantType, clientId, redirectUri, code, refreshToken, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    unauthorized = true;
                    if (req.method == 'GET') {
                        responseType = req.query.response_type;
                        clientId = req.query.client_id;
                        redirectUri = req.query.redirect_uri;
                        switch (responseType === null || responseType === void 0 ? void 0 : responseType.toString()) {
                            case 'code':
                                if (userIsAuthenticated(req) && validateClientAndUri(clientId === null || clientId === void 0 ? void 0 : clientId.toString(), redirectUri === null || redirectUri === void 0 ? void 0 : redirectUri.toString(), res)) {
                                    unauthorized = false;
                                    next();
                                }
                                break;
                            //other cases such as implicit grant flow
                            default: console.log('Invalid Response Type');
                        }
                    }
                    if (!(req.method == 'POST')) return [3 /*break*/, 6];
                    grantType = req.body.grant_type;
                    clientId = req.body.client_id;
                    redirectUri = req.body.redirect_uri;
                    code = req.body.code;
                    refreshToken = req.body.refresh_token;
                    _a = grantType === null || grantType === void 0 ? void 0 : grantType.toString();
                    switch (_a) {
                        case 'authorization_code': return [3 /*break*/, 1];
                        case 'refresh_token': return [3 /*break*/, 2];
                    }
                    return [3 /*break*/, 5];
                case 1:
                    if (validateClientAndUri(clientId === null || clientId === void 0 ? void 0 : clientId.toString(), redirectUri === null || redirectUri === void 0 ? void 0 : redirectUri.toString(), res)) {
                        if (validateAuthCode(res.locals.profile, code)) {
                            console.log('Auth code is valid, sending back token');
                            unauthorized = false;
                            res.locals.grantType = grantType.toString();
                            next();
                        }
                    }
                    return [3 /*break*/, 6];
                case 2:
                    if (!validateClientAndUri(clientId === null || clientId === void 0 ? void 0 : clientId.toString(), redirectUri === null || redirectUri === void 0 ? void 0 : redirectUri.toString(), res)) return [3 /*break*/, 4];
                    console.log('Validating refresh token...');
                    return [4 /*yield*/, validateRefreshToken(res.locals.profile, refreshToken === null || refreshToken === void 0 ? void 0 : refreshToken.toString())];
                case 3:
                    if (_b.sent()) {
                        unauthorized = false;
                        res.locals.grantType = grantType.toString();
                        next();
                    }
                    _b.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    console.log('Invalid Grant Type');
                    _b.label = 6;
                case 6:
                    if (unauthorized) {
                        res.status(401).send('Unauthorized');
                    }
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Method must verify the user's session information
 * Identity providers can be different from resource owner
 * @returns true if user is authenticated
 */
function userIsAuthenticated(req) {
    // Returning default true for this demo, but must be based on real user session authentication
    return true;
}
/**
 * Generate a one time auth code that is valid for 30 seconds
 * Store code -> access token mapping to retrieve the access token for future requests
 * @returns auth code
 */
function generateAuthCodeGrant(profile) {
    return __awaiter(this, void 0, void 0, function () {
        var authCode, accessTokenPayload, refreshTokenPayload, _a, accessToken, refreshToken, authCodeObj;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    authCode = node_crypto_1.default.randomBytes(16).toString('hex');
                    accessTokenPayload = createJWTPayload(profile, authtypes_1.Token.Access);
                    refreshTokenPayload = createJWTPayload(profile, authtypes_1.Token.Refresh);
                    return [4 /*yield*/, generateAccessAndRefreshToken(profile, accessTokenPayload, refreshTokenPayload)];
                case 1:
                    _a = _b.sent(), accessToken = _a[0], refreshToken = _a[1];
                    authCodeObj = {
                        'code': authCode,
                        'accessToken': accessToken,
                        'refreshToken': refreshToken,
                        'expiration': new Date(Date.now() + 30 * 1000)
                    };
                    profile.addAuthrantCode(authCodeObj);
                    return [2 /*return*/, authCode];
            }
        });
    });
}
/**
 * Generate both JWT access token & JWT refresh token
 * @param authCodeGrant string
 * @returns a JWT access token
 */
function generateAccessAndRefreshToken(profile, accessTokenPayload, refreshTokenPayload) {
    return __awaiter(this, void 0, void 0, function () {
        var accessToken, refreshToken, privateKey, key, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    accessToken = null;
                    refreshToken = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, node_fs_1.default.promises.readFile(path_1.default.pKeyPath, 'utf8')];
                case 2:
                    privateKey = _a.sent();
                    return [4 /*yield*/, jose.importPKCS8(privateKey, 'RS256')];
                case 3:
                    key = _a.sent();
                    return [4 /*yield*/, new jose.SignJWT({ accessTokenPayload: accessTokenPayload })
                            .setProtectedHeader({ alg: 'RS256' })
                            .setIssuedAt()
                            .setExpirationTime('1h')
                            .sign(key)];
                case 4:
                    accessToken = _a.sent();
                    return [4 /*yield*/, new jose.SignJWT({ refreshTokenPayload: refreshTokenPayload })
                            .setProtectedHeader({ alg: 'RS256' })
                            .setIssuedAt()
                            .setExpirationTime('1d')
                            .sign(key)];
                case 5:
                    refreshToken = _a.sent();
                    profile.addAccessToken(accessToken)
                        .addRefreshToken(refreshToken);
                    return [3 /*break*/, 7];
                case 6:
                    error_1 = _a.sent();
                    console.error('Error generating JWT token:', error_1);
                    throw error_1;
                case 7: return [2 /*return*/, [accessToken, refreshToken]];
            }
        });
    });
}
/**
 * Validate if a given request from a user is a valid auth code grant
 * If auth code has expired, remove it from the list
 * @param authCode
 * @returns
 */
function validateAuthCode(profile, authCode) {
    for (var _i = 0, _a = profile['authGrantCodeList']; _i < _a.length; _i++) {
        var code = _a[_i];
        if (code['code'] == authCode && code['expiration'] > new Date()) {
            return true;
        }
        // Invalidate the code if it is expired
        if (code['code'] == authCode && code['expiration'] < new Date()) {
            profile['authGrantCodeList'] = profile['authGrantCodeList'].filter(function (code) { return code['code'] != authCode; });
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
function validateRefreshToken(profile, refreshToken) {
    return __awaiter(this, void 0, void 0, function () {
        var payload, _a, _b, _c, expTime, _i, _d, token, error_2;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 3, , 4]);
                    _b = (_a = jose).jwtVerify;
                    _c = [refreshToken];
                    return [4 /*yield*/, loadRSAPublicKey()];
                case 1: return [4 /*yield*/, _b.apply(_a, _c.concat([_e.sent()]))];
                case 2:
                    payload = (_e.sent());
                    expTime = ((JSON.parse(JSON.stringify(payload))['payload']['refreshTokenPayload']['exp']));
                    console.log(Number(Date.now()));
                    if (expTime > Number(Date.now())) {
                        for (_i = 0, _d = profile['refreshTokenList']; _i < _d.length; _i++) {
                            token = _d[_i];
                            if (token.toString() == refreshToken) {
                                console.log(['Refresh token is valid!']);
                                return [2 /*return*/, true];
                            }
                        }
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _e.sent();
                    console.error('Error validating refresh token:', error_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, false];
            }
        });
    });
}
function validateClientAndUri(clientId, redirectUri, res) {
    var _a;
    for (var _i = 0, registeredClients_1 = registeredclients_1.default; _i < registeredClients_1.length; _i++) {
        var profile = registeredClients_1[_i];
        if (profile['clientId'] == (clientId === null || clientId === void 0 ? void 0 : clientId.toString())
            && ((_a = profile['redirectUris']) === null || _a === void 0 ? void 0 : _a.includes(redirectUri === null || redirectUri === void 0 ? void 0 : redirectUri.toString()))) {
            res.locals.profile = profile;
            return true;
        }
    }
}
function retrieveTokensWithGrant(profile, authCode) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, _a, code;
        return __generator(this, function (_b) {
            for (_i = 0, _a = profile['authGrantCodeList']; _i < _a.length; _i++) {
                code = _a[_i];
                console.log('code = ' + code);
                if (code['code'] == authCode) {
                    return [2 /*return*/, [code['accessToken'], code['refreshToken']]];
                }
            }
            return [2 /*return*/, null];
        });
    });
}
/**
 * Assuming user tries to access resources, this method needs to be called to validate the access token & expiration
 * @param accessToken JWT
 * @returns Boolean
 */
function validateAccessToken(accessToken) {
    return false;
}
function loadRSAPublicKey() {
    return __awaiter(this, void 0, void 0, function () {
        var publicPem, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, node_fs_1.default.promises.readFile(path_1.default.publicKeyPath, 'utf8')];
                case 1:
                    publicPem = _a.sent();
                    return [4 /*yield*/, jose.importSPKI(publicPem, 'RS256')];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    error_3 = _a.sent();
                    console.error('Error loading public key:', error_3);
                    throw error_3;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function createJWTPayload(profile, tokenType) {
    var accessTokenExpiry = Date.now() + 1000 * 60 * 60;
    var refreshTokenExpiry = Date.now() + 1000 * 60 * 60 * 24;
    var payload = {
        'sub': profile['clientId'],
        'aud': '',
        'iss': '',
        'iat': Date.now(),
        'exp': tokenType == authtypes_1.Token.Access ? accessTokenExpiry : refreshTokenExpiry
    };
    return payload;
}
