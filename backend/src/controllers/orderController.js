import * as Order from "../models/orderModel.js";
import {
    createCheckoutSession,
    createPaymentIntents,
} from "../middlewares/payment.js";

export async function createOrder(req, res) {
    try {
        const buyerId = req.user.id;
        const cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : {};
        const products = cart.products ?? [];

        if (!products.length)
            return res.status(400).json({ error: "Le panier est vide." });

        // Enregistrement de la commande
        const result = await Order.create({
            products,
            buyerId,
        });
        const orderId = result.orderId;

        if (!orderId)
            return res
                .status(500)
                .json({ error: "Erreur lors de la création de la commande." });

        // Vidage du panier
        res.clearCookie("cart");

        res.status(201).json({
            message: "La commande a été créée.",
            orderId,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({ error: `Le serveur a rencontré une erreur.` });
    }
}

export async function findBuyerOrders(req, res) {
    try {
        const buyerId = req.user.id;
        const orders = await Order.findByBuyerId(buyerId);
        if (!orders.length)
            return res.status(404).json({ error: "Aucune commande trouvée." });

        await Promise.all(
            orders.map(async (order) => {
                order.products = await Order.findOrderProducts({
                    orderId: order.id,
                    buyerId,
                });
            })
        );

        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Le serveur a rencontré une erreur.` });
    }
}

export async function checkoutOrder(req, res) {
    try {
        const buyerId = req.user.id;
        const orderId = req.params.orderId;
        const products = await Order.findOrderProducts({ orderId, buyerId });

        if (!products)
            return res.status(404).json({
                error: `La commande n'a pas été trouvée ou son contenu est vide.`,
            });

        // Paiement via Stripe Checkout Session (on récupère l'url)
        const session = await createCheckoutSession({
            buyerId,
            orderId,
            items: products,
        });

        // Payment via Stripe Payment Intents (on récupère le client_secret)
        // const paymentIntent = await createPaymentIntents({
        //     buyerId,
        //     orderId,
        //     items: products,
        // });

        const updateResult = await Order.update({
            status: "payment_in_progress",
            id: orderId,
            buyerId,
        });

        if (!updateResult.affectedRows) {
            return res.status(500).json({
                error: "Impossible de mettre à jour le statut de la commande.",
            });
        }

        res.status(201).json({
            message: "Paiement en attente...",
            orderId,
            sessionUrl: session.url,
            // clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({ error: `Le serveur a rencontré une erreur.` });
    }
}
