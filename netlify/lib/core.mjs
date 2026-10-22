import { getStore } from "@netlify/blobs";
import { PLAYERS } from "./players.mjs";

// The game starts at midnight UK time on 1 November 2026 (GMT, so UTC).
// Set a KICKOFF environment variable (e.g. 2026-10-31T11:00:00Z) to move it.
export const KICKOFF = Date.parse(process.env.KICKOFF || "2026-11-01T00:00:00Z");
export const started = () => Date.now() >= KICKOFF;

export const FORMATION = ["GK","DEF","DEF","DEF","DEF","MID","MID","MID","MID","ATT","ATT"];
const byKey = new Map(PLAYERS.map(p => [p[0] + "|" + p[1], p]));
export const isPlayer = k => byKey.has(k);

export const store = () => getStore({ name: "movember-league", consistency: "strong" });

export const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

export async function sha256(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}

// An entry's id is derived from its secret edit token, so the token itself is never stored.
export const idFromToken = async token => (await sha256("entry:" + token)).slice(0, 24);
export const newToken = () => [...crypto.getRandomValues(new Uint8Array(20))].map(b => b.toString(16).padStart(2, "0")).join("");

export async function isAdmin(req) {
  const pw = process.env.ADMIN_PASSWORD;
  const given = req.headers.get("x-admin-password") || "";
  if (!pw || !given) return false;
  return (await sha256(pw)) === (await sha256(given));
}

const clean = s => String(s ?? "").replace(/\s+/g, " ").trim().slice(0, 40);

export function validateEntry(body) {
  const teamName = clean(body?.teamName);
  const playerName = clean(body?.playerName);
  const picks = Array.isArray(body?.picks) ? body.picks.map(String) : [];
  const captain = String(body?.captain ?? "");
  if (!teamName) return { error: "Team name is required." };
  if (!playerName) return { error: "Your name is required." };
  if (picks.length !== 11) return { error: "Pick all 11 players." };
  for (let i = 0; i < 11; i++) {
    const p = byKey.get(picks[i]);
    if (!p) return { error: "One of your players isn't in the player list." };
    if (p[2] !== FORMATION[i]) return { error: `${p[0]} can't play ${FORMATION[i]}.` };
  }
  if (new Set(picks).size !== 11) return { error: "You've picked the same player twice." };
  if (new Set(picks.map(k => byKey.get(k)[1])).size !== 11) return { error: "Only one player per club." };
  if (!picks.includes(captain)) return { error: "Choose a captain from your eleven." };
  return { value: { teamName, playerName, picks, captain } };
}

export async function listEntries() {
  const s = store();
  const { blobs } = await s.list({ prefix: "entries/" });
  const all = await Promise.all(blobs.map(b => s.get(b.key, { type: "json" })));
  return all.filter(Boolean);
}
