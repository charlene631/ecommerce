import { Request, Response, NextFunction } from "express";

const isSeller = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;

        if (!user) {
            return res
                .status(401)
                .json({ error: `Utilisateur non authentifié.` });
        }
        if (user.role !== "seller") {
            return res
                .status(403)
                .json({ error: `Accès réservé aux vendeurs.` });
        }
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Le serveur a retourné une erreur.` });
    }
};

export default isSeller;
