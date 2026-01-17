// backend/src/models/orderModel.ts
import pool from "../config/database";
import { OrderInput, OrderUpdate, OrderRow, OrderProduct } from "../types/order";

// Créer une commande
export async function create({ products, buyerId }: OrderInput) {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const [result] = await conn.query(
      `INSERT INTO orders (buyer_id) VALUES (?)`,
      [buyerId]
    );

    // @ts-ignore
    const orderId: number = result.insertId;

    await Promise.all(
      products.map((p) =>
        conn.query(
          `INSERT INTO order_products (product_id, unit_price, quantity, order_id) VALUES (?, ?, ?, ?)`,
          [p.id, p.unit_price, p.qty, orderId]
        )
      )
    );

    await conn.commit();
    return { orderId, buyerId, products };
  } catch (error: any) {
    await conn.rollback();
    console.error("Erreur création commande :", error.message);
    throw error;
  } finally {
    conn.release();
  }
}

// Récupérer toutes les commandes d'un acheteur
export async function findByBuyerId(buyerId: number): Promise<OrderRow[]> {
  const [rows] = await pool.query(
    `SELECT id, status, created_at, updated_at FROM orders WHERE buyer_id = ?`,
    [buyerId]
  );
  return rows as OrderRow[];
}

// Récupérer une commande spécifique
export async function findBy({ id, buyerId }: { id: number; buyerId: number }): Promise<OrderRow[]> {
  const [rows] = await pool.query(
    `SELECT * FROM orders WHERE id = ? AND buyer_id = ?`,
    [id, buyerId]
  );
  return rows as OrderRow[];
}

// Récupérer les produits d'une commande
export async function findOrderProducts({ orderId, buyerId }: { orderId: number; buyerId: number }): Promise<OrderProduct[]> {
  const [rows] = await pool.query(
    `
    SELECT 
      op.product_id AS id,
      p.name,
      op.unit_price,
      op.quantity AS qty
    FROM order_products op
    INNER JOIN orders o ON o.id = op.order_id
    INNER JOIN products p ON p.id = op.product_id
    WHERE op.order_id = ? AND o.buyer_id = ?
    `,
    [orderId, buyerId]
  );
  return rows as OrderProduct[];
}

// Mettre à jour le statut d'une commande
export async function update({ status, id, buyerId }: OrderUpdate): Promise<{ affectedRows: number }> {
  if (!status) throw new Error("Le statut est requis pour la mise à jour");

  const [result]: any = await pool.query(
    `UPDATE orders SET status = ? WHERE id = ? AND buyer_id = ?`,
    [status, id, buyerId]
  );

  return { affectedRows: result.affectedRows };
}
