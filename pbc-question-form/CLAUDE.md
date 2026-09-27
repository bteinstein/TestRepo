# PBC Personal Finances – Question Form

## What this is
A public, one-page, mobile-first form for **Powerline Baptist Church (Obawole, Iju, Lagos)**. The theme for October is **Capacity Building**, and this session is on **Personal Finances**. Members send questions before the teaching. Every submission is saved to a **Google Sheet**, and the page is hosted on **Vercel**.

The audience is Nigerian church members, mostly on phones and mobile data. Keep the page light and keep the Nigerian context (naira, ajo/esusu, "black tax", loan apps, rent paid yearly, school fees, owambe).

## Layout
```
public/            → static site deployed to Vercel (no build step)
  index.html       → the form (all HTML/CSS/JS inline)
  pbc-logo.png     → church logo, transparent PNG
apps-script/       → Google Apps Script bound to the Sheet (deployed with clasp)
  Code.gs          → doPost appends [time, topic, question, name] to the "Questions" tab
  appsscript.json  → web app: executeAs USER_DEPLOYING, access ANYONE_ANONYMOUS
```

## Requirements (do not change without asking)
- Only the question is required. Name and topic are **optional**, and a blank name is saved as "Anonymous".
- Topic chips: the list in `TOPICS` inside `index.html` (English + Yoruba subtext). Members can pick several; they are saved joined with "; ".
- Deadline: **on or before Sunday 4 October 2026**. The form closes on its own at `CLOSES_AT = 2026-10-04T23:59:59+01:00`.
- The page must say that members can still send their question to the **church WhatsApp group**.
- The answers are read by the user, the Pastor and the speaker, through Viewer access to the Sheet.
- The form posts with `fetch(..., {mode:"no-cors"})` as `URLSearchParams` to the Apps Script `/exec` URL held in `SHEET_URL`.

## Task: do it all, end to end
Work through these steps in order and tell the user when a step needs them (a browser login or a permission prompt).

1. **Check the tools.** Node ≥ 18. Install the CLIs if missing: `npm i -g @google/clasp vercel`.
2. **Google login.** Run `clasp login`. The user must also turn on the Apps Script API at https://script.google.com/home/usersettings. Ask them to do that before you continue.
3. **Create the Sheet and its bound script**, from inside `apps-script/`:
   - clasp v3+: `clasp create-script --type sheets --title "PBC – Personal Finances Questions" --rootDir .`
   - clasp v2: `clasp create --type sheets --title "PBC – Personal Finances Questions" --rootDir .`
   - This creates a new Google Sheet in the user's Drive and writes `.clasp.json`. Save the Sheet URL it prints.
   - Make sure `.clasp.json` does not overwrite `Code.gs` or `appsscript.json`. Then run `clasp push -f`.
4. **Authorize once.** Open the editor (`clasp open-script` in v3, `clasp open` in v2). Ask the user to select `setup` and click **Run**, then accept the permissions. This creates the "Questions" tab. Without it, the web app returns an authorization page instead of saving.
5. **Deploy the web app.** Run `clasp create-deployment -d "v1"` (v3) or `clasp deploy -d "v1"` (v2), and take the deployment ID from the output. The URL is `https://script.google.com/macros/s/<DEPLOYMENT_ID>/exec`.
   - For later code changes, redeploy to the **same** ID so the URL doesn't change: `clasp update-deployment <ID>` (v3) or `clasp deploy -i <ID>` (v2).
6. **Test the endpoint:**
   `curl -sL -X POST "<URL>" --data-urlencode "question=Test from setup – please delete" --data-urlencode "topic=Something else" --data-urlencode "name=Setup test"`
   The response should be `{"ok":true}`, and the row should appear in the Sheet. If you get HTML back, step 4 wasn't completed.
7. **Wire up the form.** In `public/index.html`, replace `PASTE_YOUR_APPS_SCRIPT_URL_HERE` with the `/exec` URL.
8. **Deploy to Vercel**, from inside `public/`: run `vercel login` if needed, then `vercel --prod --yes`. Save the production URL.
9. **Test the live site** by loading the production URL and checking that `pbc-logo.png` loads and `SHEET_URL` is set. If Playwright is available, also submit one test question through the page and confirm it lands in the Sheet.
10. **Clean up.** Ask the user whether to delete the test rows.
11. **Share the Sheet.** Ask the user for the Pastor's and the speaker's Gmail addresses. Either share the Sheet as Viewer yourself (if a Drive tool is available) or tell the user to click Share on the Sheet.
12. **Report** the live form link (ready to post in the church WhatsApp group), the Sheet link, and the Apps Script deployment ID.

## Nice-to-have (only if the user asks)
- A custom domain on Vercel.
- WhatsApp link previews: add `og:image` with the **absolute** production URL of the logo.
- An email alert for each new question: `MailApp.sendEmail` in `doPost`. This needs another authorization run.
