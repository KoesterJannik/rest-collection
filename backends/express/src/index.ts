import { config } from "dotenv";
config();
import express from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());