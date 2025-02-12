"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * cached list of registered clients
 * Ideally fetch this from using an ORM + Database in correlation with a user login
 * Each client can have multiple redirectUris, authGrantCode and access tokens
 */
var registeredClients = [];
exports.default = registeredClients;
