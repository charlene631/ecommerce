import { login, register, verifyEmail } from "../controllers/authController.js";
import express from "express";
import {
    validate,
    registerSchema,
    loginSchema,
} from "../validators/authValidator.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.get("/verify-email/:token", verifyEmail);
router.post("/login", validate(loginSchema), login);

export default router;
