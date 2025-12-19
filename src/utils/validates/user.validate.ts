export const signUpValidation = {
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

export const loginValidation = {
    email: 'email|required',
    password: 'string|required'
};