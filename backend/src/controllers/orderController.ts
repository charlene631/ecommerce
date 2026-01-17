import { Request, Response } from "express";
import * as Order from "../models/orderModel";
import {
    createCheckoutSession
} from "../middlewares/payment";
import { Cart, CartItem } from "../types/cart";
import { OrderProduct, OrderInput, OrderRow } from "../types/order";

export async function createOrder(req: Request, res: Response) {
    try {
        const buyerId = req.user;
        if (!buyerId) return res.status(401).json({ error: "Non autorisé" });

        const cart: Cart = req.cookies.cart ? (JSON.parse(req.cookies.cart) as Cart): { products: [], total: 0 };
        const products: CartItem[] = cart.products ?? [];

        if (!products.length)
            return res.status(400).json({ error: "Le panier est vide." });

       // Mapper les produits pour correspondre à OrderInput["products"]
    const dbProducts: OrderInput["products"] = products.map((p) => ({
      id: p.id,
      name: p.name,
      unit_price: p.unit_price,
      qty: p.qty,
    }));

        // Enregistrement de la commande
        const result = await Order.create({
            products: dbProducts,
            buyerId: Number(buyerId.id),
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

// Récupérer les commandes d'un acheteur
export async function findBuyerOrders(req: Request, res: Response) {
    try {
        const buyerId = req.user?.id;
        if (!buyerId) return res.status(401).json({ error: "Utilisateur non authentifié." });
        const orders: OrderRow[] = await Order.findByBuyerId(buyerId);
        if (!orders.length)
            return res.status(404).json({ error: "Aucune commande trouvée." });

        // Récupérer les produits pour chaque commande
        await Promise.all(
      orders.map(async (order) => {
        const products: OrderProduct[] = await Order.findOrderProducts({
          orderId: order.id,
          buyerId,
        });
        order.products = products;
      })
    );

        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Le serveur a rencontré une erreur.` });
    }
}

// Checkout d'une commande
export async function checkoutOrder(req: Request, res: Response) {
    try {
        const buyerId = req.user?.id;
        if (!buyerId) return res.status(401).json({ error: "Utilisateur non authentifié." });
        const orderId = Number(req.params.orderId);
        if (Number.isNaN(orderId))
            return res.status(400).json({ error: "ID de commande invalide." });
        const products: OrderProduct[] = await Order.findOrderProducts({ orderId, buyerId });

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

        // Mettre à jour du statut de la commande
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
