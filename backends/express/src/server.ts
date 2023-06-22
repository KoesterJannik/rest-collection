import express from "express";
import cors from "cors";
import authRouter from "./resources/auth/auth.router";

const app = express();

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

const API_PREFIX = "/api/v1";

app.use(`${API_PREFIX}/auth`, authRouter);

export default app;
