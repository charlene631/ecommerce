const isSeller = async (req, res, next) => {
    try {
        const { role } = req.user;

        if (role !== "seller")
            return res
                .status(403)
                .json({ error: `Accès réservé aux vendeurs.` });
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json(`Le serveur a retourné une erreur.`);
    }
};

export default isSeller;
