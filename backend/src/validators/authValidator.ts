import Joi, { Schema } from "joi";
import { Request, Response, NextFunction } from "express";

// Middleware de validation typé
export const validate = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        success: false,
        error: "Validation échouée.",
        details: error.details.map((err) => err.message),
      });
    }
    next();
  };
};

// Schéma d'inscription
export const registerSchema = Joi.object({
  firstname: Joi.string().trim().min(2).max(50).required().messages({
    "string.empty": "Le prénom est requis.",
    "string.min": "Le prénom doit contenir au moins 2 caractères.",
    "any.required": "Le prénom est requis.",
  }),

  lastname: Joi.string().trim().min(2).max(50).required().messages({
    "string.empty": "Le nom est requis.",
    "string.min": "Le nom doit contenir au moins 2 caractères.",
    "any.required": "Le nom est requis.",
  }),

  email: Joi.string().email().trim().required().messages({
    "string.empty": "L'email est requis.",
    "string.email": "L'email doit être valide.",
    "any.required": "L'email est requis.",
  }),

  password: Joi.string()
    .min(8)
    .max(64)
    .pattern(new RegExp("^(?=.*[A-Z])(?=.*[0-9]).+$"))
    .required()
    .messages({
      "string.empty": "Le mot de passe est requis.",
      "string.min": "Le mot de passe doit contenir au moins 8 caractères.",
      "string.pattern.base": "Le mot de passe doit contenir au moins une majuscule et un chiffre.",
      "any.required": "Le mot de passe est requis.",
    }),

  passwordConfirm: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "any.only": "Les mots de passe ne correspondent pas.",
      "any.required": "La confirmation du mot de passe est requise.",
    }),
});

// Schéma de connexion
export const loginSchema = Joi.object({
  email: Joi.string().email().trim().required().messages({
    "string.empty": "L'email est requis.",
    "string.email": "L'email doit être valide.",
    "any.required": "L'email est requis.",
  }),

  password: Joi.string().required().messages({
    "string.empty": "Le mot de passe est requis.",
    "any.required": "Le mot de passe est requis.",
  }),
});
