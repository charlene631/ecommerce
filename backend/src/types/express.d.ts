import type { AuthTokenPayload } from "./user";
import type { Cart } from "./cart";

declare module "express-serve-static-core" {
  interface Request {
    user?: AuthTokenPayload;
    cart?: Cart;
  }
}
export {};