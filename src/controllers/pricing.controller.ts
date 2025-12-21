import { StatusCodes } from "http-status-codes";
import { Response } from 'express';
import { AuthorizedRequest } from "../types/user";
import { getPricingByUserId, updatePricingByUserId } from "../services/pricing.service";

export const getPricing = async (req: AuthorizedRequest, res: Response) => {
    try {
        const userId = req.userData?.userId;
        
        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
        }

        const pricing = await getPricingByUserId(userId);
        
        if (!pricing) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Pricing not found" });
        }

        res.status(StatusCodes.OK).json({ success: true, data: pricing });
    } catch (error) {
        console.error("Get Pricing Error:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
    }
};

export const updateShopPricing = async (req: AuthorizedRequest, res: Response) => {
    try {
        const userId = req.userData?.userId;
        const { bwA4, colorA4, bwA3, colorA3, doubleSided } = req.body;

        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
        }

        const updateData: any = {};
        if (bwA4 !== undefined) updateData.bwA4 = bwA4;
        if (colorA4 !== undefined) updateData.colorA4 = colorA4;
        if (bwA3 !== undefined) updateData.bwA3 = bwA3;
        if (colorA3 !== undefined) updateData.colorA3 = colorA3;
        if (doubleSided !== undefined) updateData.doubleSided = doubleSided;

        const updatedPricing = await updatePricingByUserId(userId, updateData);

        res.status(StatusCodes.OK).json({ 
            success: true, 
            message: "Pricing updated successfully",
            data: updatedPricing 
        });
    } catch (error) {
        console.error("Update Pricing Error:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
    }
};
