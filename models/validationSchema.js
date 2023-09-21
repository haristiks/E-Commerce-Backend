const Joi = require('joi');

const joiUserSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const joiProductSchema = Joi.object({
    title: Joi.string().required(),
    price: Joi.number().positive(),
    image: Joi.string(),
    description: Joi.string(),
    category: Joi.string()
});


module.exports={joiUserSchema ,joiProductSchema}