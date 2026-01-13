import pool from "../config/database.js";

export async function create({ products, buyerId }) {
    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();

        // Créer la commande
        const [result] = await conn.query(
            `
            INSERT INTO
                orders (
                    buyer_id
                )
            VALUES
                (?)
                `,
            [buyerId]
        );
        const orderId = result.insertId;

        // Ajoute les articles
        await Promise.all(
            products.map((product) => {
                conn.query(
                    `
                    INSERT INTO
                        order_products (
                            product_id, unit_price, quantity, order_id
                        )
                    VALUES (?, ?, ?, ?)
                    `,
                    [product.id, product.unit_price, product.qty, orderId]
                );
            })
        );

        await conn.commit();
        return { orderId, buyerId, products };
    } catch (error) {
        // Annule si problème
        console.error(
            "Erreur lors de la création de commande :",
            error.message
        );
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
}

export async function findByBuyerId(buyerId) {
    const [rows] = await pool.query(
        `
        SELECT
            id, status, created_at, updated_at
        FROM
            orders
        WHERE
            buyer_id = ?
        `,
        [buyerId]
    );
    return rows;
}

export async function findBy({ id, buyerId }) {
    const [rows] = await pool.query(
        `
        SELECT
            *
        FROM
            orders
        WHERE
            id = ?
            AND buyer_id = ?
        `,
        [id, buyerId]
    );
    return rows;
}

export async function findOrderProducts({ orderId, buyerId }) {
    const [rows] = await pool.query(
        `
        SELECT
            op.product_id,
            p.name,
            op.unit_price,
            op.quantity
        FROM
            order_products op
            INNER JOIN orders o ON o.id = op.order_id
            INNER JOIN products p ON p.id = op.product_id
        WHERE
            op.order_id = ?
            AND o.buyer_id = ?
        `,
        [orderId, buyerId]
    );
    return rows;
}

export async function update({ status, id, buyerId }) {
    const setClause = [status !== undefined ? "status=?" : null]
        .filter(Boolean)
        .join(", ");

    const query = `
        UPDATE orders
        SET ${setClause}
        WHERE id=? AND buyer_id=?
        `;
    const values = [status].filter((v) => v !== undefined);
    values.push(id, buyerId);

    const [result] = await pool.query(query, values);
    return { affectedRows: result.affectedRows };
}
