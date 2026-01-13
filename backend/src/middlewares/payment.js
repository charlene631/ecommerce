import Stripe from "stripe";
import env from "../config/env.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-07-30.basil",
});

// Carte de test : https://docs.stripe.com/testing?utm_source=chatgpt.com&testing-method=card-numbers#cards

// Stripe Checkout Session: Solution clé en main (pas de personnalisation côté front-nd)
export const createCheckoutSession = async ({ buyerId, orderId, items }) => {
    try {
        if (!items?.length) {
            throw new Error("Le panier est vide");
        }

        return await stripe.checkout.sessions.create({
            payment_method_types: ["card", "paypal", "sepa_debit"], // également : "customer_balance"
            line_items: items.map((i) => ({
                price_data: {
                    currency: "eur",
                    product_data: { name: i.name },
                    unit_amount: Math.round(i.unit_price * 100),
                },
                quantity: i.quantity,
            })),
            mode: "payment",
            success_url: `${env.FRONTEND_URL}/checkout/success?order_id=${orderId}&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${env.FRONTEND_URL}/checkout/cancel`,
            payment_intent_data: {
                // indispensable pour être récupéré via le webhook payment_intents.succeeded
                metadata: {
                    // Données visibles dans le dashboard de Stripe (Transactions)
                    buyerId,
                    orderId,
                },
            },
        });
    } catch (err) {
        console.error(`Stripe error : ${err}`);
        throw err;
    }
};

// Stripe Payment Intents : Solution personnalisable côté front-end
export const createPaymentIntents = async ({ buyerId, orderId, items }) => {
    try {
        const totalAmount = items.reduce((sum, item) => {
            const unitPrice = Number(item.unit_price || 0);
            const quantity = Number(item.quantity || 0);
            if (unitPrice < 0 || quantity < 0)
                throw new Error("Prix ou quantité invalide");
            return sum + unitPrice * quantity;
        }, 0);

        if (totalAmount <= 0)
            throw new Error("Le montant du panier n'est pas valide");

        const amountInCents = Math.round(totalAmount * 100);

        return await stripe.paymentIntents.create({
            payment_method_types: ["card", "paypal", "sepa_debit"], // également : "customer_balance"
            amount: amountInCents,
            currency: "eur",
            metadata: {
                // Données visibles dans le dashboard de Stripe (Transactions)
                buyerId,
                orderId,
                items: JSON.stringify(items),
            },
        });
    } catch (err) {
        console.error(`Stripe error : ${err}`);
        throw err;
    }
};
