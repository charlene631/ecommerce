import Joi from "joi";

// Schémas de validation
export const createProductSchema = Joi.object({
    name: Joi.string().max(250).required(),
    price: Joi.number().positive().required(),
    description: Joi.string().required(),
    categoryId: Joi.number().integer().required(),
    imageUrl: Joi.string().max(255).optional(),
    stock: Joi.number().integer().positive().required(),
});

export const updateProductSchema = Joi.object({
    name: Joi.string().max(250).optional(),
    price: Joi.number().positive().optional(),
    description: Joi.string().optional(),
    categoryId: Joi.number().integer().optional(),
    imageUrl: Joi.string().max(255).optional(),
    stock: Joi.number().integer().positive().optional(),
})
    .min(1)
    .message("Au moins un champs doit être fourni pour la mise à jour.");

export const validate = (schema) => (req, res, next) => {
    // On combine body + file (si présent)
    const data = {
        ...req.body,
        ...(req.file?.path ? { imageUrl: req.file.path } : {}), // valeur fiable venant du serveur (empeche la saisie directe dans le body)
    };
    console.log(data);

    // On teste
    const { error, value } = schema.validate(data, {
        abortEarly: false, // affiche toutes les erreurs
        allowUnknown: false, // refuse les champs supplémentaires
    });

    if (error)
        return res.status(400).json({
            errors: error.details.map((d) => d.message),
        });

    // On remet les valeurs nettoyées dans req.body
    console.log("Données valides :", value);
    req.body = value;

    next();
};
