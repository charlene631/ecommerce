import { Request, Response } from "express";
import * as Product from "../models/productModel";

export async function createProduct(req: Request, res: Response) {
  try {
    const sellerId = (req as Request & { user?: { id: number } }).user?.id;;
    if (!sellerId) return res.status(401).json({ error: "Utilisateur non authentifié." });

    const { name, price, description, categoryId, imageUrl, stock } = req.body;

    const result = await Product.create({
      name,
      price,
      description,
      categoryId,
      imageUrl,
      stock,
      sellerId,
    });

    res.status(201).json({
      message: "Le produit a été créé.",
      result,
    });
  } catch (error: any) {
    console.error(error);
    if (
      error.code === "ER_NO_REFERENCED_ROW_2" &&
      error.sqlMessage?.includes("category_id")
    ) {
      return res.status(400).json({ error: `Cette catégorie n'existe pas` });
    }
    res.status(500).json({ error: `Le serveur a rencontré une erreur.` });
  }
}

export async function findSellerProducts(req: Request, res: Response) {
  try {
    const sellerId = (req as Request & { user?: { id: number } }).user?.id;
    if (!sellerId) return res.status(401).json({ error: "Utilisateur non authentifié." });

    const products = await Product.findBySellerId(sellerId);

    if (!products || products.length === 0) {
      return res.status(404).json({ error: `Aucun produit trouvé.` });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `Le serveur a rencontré une erreur.` });
  }
}

export async function updateProduct(req: Request, res: Response) {
  try {
    const sellerId = (req as Request & { user?: { id: number } }).user?.id;
    if (!sellerId) return res.status(401).json({ error: "Utilisateur non authentifié." });

    const { id } = req.params;
    const productId = Number(id);
    if (Number.isNaN(productId)) {
      return res.status(400).json({ error: "ID de produit invalide." });
    }
    const { name, price, description, categoryId, imageUrl, stock } = req.body;

    const result = await Product.update({
      id: productId,
      sellerId,
      name,
      price,
      description,
      categoryId,
      imageUrl,
      stock,
    });

    if (!result.affectedRows) {
      return res.status(404).json({ error: "Produit non trouvé." });
    }

    res.status(200).json({
      message: "Les données du produit ont été mises à jour.",
      result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `Le serveur a rencontré une erreur.` });
  }
}

export async function deleteProduct(req: Request, res: Response) {
  try {
    const sellerId = (req as Request & { user?: { id: number } }).user?.id;
    if (!sellerId) return res.status(401).json({ error: "Utilisateur non authentifié." });

    const { id } = req.params;

    const result = await Product.remove({ id: Number(id), sellerId });

    if (!result.affectedRows) {
      return res.status(404).json({ error: `Produit non trouvé.` });
    }

    res.status(200).json({
      message: "Le produit a été supprimé.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `Le serveur a rencontré une erreur.` });
  }
}
