import env from "./config/env";
import express, { Express, Request, Response } from "express";
import cookieParser from "cookie-parser";
import {
    useHelmet,
    useCORS,
    useRateLimit,
} from "./middlewares/security";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import { initCart } from "./middlewares/initCart";
import cartRoutes from "./routes/cartRoutes";
import verifyAuthToken from "./middlewares/verifyAuthToken";
import isSeller from "./middlewares/verifyRole";
import orderRoutes from "./routes/orderRoutes";
import stripeWebhook from "./routes/stripeWebhook";

const app: Express = express();

// Sécurité
useHelmet(app);
useCORS(app);
useRateLimit(app);

// Middlewares
app.use(cookieParser());
app.use(initCart);

// Routes
app.get("/", (req: Request, res: Response) => {
    res.send("Bienvenue !");
});

// Webhook Stripe : corps brut pour la signature
app.use(
    "/webhook/stripe",
    express.raw({ type: "application/json" }),
    stripeWebhook
);

// JSON classique pour toutes les autres routes
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/product", verifyAuthToken, isSeller, productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", verifyAuthToken, orderRoutes);

// Lancement du serveur
app.listen(env.PORT, () => {
    console.log(`Serveur lancé sur ${env.PROTOCOL}://${env.HOST}:${env.PORT}`);
});


export default app;
