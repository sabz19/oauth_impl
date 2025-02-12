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
exports.generateAccessToken = generateAccessToken;
exports.generateAuthCodeGrant = generateAuthCodeGrant;
exports.validateAuthCode = validateAuthCode;
exports.retrieveAccessToken = retrieveAccessToken;
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
    // check request parameters for client_id & redirect_uri & response_type
    // if response_type = code do the following
    // check if client_id is valid 
    // check if redirect_uri is valid
    // Then generate code JWT token & match it with the redirect_uri
    var _a, _b;
    var unauthorized = true;
    if (req.method == 'GET') {
        var responseType = req.query.response_type;
        var clientId = req.query.client_id;
        var redirectUri = req.query.redirect_uri;
        var state = req.query.state;
        switch (responseType === null || responseType === void 0 ? void 0 : responseType.toString()) {
            case 'code':
                if (userIsAuthenticated(req)) {
                    for (var _i = 0, registeredClients_1 = registeredclients_1.default; _i < registeredClients_1.length; _i++) {
                        var profile = registeredClients_1[_i];
                        if (profile['clientId'] == (clientId === null || clientId === void 0 ? void 0 : clientId.toString())
                            && ((_a = profile['redirectUris']) === null || _a === void 0 ? void 0 : _a.includes(redirectUri === null || redirectUri === void 0 ? void 0 : redirectUri.toString()))) {
                            {
                                unauthorized = false;
                                res.locals.profile = profile;
                                next();
                            }
                        }
                    }
                }
                break;
            //other cases such as implicit grant flow
            default: console.log('Invalid Response Type');
        }
    }
    if (req.method == 'POST') {
        var grantType = req.body.grant_type;
        var clientId = req.body.client_id;
        var redirectUri = req.body.redirect_uri;
        var state = req.body.state;
        var code = req.body.code;
        switch (grantType === null || grantType === void 0 ? void 0 : grantType.toString()) {
            case 'authorization_code':
                for (var _c = 0, registeredClients_2 = registeredclients_1.default; _c < registeredClients_2.length; _c++) {
                    var profile = registeredClients_2[_c];
                    if (profile['clientId'] == (clientId === null || clientId === void 0 ? void 0 : clientId.toString())
                        && ((_b = profile['redirectUris']) === null || _b === void 0 ? void 0 : _b.includes(redirectUri === null || redirectUri === void 0 ? void 0 : redirectUri.toString()))) {
                        {
                            console.log('Validating auth code...');
                            if (validateAuthCode(profile, code)) {
                                console.log('Auth code is valid, sending back token');
                                unauthorized = false;
                                res.locals.profile = profile;
                                next();
                            }
                        }
                    }
                }
                break;
            case 'refresh_token':
                break;
            default: console.log('Invalid Grant Type');
        }
    }
    if (unauthorized) {
        res.status(401).send('Unauthorized');
    }
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
        var authCode, payload, authCodeObj, _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    authCode = node_crypto_1.default.randomBytes(16).toString('hex');
                    payload = {
                        'sub': profile['clientId'],
                        'aud': '',
                        'exp': Date.now() + 24 * 1000 * 60 * 60,
                        'iat': Date.now(),
                        'iss': ''
                    };
                    _b = {
                        'code': authCode
                    };
                    _a = 'accessToken';
                    return [4 /*yield*/, generateAccessToken(profile, payload)];
                case 1:
                    authCodeObj = (_b[_a] = _c.sent(),
                        _b['expiration'] = new Date(Date.now() + 30 * 1000),
                        _b);
                    profile.addAuthrantCode(authCodeObj);
                    return [2 /*return*/, authCode];
            }
        });
    });
}
/**
 * Generate a JWT access token
 * @param authCodeGrant string
 * @returns a JWT access token
 */
function generateAccessToken(profile, payload) {
    return __awaiter(this, void 0, void 0, function () {
        var jwt, privateKey, key, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    jwt = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, node_fs_1.default.promises.readFile(path_1.default.pKeyPath, 'utf8')];
                case 2:
                    privateKey = _a.sent();
                    return [4 /*yield*/, jose.importPKCS8(privateKey, 'RS256')];
                case 3:
                    key = _a.sent();
                    return [4 /*yield*/, new jose.SignJWT({ payload: payload })
                            .setProtectedHeader({ alg: 'RS256' })
                            .setIssuedAt()
                            .setExpirationTime('12h')
                            .sign(key)];
                case 4:
                    jwt = _a.sent();
                    profile.addAccessToken(jwt);
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    console.error('Error generating JWT token:', error_1);
                    throw error_1;
                case 6: return [2 /*return*/, jwt];
            }
        });
    });
}
/**
 * Validate if a given request from a user is a valid auth code grant
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
function retrieveAccessToken(profile, authCode) {
    for (var _i = 0, _a = profile['authGrantCodeList']; _i < _a.length; _i++) {
        var code = _a[_i];
        if (code['code'] == authCode) {
            return code['accessToken'];
        }
    }
    return null;
}
/**
 * Assuming user tries to access resources, this method needs to be called to validate the access token & expiration
 * @param accessToken JWT
 * @returns Boolean
 */
function validateAccessToken(accessToken) {
    return false;
}
