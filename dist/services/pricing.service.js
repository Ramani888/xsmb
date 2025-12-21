"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateQRCode = exports.updatePricing = exports.getPricingByUserId = exports.createInitialPricing = exports.DEFAULT_PRICING = void 0;
const pricing_model_1 = require("../models/pricing.model");
const qrcode_1 = __importDefault(require("qrcode"));
// Default pricing configuration
exports.DEFAULT_PRICING = {
    bwA4: 3,
    colorA4: 5,
    bwA3: 8,
    colorA3: 15,
    doubleSided: 1,
};
const createInitialPricing = async (userId, shopLink) => {
    try {
        const pricing = new pricing_model_1.Pricing({
            userId,
            ...exports.DEFAULT_PRICING,
        });
        const result = await pricing.save();
        return result?.toObject();
    }
    catch (err) {
        throw err;
    }
};
exports.createInitialPricing = createInitialPricing;
const getPricingByUserId = async (userId) => {
    try {
        const result = await pricing_model_1.Pricing.findOne({ userId });
        return result?.toObject();
    }
    catch (err) {
        throw err;
    }
};
exports.getPricingByUserId = getPricingByUserId;
const updatePricing = async (userId, priceData) => {
    try {
        const result = await pricing_model_1.Pricing.findOneAndUpdate({ userId }, { ...priceData, updatedAt: new Date() }, { new: true });
        return result?.toObject();
    }
    catch (err) {
        throw err;
    }
};
exports.updatePricing = updatePricing;
const generateQRCode = async (shopLink) => {
    try {
        // Generate QR code as data URL (base64 encoded image)
        const qrCode = await qrcode_1.default.toDataURL(shopLink, {
            errorCorrectionLevel: 'H',
            type: 'image/png',
            width: 300,
            margin: 1,
        });
        return qrCode;
    }
    catch (err) {
        throw err;
    }
};
exports.generateQRCode = generateQRCode;
