"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_1 = require("./auth");
var authtypes_1 = require("./authtypes");
var router = (0, express_1.Router)();
router.get('/oauth/authorize', auth_1.authorize, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var generatedCode;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // profile should not be undefined here
                if (res.locals.profile == undefined) {
                    throw Error;
                }
                return [4 /*yield*/, (0, auth_1.generateAuthCodeGrant)(res.locals.profile)];
            case 1:
                generatedCode = _a.sent();
                // Printing this for demo purposes
                console.log("oauth/authorize: generated code is " + generatedCode);
                res.redirect(req.query.redirect_uri + '?code=' + generatedCode + '&state=' + req.query.state);
                return [2 /*return*/];
        }
    });
}); });
router.post('/oauth/token', auth_1.authorize, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var accessToken, refreshToken, _a;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                // Grant type or Profile should not be undefined here
                if (res.locals.grantType == undefined || res.locals.profile == undefined) {
                    throw Error;
                }
                _a = res.locals.grantType;
                switch (_a) {
                    case 'authorization_code': return [3 /*break*/, 1];
                    case 'refresh_token': return [3 /*break*/, 3];
                }
                return [3 /*break*/, 5];
            case 1: return [4 /*yield*/, (0, auth_1.retrieveTokensWithGrant)(res.locals.profile, req.body.code)];
            case 2:
                _b = _d.sent(), accessToken = _b[0], refreshToken = _b[1];
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, (0, auth_1.generateAccessAndRefreshToken)(res.locals.profile, (0, auth_1.createJWTPayload)(res.locals.profile, authtypes_1.Token.Access), (0, auth_1.createJWTPayload)(res.locals.profile, authtypes_1.Token.Refresh))];
            case 4:
                _c = _d.sent(), accessToken = _c[0], refreshToken = _c[1];
                return [3 /*break*/, 5];
            case 5:
                res.status(200).send({ 'access_token': accessToken, 'token_type': 'Bearer', 'refresh_token': refreshToken, 'expires_in': 3600 });
                return [2 /*return*/];
        }
    });
}); });
exports.default = router;
