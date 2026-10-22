// GET    /api/admin          -> checks the organiser password
// DELETE /api/admin?id=...   -> removes an entry
import { store, json, isAdmin } from "../lib/core.mjs";

export default async (req) => {
  if (!process.env.ADMIN_PASSWORD) return json({ error: "Set an ADMIN_PASSWORD environment variable in Netlify first." }, 500);
  if (!(await isAdmin(req))) return json({ error: "Wrong organiser password." }, 401);
  if (req.method === "GET") return json({ ok: true });
  if (req.method === "DELETE") {
    const id = new URL(req.url).searchParams.get("id");
    if (!id || !/^[a-f0-9]{24}$/.test(id)) return json({ error: "Missing entry id." }, 400);
    await store().delete("entries/" + id);
    return json({ ok: true });
  }
  return json({ error: "Method not allowed." }, 405);
};

export const config = { path: "/api/admin" };
