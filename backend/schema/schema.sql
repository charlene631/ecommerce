CREATE TABLE
    users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(250) NOT NULL UNIQUE,
        firstname VARCHAR(250) NOT NULL,
        lastname VARCHAR(250) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        hashed_password VARCHAR(250) NOT NULL,
        role ENUM ("admin", "buyer", "seller") NOT NULL DEFAULT "buyer",
        email_token_expires_at TIMESTAMP DEFAULT NULL,
        is_verified BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        last_login_at TIMESTAMP DEFAULT NULL
    );

CREATE TABLE
    categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(250) NOT NULL UNIQUE
    );

CREATE TABLE
    products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(250) NOT NULL,
        price DECIMAL(8, 2) NOT NULL,
        description TEXT NOT NULL,
        category_id INT NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        seller_id INT NOT NULL,
        stock INT NOT NULL,
        FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE RESTRICT ON UPDATE RESTRICT,
        FOREIGN KEY (seller_id) REFERENCES users (id) ON DELETE RESTRICT ON UPDATE RESTRICT
    );

CREATE TABLE
    orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        status ENUM (
            "pending", -- la commande est créé
            "payment_in_progress" -- le paiement est en cours
            "paid", -- la paiement a réussi
            "failed", -- le paiement a échoué
            "canceled", -- commande annulée par le vendeur ou l'admin
            "processing", -- commande en cours de traitement
            "shipped", -- commande expédiée
            "delivered", -- commande livrée
            "returned" -- commande retournée
            "refunded" -- commande remboursée (partiellement ou en totalité)
            "disputed" -- commande en litige
        ) NOT NULL DEFAULT "pending",
        buyer_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (buyer_id) REFERENCES users (id) ON DELETE RESTRICT ON UPDATE RESTRICT
    );

CREATE TABLE
    order_products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        unit_price DECIMAL(8, 2) NOT NULL,
        quantity INT NOT NULL,
        order_id INT NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE RESTRICT ON UPDATE RESTRICT,
        FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE RESTRICT ON UPDATE RESTRICT
    );

-- Création des categories
INSERT INTO
    `categories` (`name`)
VALUES
    ('Friandises'),
    ('Hygiène'),
    ('High-tech'),
    ('Automobile'),
    ('Alimentation'),
    ('Textile');