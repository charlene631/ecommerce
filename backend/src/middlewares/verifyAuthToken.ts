import { Request, Response, NextFunction } from 'express';
import env from '../config/env.js'
import jwt, { JwtPayload }from "jsonwebtoken";

//  Typage du payload du token
interface JwtUser {
    email: string;
}

// Extension de l'interface Request pour inclure le champ user
interface AuthRequest extends Request {
    user?: JwtUser;
}

const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeaders = req.headers.authorization;

        if (!authHeaders) {
            return res.status(401).json({ error: "Token absent." });
        }

        if (!authHeaders.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Format du token invalide." });
        }

        const token = authHeaders.split(" ")[1];
        req.user = jwt.verify(token, env.JWT_SECRET) as JwtUser;
        next();
    } catch (error: any) {
        console.error(error);
        res.status(403).json({ error: `Token invalide ou expiré` });
    }
};

export default auth;
