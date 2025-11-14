
import { Request, Response } from "express";
import { fetchUserData } from "../services/user.service";

export async function getUser(req: Request, res: Response) {
  const id = req.params.id;
  try {
    const user = await fetchUserData(id);
    return res.json(user);
  } catch (err: any) {
    console.error("getUser error:", err?.message || err);
    return res.status(502).json({ error: "failed_fetching_user", details: err?.message || String(err) });
  }
}
