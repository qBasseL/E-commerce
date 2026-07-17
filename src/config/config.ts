
export const NODE_ENV = process.env.NODE_ENV as string

export const PORT = parseInt(process.env.PORT as string);
export const DB_URI = process.env.DB_URI as string
export const SALT_ROUND = parseInt(process.env.SALT_ROUND as string);
export const IV_LENGTH = parseInt(process.env.IV_LENGTH as string)
export const ENC_SECRET_KEY = Buffer.from(process.env.ENC_SECRET_KEY as string, 'hex')
export const TOKEN_ACCESS_SECRET_KEY = process.env.TOKEN_ACCESS_SECRET_KEY as string
export const TOKEN_REFRESH_SECRET_KEY = process.env.TOKEN_REFRESH_SECRET_KEY as string
export const SYSTEM_TOKEN_ACCESS_SECRET_KEY = process.env.SYSTEM_TOKEN_ACCESS_SECRET_KEY as string
export const SYSTEM_TOKEN_REFRESH_SECRET_KEY = process.env.SYSTEM_TOKEN_REFRESH_SECRET_KEY as string
export const ACCESS_TOKEN_EXPIRES_IN = parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN as string);
export const REFRESH_TOKEN_EXPIRES_IN = parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN as string);
export const WEB_CLIENT_ID = process.env.WEB_CLIENT_ID as string
export const REDIS_URI = process.env.REDIS_URI as string
export const GOOGLE_APP_PASSWORD = process.env.GOOGLE_APP_PASSWORD as string
export const GOOGLE_APP_EMAIL = process.env.GOOGLE_APP_EMAIL as string
export const APP_NAME = process.env.APP_NAME as string

