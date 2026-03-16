import Joi, { Schema } from "joi";
import { Request, Response, NextFunction } from "express";

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

// Middleware de validation typé
export const validate = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // On combine body + file (si présent)
    const data = {
      ...req.body,
      ...(req.file?.path ? { imageUrl: req.file.path } : {}),
    };

    const { error, value } = schema.validate(data, {
      abortEarly: false, // affiche toutes les erreurs
      allowUnknown: false, // refuse les champs supplémentaires
    });

    if (error) {
      return res.status(400).json({
        errors: error.details.map((d) => d.message),
      });
    }

    // On remet les valeurs nettoyées dans req.body
    req.body = value;

    next();
  };
};
