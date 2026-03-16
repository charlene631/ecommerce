import { Request, Response } from "express";
import { findProductById, calculateTotal } from "../models/cartModel";
import { addToCartSchema } from "../validators/cartValidator";
import { CartRequest } from "src/types/cart.js";

// Récupérer le panier depuis le cookie
export async function getCart(req: Request, res: Response) {
  try {
    const cart = req.cart ?? { products: [], total: 0 };
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur." });
  }
}

// Ajouter un produit au panier
export async function addToCart(req: Request, res: Response) {
  try {
    const { error, value } = addToCartSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { id, qty } = value as { id: number; qty: number };

    const product = await findProductById(id);
    if (!product) {
      return res.status(404).json({ error: "Produit introuvable" });
    }

    const cart = req.cart ?? { products: [], total: 0 };

    const index = cart.products.findIndex((p) => p.id === id);
    if (index >= 0) {
      cart.products[index].qty += qty;
    } else {
      cart.products.push({
        id: product.productId,
        name: product.name,
        unit_price: product.unitPrice,
        qty,
      });
    }

    cart.total = calculateTotal(cart.products);

    res.cookie("cart", JSON.stringify(cart), { httpOnly: true });
    res.status(200).json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur." });
  }
}

// Supprimer un produit du panier
export async function removeFromCart(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!id) {
      return res.status(400).json({ error: "Produit requis" });
    }

    const cart = req.cart ?? { products: [], total: 0 };

    cart.products = cart.products.filter((p) => p.id !== id);
    cart.total = calculateTotal(cart.products);

    res.cookie("cart", JSON.stringify(cart), { httpOnly: true });
    res.status(200).json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur." });
  }
}

// Vérifier que le panier est valide avant commande
export async function validateCart(req: Request, res: Response) {
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
