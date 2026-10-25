// GET /api/league -> every team. Squads are only included once the game has started,
// or at any time for the organiser (header x-admin-password).
import { store, json, started, listEntries, isAdmin, KICKOFF } from "../lib/core.mjs";

export default async (req) => {
  const live = started();
  const showSquads = live || (await isAdmin(req));
  const entries = (await listEntries()).map(e => showSquads
    ? { id: e.id, teamName: e.teamName, playerName: e.playerName, joinedAt: e.joinedAt, picks: e.picks, captain: e.captain }
    : { id: e.id, teamName: e.teamName, playerName: e.playerName, joinedAt: e.joinedAt });
  const scores = (await store().get("scores", { type: "json" }))?.pts || {};
  return json({ started: live, kickoff: new Date(KICKOFF).toISOString(), entries, scores });
};

export const config = { path: "/api/league" };
