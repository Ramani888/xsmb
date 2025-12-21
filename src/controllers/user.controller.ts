import { StatusCodes } from "http-status-codes";
import { Response } from 'express';
import { AuthorizedRequest } from "../types/user";
import { createUserData, getUserByEmail, getUserById, updateUserById } from "../services/user.service";
import { comparePassword, encryptPassword } from "../utils/helpers/general";
import { createInitialPricing, generateQRCode, getPricingByUserId, updatePricingByUserId } from "../services/pricing.service";
import jwt from 'jsonwebtoken';
import slugify from "slugify";
const env = process.env;

export const signup = async (req: AuthorizedRequest, res: Response) => {
    try {
        const { email, password, shopName } = req.body;

        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(StatusCodes.CONFLICT).json({ message: "User already exists." });
        }

        const newPassword = await encryptPassword(password);

        // Create shop link using shop name
        const shopLink = `${env.SHOP_BASE_URL}/${slugify(shopName, { lower: true })}`;

        // Generate QR code
        const qrCode = await generateQRCode(shopLink);

        // Create user with QR code and shop link
        const userData = await createUserData({ 
            ...req.body, 
            email, 
            password: String(newPassword),
            qrCode,
            shopLink,
        });

        // Create initial pricing for the user
        await createInitialPricing(userData._id?.toString() || '', shopLink);

        res.status(StatusCodes.CREATED).json({ 
            success: true, 
            message: "User created successfully.",
            user: {
                id: userData._id,
                shopName: userData.shopName,
                qrCode: userData.qrCode,
                shopLink: userData.shopLink,
            }
        });
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
            { userId: user?._id?.toString(), shopName: user?.shopName },
            SECRET_KEY,
            { expiresIn: '30d' } // expires in 30 days
        );

        return res.status(StatusCodes.OK).send({ user: {...user, token}, success: true, message: 'Login successful.' });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
    }
}

export const getUserProfile = async (req: AuthorizedRequest, res: Response) => {
    try {
        const userId = req.user?.userId;

        const user = await getUserById(userId || '');
        const pricing = await getPricingByUserId(userId || '');

        res.status(StatusCodes.OK).json({ 
            success: true, 
            data: {
                ...user,
                pricing
            }
        });
    } catch (error) {
        console.error("Get User Profile Error:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
    }
}

export const updateUserProfile = async (req: AuthorizedRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const updateData = req.body;
        
        const updatedUser = await updateUserById(userId || '', updateData);
        const updatedPricing = await updatePricingByUserId(userId || '', updateData?.pricing || {});

        res.status(StatusCodes.OK).json({ success: true, data: { ...updatedUser, pricing: updatedPricing }, message: "User profile updated successfully." });
    } catch (error) {
        console.error("Update User Profile Error:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
    }
}