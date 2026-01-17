import express, { Router } from "express";
import { login, register, verifyEmail } from "../controllers/authController";
import { validate, registerSchema, loginSchema } from "../validators/authValidator";

const router: Router = express.Router();

router.post("/register", validate(registerSchema), register);
router.get("/verify-email/:token", verifyEmail);
router.post("/login", validate(loginSchema), login);

export default router;
