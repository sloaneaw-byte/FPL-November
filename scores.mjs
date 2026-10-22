// POST /api/scores {pts: {"Player|Club": [gw9, gw10, gw11, gw12]}}  (header x-admin-password)
import { store, json, isAdmin, isPlayer } from "../lib/core.mjs";

export default async (req) => {
  if (req.method !== "POST") return json({ error: "Method not allowed." }, 405);
  if (!(await isAdmin(req))) return json({ error: "Wrong organiser password." }, 401);
  let body;
  try { body = await req.json(); } catch { return json({ error: "Invalid request." }, 400); }
  const pts = {};
  for (const [k, arr] of Object.entries(body?.pts || {})) {
    if (!isPlayer(k) || !Array.isArray(arr)) continue;
    pts[k] = [0, 1, 2, 3].map(i => (arr[i] === null || arr[i] === "" || arr[i] === undefined || isNaN(+arr[i])) ? null : Math.round(+arr[i]));
  }
  await store().setJSON("scores", { pts, updatedAt: new Date().toISOString() });
  return json({ ok: true });
};

export const config = { path: "/api/scores" };
