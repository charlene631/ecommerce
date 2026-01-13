import {
    checkoutOrder,
    createOrder,
    findBuyerOrders,
} from "../controllers/orderController.js";
import express from "express";

const router = express.Router();

router.post("/", createOrder);
router.get("/", findBuyerOrders);

router.post('/:orderId/checkout', checkoutOrder)

export default router;
