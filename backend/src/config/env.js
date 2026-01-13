import "dotenv/config";
import { cleanEnv, host, port, str, url } from "envalid";

const env = cleanEnv(process.env, {
    // Serveur
    PROTOCOL: str({
        choices: ["http", "https"],
        devDefault: "http",
        default: "https",
    }),
    HOST: host({ devDefault: "localhost" }),
    PORT: port({ devDefault: 3000 }),

    // Front-end
    FRONTEND_URL: url({ devDefault: "http://localhost:3000" }),

    // Cors
    CORS_ORIGIN: url({ devDefault: "http://localhost:3000" }),

    // Base de données
    DB_URI: url(),

    // JWT
    JWT_SECRET: str({ devDefault: "MonSuperSecretDeLaMortQuiTue" }),
    JWT_EMAIL_VERIFICATION_EXPIRES_IN: str({ default: "1h" }),
    JWT_ACCESS_EXPIRES_IN: str({ devDefault: "24h" }),

    // Nodemailer
    //EMAIL_SERVICE: str(),
    //EMAIL_USER: str(),
    //EMAIL_PASS: str(),
    //EMAIL_FROM: str({ devDefault: "Mon application <noreply@nodomain.com>" }),

    // Stripe
    STRIPE_SECRET_KEY: str(),
    STRIPE_WEBHOOK_SECRET: str(),
});

export default env;
