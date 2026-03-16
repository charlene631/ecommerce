import { Request, Response, NextFunction } from "express";
import env from "../config/env";
import jwt from "jsonwebtoken";
import { AuthTokenPayload } from "../types/user";

export async function verifyAuthToken(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) return res.status(401).json({ error: "Token absent." });
    if (!authHeader.startsWith("Bearer ")) return res.status(401).json({ error: "Format du token invalide." });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(
      token,
      env.JWT_SECRET
    ) as AuthTokenPayload;

    req.user = decoded;

    next();
  } catch (error) {
    console.error(error);
    res.status(403).json({ error: "Token invalide ou expiré" });
  }
}

export default verifyAuthToken;
