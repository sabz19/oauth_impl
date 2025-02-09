"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_1 = require("./auth");
var router = (0, express_1.Router)();
router.get('/oauth/authorize', auth_1.authorize, function (req, res) {
    res.send('Authorization end point hit');
});
router.post('/oauth/token', function (req, res) {
    res.send('Token end point hit!');
});
exports.default = router;
