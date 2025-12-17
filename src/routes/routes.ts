import express from "express";
import { validateBody } from "../middleware/bodyvalidate.middleware";
import { loginValidation, signUpValidation } from "../utils/validates/user.validate";
import { login, signup } from "../controllers/user.controller";
enum RouteSource {
    Body,
    Query,
    Params
}

const router = express.Router();

// User Auth Routes
router.post('/signup', validateBody(signUpValidation), signup);
router.post('/login', validateBody(loginValidation), login)

export default router;