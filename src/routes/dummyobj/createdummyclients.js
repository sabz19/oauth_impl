"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var registeredclients_1 = __importDefault(require("../auth/registeredclients"));
var authprofile_1 = __importDefault(require("../auth/authprofile"));
function createDummyClients() {
    var upfirstProfile = new authprofile_1.default('upfirst');
    upfirstProfile.addRedirectUri('http://localhost:8081');
    registeredclients_1.default.push(upfirstProfile);
}
exports.default = createDummyClients;
