import { StatusCodes } from "http-status-codes";
import { Response } from 'express';
import { AuthorizedRequest } from "../types/user";
import { createUserData, getUserByEmail } from "../services/user.service";
import { comparePassword, encryptPassword } from "../utils/helpers/general";
import jwt from 'jsonwebtoken';
const env = process.env;

export const signup = async (req: AuthorizedRequest, res: Response) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(StatusCodes.CONFLICT).json({ message: "User already exists." });
        }

        const newPassword = await encryptPassword(password);

        await createUserData({ name, email, password: String(newPassword) });

        res.status(StatusCodes.CREATED).json({ message: "User created successfully." });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
    }
};

export const login = async (req: AuthorizedRequest, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid email or password." });
        }

        const isPasswordValid = await new Promise((resolve) =>
            comparePassword(password, String(password))
            .then((result) => resolve(result))
            .catch((error) => resolve(false))
        );

        if (!isPasswordValid) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid password." });
        }

        const SECRET_KEY: any = env.SECRET_KEY;
        const token = jwt.sign(
            { userId: user?._id?.toString(), name: user?.name },
            SECRET_KEY,
            { expiresIn: '30d' } // expires in 30 days
        );

        return res.status(StatusCodes.OK).send({ user: {...user, token}, success: true, message: 'Login successful.' });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
    }
}