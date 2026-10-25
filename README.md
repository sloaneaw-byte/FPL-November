# Movember Fantasy Football 2026

A small website for the Movember FPL challenge. Players enter a team (team name, their name, a 4-4-2 eleven and a captain). Squads stay hidden on the server until the game locks at 11:30pm AEST on 31 October (1:30pm GMT). After that the league shows every squad, and the organiser enters scores.

## What's in this folder

```
public/index.html          The website itself
netlify/functions/         The server code (saves entries, serves the league)
netlify/lib/               Shared code and the player list
netlify.toml               Tells Netlify how to build the site
package.json               Lists the one library the server needs
```

## Setup (about 15 minutes, no coding)

### 1. Put the files on GitHub

1. Create a free account at github.com.
2. Click the **+** in the top right, then **New repository**. Name it, for example `movember-fantasy-football`. It can be private. Click **Create repository**.
3. On the next page, click **uploading an existing file**.
4. Unzip the download on your computer. Open the `movember-fantasy-football` folder and select **everything inside it**: `public`, `netlify`, `netlify.toml`, `package.json`, `README.md` and `.gitignore`. Drag it all onto the GitHub page.
   - `.gitignore` is hidden on most computers. Skipping it is fine.
   - Drag the contents, not the outer folder, so `netlify.toml` sits at the top level of the repository.
5. Click **Commit changes**.

### 2. Connect it to Netlify

1. Create a free account at netlify.com. Signing up with GitHub is easiest.
2. Click **Add new site**, then **Import an existing project**, then **GitHub**, and pick your repository.
3. Leave the build settings as they are. `netlify.toml` already fills them in. Click **Deploy**.

### 3. Set your organiser password

1. In your Netlify site, go to **Site configuration**, then **Environment variables**.
2. Add a variable named `ADMIN_PASSWORD` with a password only you know.
3. Go to **Deploys** and click **Trigger deploy**, then **Deploy site**, so the password takes effect.

### 4. Share it

Your site lives at something like `https://your-site-name.netlify.app`. You can rename it under **Site configuration**, then **Change site name**. Send that link to everyone.

## How it works for players

- Anyone with the link can enter. No account is needed.
- After saving, players see a **private edit link**. Their browser remembers their team automatically. They only need the edit link to change their team from a different phone or computer.
- Changes are allowed until kickoff. After that the server refuses new entries and edits.

## How it works for you

- Click **Organiser login** at the bottom of the page and enter your `ADMIN_PASSWORD`.
- You can then remove duplicate or test entries and, once the game starts, use the **Enter scores** tab to type in each player's FPL points per gameweek.
- Before the lock, only you (as organiser) can see squads. Players can't see each other's teams until then.
- The app doesn't collect the $25 (£13.20) entry fee. The prize pool and Movember totals shown are $12.50 (£6.60) each for every team entered.
- Injured players are listed in `netlify/lib/players.mjs` and in `public/index.html`.

## Optional: change the kickoff time

The deadline is 11:30pm AEST on 31 October 2026 (1:30pm GMT). To change it, add an environment variable named `KICKOFF` with a time such as `2026-10-31T13:30:00Z` (UTC), then redeploy.

## Making changes later

Edit a file on GitHub (open it and click the pencil icon), then commit. Netlify redeploys automatically within a minute or two. Saved teams are kept.
