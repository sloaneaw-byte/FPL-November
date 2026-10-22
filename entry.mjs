// GET  /api/entry  (header x-entry-token)  -> your own entry, including your squad
// POST /api/entry  {token?, teamName, playerName, picks, captain} -> create or update your entry
import { store, json, started, validateEntry, idFromToken, newToken } from "../lib/core.mjs";

export default async (req) => {
  const s = store();

  if (req.method === "GET") {
    const token = req.headers.get("x-entry-token");
    if (!token) return json({ error: "No edit token." }, 400);
    const entry = await s.get("entries/" + (await idFromToken(token)), { type: "json" });
    if (!entry) return json({ error: "We couldn't find a team for that edit link." }, 404);
    return json({ entry });
  }

  if (req.method !== "POST") return json({ error: "Method not allowed." }, 405);
  if (started()) return json({ error: "Entries closed on 1 November." }, 403);

  let body;
  try { body = await req.json(); } catch { return json({ error: "Invalid request." }, 400); }
  const { error, value } = validateEntry(body);
  if (error) return json({ error }, 400);

  let token = body.token ? String(body.token) : null;
  let existing = null;
  if (token) {
    existing = await s.get("entries/" + (await idFromToken(token)), { type: "json" });
    if (!existing) return json({ error: "That edit link isn't valid any more. Ask the organiser for help." }, 403);
  } else {
    token = newToken();
  }

  const id = await idFromToken(token);
  const now = new Date().toISOString();
  const entry = { id, ...value, joinedAt: existing?.joinedAt || now, updatedAt: now };
  await s.setJSON("entries/" + id, entry);
  return json({ token, entry });
};

export const config = { path: "/api/entry" };
