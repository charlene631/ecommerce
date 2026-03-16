import { Request, Response, NextFunction } from "express";
import { Cart } from "../types/cart";

export function initCart(req: Request, res: Response, next: NextFunction) {
  const cartCookie = req.cookies.cart;
  let cart: Cart;

  try {
    cart = cartCookie ? (JSON.parse(cartCookie) as Cart) : { products: [], total: 0 };
  } catch (error: any) {
    console.error("Erreur parsing cookie cart:", error.message);
    cart = { products: [], total: 0 };
    res.cookie("cart", JSON.stringify(cart), { httpOnly: true });
  }

  req.cart = cart;
  next();
}
