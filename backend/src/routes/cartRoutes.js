import express from "express";
import { getCart, addToCart, removeFromCart, validateCart } from "../controllers/cartController.js";

const router = express.Router();

// Récupérer le panier (accessible sans login)
router.get("/", getCart);

// Ajouter un produit au panier
router.post("/add", addToCart);

// Supprimer un produit du panier
router.delete("/remove/:id", removeFromCart);

// Vérifier si panier valide (non vide)
router.get("/validate", validateCart);

export default router;
