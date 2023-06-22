import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const hashPassword = async (password: string) => {
  const SALT = process.env.BCRYPT_SALT_ROUNDS;
  if (!SALT) throw new Error("SALT is not defined");
  return await bcrypt.hash(password, parseInt(SALT));
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string
) => {
  return await bcrypt.compare(password, hashedPassword);
};

type AccessTokenPayload = {
  email: string;
  id: string;
};

export const generateAccessToken = (payload: AccessTokenPayload) => {
  const SECRET = process.env.JWT_SECRET;
  const EXPIRES_IN = process.env.JWT_EXPIRES_IN;
  if (!SECRET) throw new Error("SECRET is not defined");
  if (!EXPIRES_IN) throw new Error("EXPIRES_IN is not defined");
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
};

export const verifyAccessToken = (token: string) => {
  const SECRET = process.env.JWT_SECRET;
  if (!SECRET) throw new Error("SECRET is not defined");
  return jwt.verify(token, SECRET) as AccessTokenPayload;
};
