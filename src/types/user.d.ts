type AuthorizedRequest = Express.Request & ?({ headers: { authorization: string } } & ?{ userData: JwtSign });

declare namespace Express {
  type Request = AuthorizedRequest;
}

export interface IUser {
    _id?: string;
    name: string;
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
}