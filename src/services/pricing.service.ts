import { Pricing } from "../models/pricing.model";
import QRCode from "qrcode";

// Default pricing configuration
export const DEFAULT_PRICING = {
    bwA4: 3,
    colorA4: 5,
    bwA3: 8,
    colorA3: 15,
    doubleSided: 1,
};

export const createInitialPricing = async (userId: string, shopLink: string) => {
    try {
        const pricing = new Pricing({
            userId,
            ...DEFAULT_PRICING,
        });
        const result = await pricing.save();
        return result?.toObject();
    } catch (err) {
        throw err;
    }
};

export const getPricingByUserId = async (userId: string) => {
    try {
        const result = await Pricing.findOne({ userId });
        return result?.toObject();
    } catch (err) {
        throw err;
    }
};

export const updatePricingByUserId = async (userId: string, priceData: any) => {
    try {
        const result = await Pricing.findOneAndUpdate(
            { userId },
            { ...priceData, updatedAt: new Date() },
            { new: true }
        );
        return result?.toObject();
    } catch (err) {
        throw err;
    }
};

export const generateQRCode = async (shopLink: string): Promise<string> => {
    try {
        // Generate QR code as data URL (base64 encoded image)
        const qrCode = await QRCode.toDataURL(shopLink, {
            errorCorrectionLevel: 'H',
            type: 'image/png',
            width: 300,
            margin: 1,
        });
        return qrCode;
    } catch (err) {
        throw err;
    }
};
