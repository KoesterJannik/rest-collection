import express from "express";

const authRouter = express.Router();

authRouter.get("/login", (req, res) => {
  return res.json({ message: "Login" });
});

export default authRouter;
