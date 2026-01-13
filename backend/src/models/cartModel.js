import pool from "../config/database.js";

// Récupère un produit par son id
export async function findProductById(id) {
    const [rows] = await pool.query(
        "SELECT id, name, price FROM products WHERE id = ?",
        [id]
    );
    return rows[0];
}

//Calculer le total du panier
export function calculateTotal(products) {
    return products.reduce((sum, p) => sum + p.unit_price * p.qty, 0);
}
