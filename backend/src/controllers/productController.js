import * as Product from "../models/productModel.js";

export async function createProduct(req, res) {
    try {
        const sellerId = req.user.id;
        const { name, price, description, categoryId, imageUrl, stock } =
            req.body;

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
            result: result,
        });
    } catch (error) {
        console.error(error);
        if (
            error.code === "ER_NO_REFERENCED_ROW_2" &&
            error.sqlMessage.includes("category_id")
        )
            res.status(400).json({ error: `Cette catégorie n'existe pas` });

        res.status(500).json({ error: `Le serveur a rencontré une erreur.` });
    }
}

export async function findSellerProducts(req, res) {
    try {
        const sellerId = req.user?.id;
        const products = await Product.findBySellerId(sellerId);

        if (!products)
            return res.status(404).json({ error: `Aucun produit trouvé.` });
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Le serveur a rencontré une erreur.` });
    }
}

export async function updateProduct(req, res) {
    try {
        const sellerId = req.user.id;
        const { id } = req.params;
        const { name, price, description, categoryId, imageUrl, stock } =
            req.body;

        const result = await Product.update({
            name,
            price,
            description,
            categoryId,
            imageUrl,
            stock,
            id,
            sellerId,
        });

        if (!result.affectedRows)
            return res.status(404).json({ error: "produit non trouvé ." });

        res.status(200).json({
            message: "Les données du produit ont été mises à jour.",
            result: result,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({ error: `Le serveur a rencontré une erreur.` });
    }
}

export async function deleteProduct(req, res) {
    try {
        const sellerId = req.user.id;
        const { id } = req.params;

        const result = await Product.remove({ id, sellerId });

        if (!result.affectedRows)
            return res.status(404).json({ error: `produit non trouvé.` });

        res.status(200).json({
            message: "Le produit a été supprimé.",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Le serveur a rencontré une erreur.` });
    }
}
