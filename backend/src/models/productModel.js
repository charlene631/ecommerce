import pool from "../config/database.js";

export async function create({
    name,
    price,
    description,
    categoryId,
    imageUrl,
    stock,
    sellerId,
}) {
    const [result] = await pool.query(
        `
        INSERT INTO
            products (
                name,
                price,
                description,
                category_id,
                image_url,
                stock,
                seller_id
            )
        VALUES
            (?, ?, ?, ?, ?, ?, ?)
            `,
        [name, price, description, categoryId, imageUrl, stock, sellerId]
    );
    const { affectedRows, insertId } = result;
    return { affectedRows, insertId };
}

export async function findBySellerId(sellerId) {
    const [rows] = await pool.query(
        `SELECT * FROM products WHERE seller_id=?`,
        [sellerId]
    );
    return rows;
}

export async function update({
    name,
    price,
    description,
    categoryId,
    imageUrl,
    stock,
    id,
    sellerId,
}) {
    const setClause = [
        name !== undefined ? "name=?" : null,
        price !== undefined ? "price=?" : null,
        description !== undefined ? "description=?" : null,
        categoryId !== undefined ? "category_id=?" : null,
        imageUrl !== undefined ? "image_url=?" : null,
        stock !== undefined ? "stock=?" : null,
    ]
        .filter(Boolean)
        .join(", ");

    const query = `
        UPDATE products
        SET ${setClause}
        WHERE id=? AND seller_id=?
        `;
    const values = [
        name,
        price,
        description,
        categoryId,
        imageUrl,
        stock,
    ].filter((v) => v !== undefined);
    values.push(id, sellerId);

    const [result] = await pool.query(query, values);
    return { affectedRows: result.affectedRows };
}

export async function remove({ id, sellerId }) {
    const [result] = await pool.query(
        `
        DELETE
        FROM products
        WHERE id=? AND seller_id=?
        `,
        [id, sellerId]
    );
    return { affectedRows: result.affectedRows };
}
