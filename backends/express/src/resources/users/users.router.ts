import { Router } from "express";
import { prisma } from "../../db";
import { attachUserToRequestOrThrowError } from "../../middleware/auth";
import { tryCatchZodErrorWrapper } from "../helper";
import { hashPassword, verifyPassword } from "../../utils/auth";
import { ChangePasswordSchema } from "./schemas/UsersSchema";

const userRouter = Router();
userRouter.use(attachUserToRequestOrThrowError);

userRouter.get("/me", async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
  });
  return res.json(user);
});

userRouter.put("/change-password", async (req, res) => {
  return tryCatchZodErrorWrapper(req, res, async () => {
    const data = await ChangePasswordSchema.parseAsync(req.body);
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    const doPwMatch = await verifyPassword(data.oldPassword, user.password);
    if (!doPwMatch)
      return res.status(400).json({ message: "Old password is incorrect" });
    await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        password: await hashPassword(data.newPassword),
      },
    });
    return res.json({ message: "Password changed successfully" });
  });
});

export default userRouter;
