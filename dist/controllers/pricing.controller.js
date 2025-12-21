"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateShopPricing = exports.getPricing = void 0;
const http_status_codes_1 = require("http-status-codes");
const pricing_service_1 = require("../services/pricing.service");
const getPricing = async (req, res) => {
    try {
        const userId = req.userData?.userId;
        if (!userId) {
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
        }
        const pricing = await (0, pricing_service_1.getPricingByUserId)(userId);
        if (!pricing) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({ message: "Pricing not found" });
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, data: pricing });
    }
    catch (error) {
        console.error("Get Pricing Error:", error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
    }
};
exports.getPricing = getPricing;
const updateShopPricing = async (req, res) => {
    try {
        const userId = req.userData?.userId;
        const { bwA4, colorA4, bwA3, colorA3, doubleSided } = req.body;
        if (!userId) {
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
        }
        const updateData = {};
        if (bwA4 !== undefined)
            updateData.bwA4 = bwA4;
        if (colorA4 !== undefined)
            updateData.colorA4 = colorA4;
        if (bwA3 !== undefined)
            updateData.bwA3 = bwA3;
        if (colorA3 !== undefined)
            updateData.colorA3 = colorA3;
        if (doubleSided !== undefined)
            updateData.doubleSided = doubleSided;
        const updatedPricing = await (0, pricing_service_1.updatePricing)(userId, updateData);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: "Pricing updated successfully",
            data: updatedPricing
        });
    }
    catch (error) {
        console.error("Update Pricing Error:", error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
    }
};
exports.updateShopPricing = updateShopPricing;
