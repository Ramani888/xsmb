"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidation = exports.signUpValidation = void 0;
exports.signUpValidation = {
    shopName: 'string|required',
    ownerName: 'string|required',
    email: 'email|required',
    password: 'string|required',
    number: 'string|required',
    country: 'string|required',
    state: 'string|required',
    city: 'string|required',
    pinCode: 'string|required',
    address: 'string|required'
};
exports.loginValidation = {
    email: 'email|required',
    password: 'string|required'
};
