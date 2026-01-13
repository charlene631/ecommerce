import { Request, Response, NextFunction } from 'express';

interface Cart {
    products: Array<{ id: number; quantity: number }>;
    total: number;
}

interface CartRequest extends Request {
    cart?: Cart;
}

export function initCart(req: CartRequest, res: Response, next: NextFunction) {
    const cartCookie = req.cookies.cart;
    let cart: Cart;

        try {
            cart = cartCookie ? (JSON.parse(cartCookie) as Cart) : { products: [], total: 0 };
        } catch (error: any) { // gestion des erreurs de parsing
            console.error("Erreur de parsing du cookie cart:", error.message);
            cart = { products: [], total: 0 }; // création panier vide pour éviter de planter le serveur
            res.cookie('cart', JSON.stringify(cart), { httpOnly: true });
            req.cart = cart;
        }
    next();
}
