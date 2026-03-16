// backend/src/config/env.ts
import "dotenv/config";
import { cleanEnv, host, port, str, url } from "envalid";

// Définition des variables d'environnement
const env = cleanEnv(process.env, {
    // Configuration du serveur
    PROTOCOL: str({
        choices: ["http", "https"],
        devDefault: "http",
        default: "https",
    }),
    HOST: host({ devDefault: "localhost" }),
    PORT: port({ devDefault: 3000 }),

    // Front-end
    FRONTEND_URL: url({ devDefault: "http://localhost:3000" }),

    // CORS
    CORS_ORIGIN: url({ devDefault: "http://localhost:3000" }),

    // Base de données
    DB_HOST: host({ devDefault: "127.0.0.1" }),
    DB_USER: str(),
    DB_PASS: str(),
    DB_NAME: str({ devDefault: "app_db" }),

    // JWT
    JWT_SECRET: str(),
    JWT_EMAIL_VERIFICATION_EXPIRES_IN: str({ default: "1h" }),
    JWT_ACCESS_EXPIRES_IN: str({ devDefault: "24h" }),

    // Stripe
    STRIPE_SECRET_KEY: str(),
    STRIPE_WEBHOOK_SECRET: str(),

    // Nodemailer (décommenter et configurer si nécessaire)
    EMAIL_SERVICE: str({ devDefault: "" }),
    EMAIL_USER: str({ devDefault: "" }),
    EMAIL_PASS: str({ devDefault: "" }),
    EMAIL_FROM: str({ devDefault: "Mon application <noreply@nodomain.com>" }),
});

// Export des variables d'environnement
export default env;
