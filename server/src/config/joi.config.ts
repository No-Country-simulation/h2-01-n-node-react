import * as Joi from 'joi';

export const configSchema = Joi.object({
  NODE_ENV: Joi.string().valid('dev', 'prod').optional(),
  PORT: Joi.number().integer().optional().default(3000),
  API_HEADER_FIELD_NAME: Joi.string().optional(),
  API_KEY: Joi.string().optional(),
  API_BASE_URL: Joi.string().optional(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRY: Joi.string().required(),
  COOKIE_TTL: Joi.number().integer().optional().default(3600000),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_DB: Joi.string().required(),
  POSTGRES_PORT: Joi.number().integer().required(),
  DB_HOST: Joi.string().required(),
  CLOUDINARY_NAME: Joi.string().optional(),
  CLOUDINARY_API_KEY: Joi.string().optional(),
  CLOUDINARY_API_API: Joi.string().optional(),
});
