import pool from "../config/database";

// --- Typage ---
export interface ProductInput {
  id?: number; // nécessaire pour update/delete
  sellerId: number;
  name?: string;
  price?: number;
  description?: string;
  categoryId?: number;
  imageUrl?: string;
  stock?: number;
}

export interface ProductRow {
  id: number;
  name: string;
  price: number;
  description: string;
  category_id: number;
  image_url?: string;
  stock: number;
  seller_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface ProductResult {
  affectedRows: number;
  insertId?: number;
}

// --- CREATE ---
export async function create(product: ProductInput): Promise<ProductResult> {
  const [result]: any = await pool.query(
    `INSERT INTO products 
      (name, price, description, category_id, image_url, stock, seller_id)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [product.name, product.price, product.description, product.categoryId, product.imageUrl, product.stock, product.sellerId]
  );
  return { affectedRows: result.affectedRows, insertId: result.insertId };
}

// --- FIND BY SELLER ---
export async function findBySellerId(sellerId: number): Promise<ProductRow[]> {
  const [rows]: any = await pool.query(`SELECT * FROM products WHERE seller_id = ?`, [sellerId]);
  return rows;
}

// --- UPDATE ---
export async function update(product: ProductInput): Promise<ProductResult> {
  if (!product.id) throw new Error("L'id du produit est requis pour la mise à jour");

  // Préparer les champs à mettre à jour
  const fields: string[] = [];
  const values: (string | number)[] = [];

  if (product.name !== undefined) { fields.push("name = ?"); values.push(product.name); }
  if (product.price !== undefined) { fields.push("price = ?"); values.push(product.price); }
  if (product.description !== undefined) { fields.push("description = ?"); values.push(product.description); }
  if (product.categoryId !== undefined) { fields.push("category_id = ?"); values.push(product.categoryId); }
  if (product.imageUrl !== undefined) { fields.push("image_url = ?"); values.push(product.imageUrl); }
  if (product.stock !== undefined) { fields.push("stock = ?"); values.push(product.stock); }

  if (fields.length === 0) throw new Error("Aucun champ à mettre à jour");

  values.push(product.id, product.sellerId);

  const query = `UPDATE products SET ${fields.join(", ")} WHERE id = ? AND seller_id = ?`;
  const [result]: any = await pool.query(query, values);

  return { affectedRows: result.affectedRows };
}

// --- DELETE ---
export async function remove(product: { id: number; sellerId: number }): Promise<ProductResult> {
  const [result]: any = await pool.query(
    `DELETE FROM products WHERE id = ? AND seller_id = ?`,
    [product.id, product.sellerId]
  );
  return { affectedRows: result.affectedRows };
}
