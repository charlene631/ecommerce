import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { Express } from "express";
import env from '../config/env';


// Helmet : sécurité HTTP
export function useHelmet(app: Express): void {
  app.use(helmet());
}

// CORS : autorise seulement certains domaines
export function useCORS(app: Express): void {
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    })
  );
}

// Rate Limit : limite les requêtes pour éviter les attaques
export function useRateLimit(app: Express): void {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // max 100 requêtes par IP
    message: "Trop de requêtes, réessayez plus tard.",
    standardHeaders: true, // Retourne les headers RateLimit standard
    legacyHeaders: false, // Désactive les headers obsolètes
  });
  app.use(limiter);
}
