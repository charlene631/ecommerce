SELECT
    op.product_id,
    op.unit_price,
    op.quantity
FROM
    order_products op
    INNER JOIN orders o ON o.id = op.order_id
WHERE
    op.order_id = ?
    AND o.buyer_id = ?