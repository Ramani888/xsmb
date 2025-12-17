import { User } from "../models/user.model";
import { IUser } from "../types/user";

export const getUserByEmail = async (email: string) => {
    try {
        const updatedEmail = email?.toLowerCase();
        const result = await User?.findOne({ email: updatedEmail });
        return result?.toObject();
    } catch (err) {
        throw err;
    }
}

export const createUserData = async (data: IUser) => {
    try {
        const user = new User(data);
        const result = await user.save();
        return result?.toObject();
    } catch (err) {
        throw err;
    }
}