import Joi from "joi";

export const addToCartSchema = Joi.object({
    id: Joi.number().integer().required(),
    qty: Joi.number().integer().min(1).required()
});
