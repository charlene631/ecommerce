// backend/src/routes/orderRoutes.ts
import express, { Router } from "express";
import { createOrder, findBuyerOrders, checkoutOrder } from "../controllers/orderController";
import verifyAuthToken from "../middlewares/verifyAuthToken";

const router: Router = express.Router();

// Toutes ces routes nécessitent que l'utilisateur soit authentifié
router.use(verifyAuthToken);

router.post("/", createOrder);
router.get("/", findBuyerOrders);

// Checkout d'une commande spécifique
router.post("/:orderId/checkout", checkoutOrder);

export default router;
