"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const http_status_codes_1 = require("http-status-codes");
const user_service_1 = require("../services/user.service");
const general_1 = require("../utils/helpers/general");
const pricing_service_1 = require("../services/pricing.service");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const slugify_1 = __importDefault(require("slugify"));
const env = process.env;
const signup = async (req, res) => {
    try {
        const { email, password, shopName } = req.body;
        const existingUser = await (0, user_service_1.getUserByEmail)(email);
        if (existingUser) {
            return res.status(http_status_codes_1.StatusCodes.CONFLICT).json({ message: "User already exists." });
        }
        const newPassword = await (0, general_1.encryptPassword)(password);
        // Create shop link using shop name
        const shopLink = `${env.SHOP_BASE_URL}/${(0, slugify_1.default)(shopName, { lower: true })}`;
        // Generate QR code
        const qrCode = await (0, pricing_service_1.generateQRCode)(shopLink);
        // Create user with QR code and shop link
        const userData = await (0, user_service_1.createUserData)({
            ...req.body,
            email,
            password: String(newPassword),
            qrCode,
            shopLink,
        });
        // Create initial pricing for the user
        await (0, pricing_service_1.createInitialPricing)(userData._id?.toString() || '', shopLink);
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            success: true,
            message: "User created successfully.",
            user: {
                id: userData._id,
                shopName: userData.shopName,
                qrCode: userData.qrCode,
                shopLink: userData.shopLink,
            }
        });
    }
    catch (error) {
        console.error("Signup Error:", error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
    }
};
exports.signup = signup;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await (0, user_service_1.getUserByEmail)(email);
        if (!user) {
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ message: "Invalid email or password." });
        }
        const isPasswordValid = await new Promise((resolve) => (0, general_1.comparePassword)(password, String(password))
            .then((result) => resolve(result))
            .catch((error) => resolve(false)));
        if (!isPasswordValid) {
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ message: "Invalid password." });
        }
        const SECRET_KEY = env.SECRET_KEY;
        const token = jsonwebtoken_1.default.sign({ userId: user?._id?.toString(), shopName: user?.shopName }, SECRET_KEY, { expiresIn: '30d' } // expires in 30 days
        );
        return res.status(http_status_codes_1.StatusCodes.OK).send({ user: { ...user, token }, success: true, message: 'Login successful.' });
    }
    catch (error) {
        console.error("Login Error:", error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
    }
};
exports.login = login;
