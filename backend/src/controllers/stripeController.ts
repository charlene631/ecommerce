// backend/src/controllers/stripeController.ts
import Stripe from "stripe";
import * as Order from "../models/orderModel";
import { Request, Response } from "express";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-08-27.basil",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export const handleWebhook = async (req: Request, res: Response) => {
  try {
    const sig = req.headers["stripe-signature"];
    if (!sig) throw new Error("Stripe signature missing");

    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      endpointSecret
    );

    const metadata = (event.data.object as any).metadata;
    const orderId = Number(metadata.orderId);
    const buyerId = Number(metadata.buyerId);

    switch (event.type) {
      case "payment_intent.succeeded":
        await Order.update({ status: "paid", id: orderId, buyerId });
        console.log(`Paiement réussi pour la commande ${orderId}`);
        break;

      case "payment_intent.payment_failed":
        await Order.update({ status: "failed", id: orderId, buyerId });
        console.log(`Paiement échoué pour la commande ${orderId}`);
        break;

      default:
        console.log(`Unhandled event type : ${event.type}`);
    }

    res.status(200).send("Received");
  } catch (err: any) {
    console.error("Webhook signature verification failed.", err.message);
    res.status(400).send(`Stripe Webhook Error: ${err.message}`);
  }
};
