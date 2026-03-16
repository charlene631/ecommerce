import pool from "../config/database";
import { CartItem } from "../types/cart";

export async function findProductById(id: number) {
  const [rows]: any = await pool.query(
    "SELECT id, name, price FROM products WHERE id = ?",
    [id]
  );

  if (!rows[0]) return null;

  return {
    productId: rows[0].id,
    name: rows[0].name,
    unitPrice: rows[0].price,
  };
}

export function calculateTotal(products: CartItem[]): number {
  return products.reduce(
    (sum, p) => sum + p.unit_price * p.qty,
    0
  );
}
