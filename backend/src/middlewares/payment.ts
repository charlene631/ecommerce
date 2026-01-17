// backend/src/middlewares/payment.ts
import Stripe from "stripe";
import env from "../config/env";
import { OrderProduct } from "../types/order";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-08-27.basil",
});

interface CheckoutSessionParams {
  buyerId: number;
  orderId: number;
  items: OrderProduct[];
}

export const createCheckoutSession = async ({
  buyerId,
  orderId,
  items,
}: CheckoutSessionParams) => {
  if (!items?.length) throw new Error("Le panier est vide");

  return await stripe.checkout.sessions.create({
    payment_method_types: ["card", "paypal", "sepa_debit"],
    line_items: items.map((i) => ({
      price_data: {
        currency: "eur",
        product_data: { name: i.name },
        unit_amount: Math.round(i.unit_price * 100),
      },
      quantity: i.qty, // utiliser .qty comme dans OrderProduct
    })),
    mode: "payment",
    success_url: `${env.FRONTEND_URL}/checkout/success?order_id=${orderId}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.FRONTEND_URL}/checkout/cancel`,
    payment_intent_data: {
      metadata: { buyerId, orderId },
    },
  });
};

export const createPaymentIntents = async ({
  buyerId,
  orderId,
  items,
}: CheckoutSessionParams) => {
  const totalAmount = items.reduce((sum, item) => sum + item.unit_price * item.qty, 0);
  if (totalAmount <= 0) throw new Error("Le montant du panier n'est pas valide");

  return await stripe.paymentIntents.create({
    payment_method_types: ["card", "paypal", "sepa_debit"],
    amount: Math.round(totalAmount * 100),
    currency: "eur",
    metadata: { buyerId, orderId, items: JSON.stringify(items) },
  });
};
