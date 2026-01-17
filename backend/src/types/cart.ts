// src/types/cart.ts

export interface CartItem {
  id: number;
  name: string;
  unit_price: number;
  qty: number;
}

export interface Cart {
  products: CartItem[];
  total: number;
}

export interface CartRequest extends Request {
  cart?: Cart;
}