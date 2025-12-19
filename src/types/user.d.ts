type AuthorizedRequest = Express.Request & ?({ headers: { authorization: string } } & ?{ userData: JwtSign });

declare namespace Express {
  type Request = AuthorizedRequest;
}

export interface IUser {
    _id?: string;
    shopName: string;
    ownerName: string;
    email: string;
    password: string;
    number: string;
    country: string;
    state: string;
    city: string;
    pincode: string;
    address: string;
    createdAt?: Date;
    updatedAt?: Date;
}