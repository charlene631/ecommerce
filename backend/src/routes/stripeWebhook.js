import { handleWebhook } from "../controllers/stripeController.js";
import express from "express";

const router = express.Router();

router.post("/", handleWebhook);

export default router;
