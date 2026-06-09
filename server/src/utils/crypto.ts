import crypto from "crypto";

export function generateResetPasswordToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function hashResetPasswordToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}