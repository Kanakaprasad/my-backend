
import express from "express";
import userRoutes from "./routes/user.routes";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// health
app.get("/", (_req, res) => res.json({ ok: true, env: process.env.NODE_ENV || "development" }));

// routes
app.use("/api/users", userRoutes);

// generic error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err);
  res.status(500).json({ error: "internal_server_error" });
});

export default app;
