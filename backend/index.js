import env from "./src/config/env.js";
import express from "express";
import cookieParser from "cookie-parser";
import {
    useHelmet,
    useCORS,
    useRateLimit,
} from "./src/middlewares/security.js";
import authRoutes from "./src/routes/authRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import { initCart } from "./src/middlewares/initCart.js";
import cartRoutes from "./src/routes/cartRoutes.js";
import verifyAuthToken from "./src/middlewares/verifyAuthToken.js";
import isSeller from "./src/middlewares/verifyRole.js";
import orderRoutes from "./src/routes/orderRoutes.js";
import stripeWebhook from "./src/routes/stripeWebhook.js";

const app = express();

// Sécurité
useHelmet(app);
useCORS(app);
useRateLimit(app);

// Middlewares
app.use(cookieParser());
app.use(initCart);

// Routes
app.get("/", (req, res) => {
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
