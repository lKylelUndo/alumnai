import dotenv from 'dotenv';
dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

// Fail-closed: a missing JWT_SECRET must never silently become a public constant.
const JWT_SECRET = (() => {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;
  if (isProduction) throw new Error("FATAL: JWT_SECRET is not set. Refusing to boot without it.");
  console.warn("WARNING: JWT_SECRET is not set — using an insecure dev-only secret.");
  return "dev-only-insecure-secret";
})();

// Separate refresh secret. Existing deployments: set this to a fresh random value;
// all refresh sessions re-login once, access tokens are unaffected.
const JWT_REFRESH_SECRET = (() => {
  if (process.env.JWT_REFRESH_SECRET) return process.env.JWT_REFRESH_SECRET;
  if (isProduction) throw new Error("FATAL: JWT_REFRESH_SECRET is not set. Generate one at https://jwtsecrets.com/ and set it.");
  console.warn("WARNING: JWT_REFRESH_SECRET is not set — falling back to JWT_SECRET (dev only).");
  return JWT_SECRET;
})();

export const ENV = {
  APP_NAME: process.env.APP_NAME || 'Alumnai API',
  PORT: parseInt(process.env.PORT || '8000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL,
  REDIS_URL: process.env.REDIS_URL || "",
  JWT_SECRET,
  JWT_REFRESH_SECRET,
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:8000',
  
  GITHUB_PAT: process.env.GITHUB_PAT || "",
  GEMINI_KEY: process.env.GEMINI_KEY || "",

  CLOUD_NAME: process.env.CLOUD_NAME || "",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
  CLOUDINARY_SECRET_KEY: process.env.CLOUDINARY_SECRET_KEY || "",

  ADMIN_REDIS_KEY: process.env.ADMIN_REDIS_KEY || "admin:",
  STUDENT_REDIS_KEY: process.env.STUDENT_REDIS_KEY || "student:",
  ALUMNI_REDIS_KEY: process.env.ALUMNI_REDIS_KEY || "alumni:",
  
  SMTP: { 
    HOST: process.env.SMTP_HOST,
    PORT: parseInt(process.env.SMTP_PORT || '587', 10),
    USER: process.env.SMTP_USER,
    PASS: process.env.SMTP_PASSWORD,
    FROM: process.env.SMTP_FROM,
  }
};