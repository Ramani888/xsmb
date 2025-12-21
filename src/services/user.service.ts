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

export const getUserById = async (userId: string) => {
    try {
        const result = await User?.findById(userId);
        return result?.toObject();
    } catch (err) {
        throw err;
    }
}

export const updateUserById = async (userId: string, updateData: Partial<IUser>) => {
    try {
        const result = await User?.findByIdAndUpdate(
            userId,
            { ...updateData, updatedAt: new Date() },
            { new: true }
        );
        return result?.toObject();
    } catch (err) {
        throw err;
    }
}