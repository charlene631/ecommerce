import { findProductById, calculateTotal } from "../models/cartModel.js";
import { addToCartSchema } from "../validators/cartValidator.js";

//Récupérer le panier depuis le cookie
export async function getCart(req, res) {
    try {
        const cart = req.cart || { products: [], total: 0 };
        res.status(200).json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur." });
    }
}

//Ajouter un produit au panier
export async function addToCart(req, res) {
    try {
        const { error, value } = addToCartSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const { id, qty } = value;

        const product = await findProductById(id);
        if (!product) return res.status(404).json({ error: "Produit introuvable" });

        const cart = req.cart || { products: [], total: 0 };

        const index = cart.products.findIndex((p) => p.id === id);
        if (index > -1) {
            cart.products[index].qty += qty;
        } else {
            cart.products.push({ id: product.id, name: product.name, unit_price: product.price, qty });
        }

        cart.total = calculateTotal(cart.products);

        res.cookie("cart", JSON.stringify(cart), { httpOnly: true });
        res.status(200).json(cart);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur." });
    }
}

//Supprimer un produit du panier
export async function removeFromCart(req, res) {
    try {
        const id = parseInt(req.params.id, 10);
        if (!id) return res.status(400).json({ error: "Produit requis" });

        const cart = req.cart || { products: [], total: 0 };
        cart.products = cart.products.filter((p) => p.id !== id);
        cart.total = calculateTotal(cart.products);

        res.cookie("cart", JSON.stringify(cart), { httpOnly: true });
        res.status(200).json(cart);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur." });
    }
}

//Vérifier que le panier est valide avant commande
export async function validateCart(req, res) {
    try {
        const cart = req.cart;
        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ error: "Panier vide" });
        }
        res.status(200).json({ message: "Panier valide" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur." });
    }
}
