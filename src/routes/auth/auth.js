"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = authorize;
var registeredclients_1 = __importDefault(require("./registeredclients"));
function authorize(req, res, next) {
    // check request parameters for client_id & redirect_uri
    // check if client_id is valid 
    // Then generate code
    // Must be made reusable for access token verification
    var clientId = req.query.client_id;
    var redirectUri = req.query.redirect_uri;
    var state = req.query.state;
    if ((clientId === null || clientId === void 0 ? void 0 : clientId.toString()) in registeredclients_1.default) {
        console.log('Client ID is valid');
        next();
    }
    else {
        res.send('401 Unauthorized');
    }
}
