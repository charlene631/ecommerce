import {
    createProduct,
    findSellerProducts,
    updateProduct,
    deleteProduct,
} from "../controllers/productController.js";
import express from "express";
import uploadImage from "../middlewares/uploadImage.js";
import {
    createProductSchema,
    updateProductSchema,
    validate,
} from "../validators/productValidator.js";

const router = express.Router();

router.post(
    "/",
    uploadImage.single("imageUrl"),
    validate(createProductSchema),
    createProduct
);
router.get("/", findSellerProducts);
router.patch(
    "/:id",
    uploadImage.single("imageUrl"),
    validate(updateProductSchema),
    updateProduct
);
router.delete("/:id", deleteProduct);

export default router;
