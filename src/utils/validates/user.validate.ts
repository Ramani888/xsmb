export const signUpValidation = {
    name: 'string|required',
    email: 'email|required',
    password: 'string|required'
};

export const loginValidation = {
    email: 'email|required',
    password: 'string|required'
};