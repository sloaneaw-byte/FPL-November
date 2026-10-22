// GET /api/league -> every team. Squads are only included once the game has started.
import { store, json, started, listEntries, KICKOFF } from "../lib/core.mjs";

export default async () => {
  const live = started();
  const entries = (await listEntries()).map(e => live
    ? { id: e.id, teamName: e.teamName, playerName: e.playerName, joinedAt: e.joinedAt, picks: e.picks, captain: e.captain }
    : { id: e.id, teamName: e.teamName, playerName: e.playerName, joinedAt: e.joinedAt });
  const scores = (await store().get("scores", { type: "json" }))?.pts || {};
  return json({ started: live, kickoff: new Date(KICKOFF).toISOString(), entries, scores });
};

export const config = { path: "/api/league" };
