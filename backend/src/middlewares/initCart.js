export function initCart(req, res, next) {
    if (!req.cookies.cart) { // vérifie si le cookie existe
        const emptyCart = { products: [], total: 0 }; // création panier vide 
        res.cookie('cart', JSON.stringify(emptyCart), { httpOnly: true }); //stockage dans cookie
        req.cart = emptyCart;
    } else {
        try {
            req.cart = JSON.parse(req.cookies.cart); // si oui, essaie de parser le JSON pour le mettre dans req.cart
        } catch (error) { // gestion des erreurs de parsing
            console.error("Erreur de parsing du cookie cart:", error.message);
            const emptyCart = { products: [], total: 0 }; // création panier vide pour éviter de planter le serveur
            res.cookie('cart', JSON.stringify(emptyCart), { httpOnly: true });
            req.cart = emptyCart;
        }
    }
    next();
}
