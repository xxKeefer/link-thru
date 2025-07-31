import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import shortenRouter from "./api/shorten";
import redirectRouter from "./api/redirect";
import authRouter, { authMiddleware } from "./api/auth";
import { db } from "./db";
import { env } from "../env";

dotenv.config({ path: "../.env" });

async function main() {
  const app = express();

  app.use(
    cors({
      origin: "http://127.0.0.1:5173", // or use "*" to allow all in dev
      credentials: true, // only needed if you're using cookies/auth headers
    })
  );

  app.use(express.json());
  app.use("/auth", authRouter(db));
  app.use("/shorten", authMiddleware, shortenRouter(db));
  app.use("/r", redirectRouter(db));
  app.get("/ping", (req, res) => {
    return res.status(200).json({ success: "pong" });
  });

  app.listen(env.PORT, () => {
    console.log(`App listening on port ${env.PORT}`);
  });
}

main();
