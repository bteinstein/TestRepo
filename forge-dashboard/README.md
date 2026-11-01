# Forge Conversation Themes

Projector-friendly dashboard for the "Difficult Conversations" session (Omni Forge Team Retreat).
It shows **themes**, never raw Slido answers.

## Use it in the session
1. Copy the answers from both Slido polls (admin view, not Present mode).
2. In the dashboard, click **Load results → Copy analysis prompt**, paste it into Claude with the answers.
3. Paste the JSON Claude returns into the box and click **Show**.
4. Click **Present** (or press `P`). `Esc` exits.

Privacy: any theme with fewer than `minThemeSize` (default 3) responses is merged into "Other smaller themes",
and its links are dropped. Results pasted in are kept only in that browser.

## Deploy on Vercel
Import the repo in Vercel. `vercel.json` serves `forge-dashboard/` as a static site, no build step.
To publish fixed results, add `forge-dashboard/data.json` (same JSON shape as the prompt) and redeploy.

## Extending
- `api/analyse` serverless route that calls the Claude API with the raw answers and returns the JSON.
- Pull answers straight from a Slido export (CSV) instead of copy-paste.
- More polls: add entries to `polls`; the board renders the first two.
