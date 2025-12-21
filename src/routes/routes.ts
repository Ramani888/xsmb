import express from "express";
import { validateBody } from "../middleware/bodyvalidate.middleware";
import { loginValidation, signUpValidation } from "../utils/validates/user.validate";
import { getUserProfile, login, signup, updateUserProfile } from "../controllers/user.controller";
import { getPricing, updateShopPricing } from "../controllers/pricing.controller";
import { authenticateToken } from "../utils/helpers/general";
enum RouteSource {
    Body,
    Query,
    Params
}

const router = express.Router();

// User Auth Routes
router.post('/signup', validateBody(signUpValidation), signup);
router.post('/login', validateBody(loginValidation), login)

// Pricing Routes
router.get('/pricing', getPricing);
router.put('/pricing', updateShopPricing);

router.get('/profile', authenticateToken, getUserProfile);
router.put('/profile', authenticateToken, updateUserProfile);

export default router;