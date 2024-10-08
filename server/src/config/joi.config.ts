import * as Joi from 'joi';

export const configSchema = Joi.object({
  environment: Joi.string().valid('dev', 'prod').optional(),
  port: Joi.number().integer().optional().default(3000),
  // jwtSecret: Joi.string().required(),
  // jwtExpiry: Joi.string().required(),
  // postgresUser: Joi.string().required(),
  // postgresPassword: Joi.string().required(),
  // postgresDb: Joi.string().required(),
  // postgresPort: Joi.number().integer().required(),
  // postgresHost: Joi.string().required(),
});
