"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bodyvalidate_middleware_1 = require("../middleware/bodyvalidate.middleware");
const user_validate_1 = require("../utils/validates/user.validate");
const user_controller_1 = require("../controllers/user.controller");
var RouteSource;
(function (RouteSource) {
    RouteSource[RouteSource["Body"] = 0] = "Body";
    RouteSource[RouteSource["Query"] = 1] = "Query";
    RouteSource[RouteSource["Params"] = 2] = "Params";
})(RouteSource || (RouteSource = {}));
const router = express_1.default.Router();
// User Auth Routes
router.post('/signup', (0, bodyvalidate_middleware_1.validateBody)(user_validate_1.signUpValidation), user_controller_1.signup);
router.post('/login', (0, bodyvalidate_middleware_1.validateBody)(user_validate_1.loginValidation), user_controller_1.login);
exports.default = router;
