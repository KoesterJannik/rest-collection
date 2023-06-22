import { z } from "zod";

export const RegisterUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(32),
});

export const LoginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(32),
});
