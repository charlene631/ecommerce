// backend/src/types/order.ts

export interface OrderProduct {
  id: number;          // correspond à product_id
  name: string;
  unit_price: number;
  qty: number;
}

export interface OrderInput {
  products: OrderProduct[];
  buyerId: number;
}

export interface OrderUpdate {
  status?: string;
  id: number;
  buyerId: number;
}

export interface OrderRow {
  id: number;
  status: string;
  created_at: Date;
  updated_at: Date;
  products?: OrderProduct[];
}
