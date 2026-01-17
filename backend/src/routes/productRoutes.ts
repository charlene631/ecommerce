// src/routes/productRoutes.ts
import express, { Router } from "express";
import {
  createProduct,
  findSellerProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";
import uploadImage from "../middlewares/uploadImage";
import {
  createProductSchema,
  updateProductSchema,
  validate,
} from "../validators/productValidator";
import { verifyAuthToken } from "../middlewares/verifyAuthToken";
import isSeller from "../middlewares/verifyRole";

const router: Router = express.Router();

// Création d'un produit
router.post(
  "/",
  verifyAuthToken,
  isSeller,
  uploadImage.single("imageUrl"),
  validate(createProductSchema),
  createProduct
);

// Liste des produits du vendeur
router.get("/", verifyAuthToken, isSeller, findSellerProducts);

// Mise à jour d'un produit
router.patch(
  "/:id",
  verifyAuthToken,
  isSeller,
  uploadImage.single("imageUrl"),
  validate(updateProductSchema),
  updateProduct
);

// Suppression d'un produit
router.delete("/:id", verifyAuthToken, isSeller, deleteProduct);

export default router;
