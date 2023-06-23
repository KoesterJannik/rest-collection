import express from "express";
import cors from "cors";
declare global {
  namespace Express {
    interface Request {
      user: {
        email: string;
        id: string;
      };
    }
  }
}
import authRouter from "./resources/auth/auth.router";
import userRouter from "./resources/users/users.router";

const app = express();

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

const API_PREFIX = "/api/v1";

app.use(`${API_PREFIX}/auth`, authRouter);
app.use(`${API_PREFIX}/users`, userRouter);
export default app;
