import "dotenv/config";
import Stripe from "stripe";
import * as Order from "../models/orderModel.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-07-30.basil",
});
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const handleWebhook = async (req, res) => {
    try {
        const sig = req.headers["stripe-signature"];
        const event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            endpointSecret
        );

        // Récupération des metadatas
        const { orderId, buyerId } = event.data.object.metadata;
        // console.log(event.data.object.metadata);

        // Traitement de l'événement
        switch (event.type) {
            // paiement réussi
            case "payment_intent.succeeded":
                const updateResult = await Order.update({
                    status: "paid",
                    id: orderId,
                    buyerId,
                });

                if (!updateResult.affectedRows)
                    console.error(
                        `Impossible de mettre à jour le statut de la commande ${orderId}.`
                    );

                console.log(`Paiement réussi pour la commande ${orderId}`);
                break;

            // paiement échoué
            case "payment_intent.payment_failed":
                const updateResult2 = await Order.update({
                    status: "failed",
                    id: orderId,
                    buyerId,
                });

                if (!updateResult2.affectedRows)
                    console.error(
                        `Impossible de mettre à jour le statut de la commande ${orderId}.`
                    );

                console.log(`Paiement échoué pour la commande ${orderId}`);
                break;

            default:
                console.log(`Unhandled event type : ${event.type}`);
        }

        res.status(200).send("Received");
    } catch (err) {
        console.error("Webhook signature verification failed.", err.message);
        return res.status(400).send(`Stripe Webhook Error: ${err.message}`);
    }
};
