// backend/src/routes/stripeWebhook.ts
import express, { Request, Response } from "express";
import { handleWebhook } from "../controllers/stripeController";

const router = express.Router();

// Stripe exige que le body soit brut pour vérifier la signature
router.post(
  "/",
  express.raw({ type: "application/json" }),
  (req: Request, res: Response) => {
    handleWebhook(req, res);
  }
);

export default router;
