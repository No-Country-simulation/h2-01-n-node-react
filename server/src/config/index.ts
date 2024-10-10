export const envConfig = () => ({
  environment: process.env.NODE_ENV || 'dev',
  port: +process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiry: process.env.JWT_EXPIRY,
  cookieTtl: process.env.COOKIE_TTL || 3600000,
  postgresUser: process.env.POSTGRES_USER,
  postgresPassword: process.env.POSTGRES_PASSWORD,
  postgresDb: process.env.POSTGRES_DB,
  postgresPort: +process.env.POSTGRES_PORT,
  postgresHost: process.env.DB_HOST,
});
