import bcrypt from "bcryptjs";

export async function encryptPassword(password: string) {
  return bcrypt.hashSync(password, 10);
}

export async function decryptPassword(plainPassword: string, hashedPassword: string) {
  return bcrypt.compare(plainPassword, hashedPassword);
}
