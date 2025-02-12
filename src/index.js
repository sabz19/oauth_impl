"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var routes_1 = __importDefault(require("./routes/routes"));
var createdummyclients_1 = __importDefault(require("./routes/dummyobj/createdummyclients"));
var app = (0, express_1.default)();
var port = 8080;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(routes_1.default);
// Call to create a dummy client with client ID 'upfirst'
(0, createdummyclients_1.default)();
app.listen(port, function () {
    console.log("Server is active & listening on PORT ".concat(port));
});
