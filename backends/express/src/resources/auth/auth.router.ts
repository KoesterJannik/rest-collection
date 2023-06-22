import express, { Response } from "express";
import { LoginUserSchema, RegisterUserSchema } from "./schemas/AuthSchemas";
import { prisma } from "../../db";
import {
  generateAccessToken,
  hashPassword,
  verifyPassword,
} from "../../utils/auth";
import { z } from "zod";
import { tryCatchZodErrorWrapper } from "../helper";

const authRouter = express.Router();

authRouter.post("/login", async (req, res) => {
  return tryCatchZodErrorWrapper(req, res, async () => {
    const data = await LoginUserSchema.parseAsync(req.body);
    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (!user)
      return res
        .status(400)
        .json({ message: "Email or password is incorrect" });

    const doPwMatch = await verifyPassword(data.password, user.password);
    if (!doPwMatch)
      return res
        .status(400)
        .json({ message: "Email or password is incorrect" });

    const jwt = generateAccessToken({
      email: user.email,
      id: user.id,
    });

    return res.json({ jwt });
  });
});

authRouter.post("/register", async (req, res) => {
  return tryCatchZodErrorWrapper(req, res, async () => {
    const data = await RegisterUserSchema.parseAsync(req.body);

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create the new user
    const newUser = await prisma.user.create({
      data: {
        email: data.email,
        password: await hashPassword(data.password),
      },
    });
    const jwt = generateAccessToken({
      email: newUser.email,
      id: newUser.id,
    });

    let userWithoutPassword = {
      ...newUser,
      password: undefined,
    };

    return res.status(201).json({ jwt, userWithoutPassword });
  });
});

export default authRouter;
