"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidation = exports.signUpValidation = void 0;
exports.signUpValidation = {
    name: 'string|required',
    email: 'email|required',
    password: 'string|required'
};
exports.loginValidation = {
    email: 'email|required',
    password: 'string|required'
};
