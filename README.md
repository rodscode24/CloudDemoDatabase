# Supabase + Static HTML/JS CRUD Example

A pure HTML/CSS/JavaScript CRUD app for a `tasks` table, using the
Supabase JS client directly from the browser — no backend, no build step.
Deployable as-is on GitHub Pages.

## 1. Create the Supabase project & table

1. Go to https://supabase.com and create a free project.
2. Open **SQL Editor → New query**, paste the contents of `schema.sql`,
   and run it. This creates the `tasks` table **and** the Row Level
   Security (RLS) policies that allow the public anon key to read/write.

   > RLS matters here: since this is a static site, your Supabase URL and
   > anon key are visible to anyone who views the page source. RLS
   > policies (not secrecy of the key) are what control what the anon key
   > can actually do. The policies in `schema.sql` allow full public
   > read/write, which is fine for a demo — don't use this setup for
   > anything with sensitive data.

## 2. Get your API credentials

In Supabase: **Project Settings → API**.

- **Project URL** → looks like `https://xxxxxxxx.supabase.co`
- **anon public** key → a long JWT-looking string

Open `config.js` and fill in `SUPABASE_URL` and `SUPABASE_ANON_KEY`.

## 3. Test it locally (optional)

Since it's static files, you can just open `index.html` in a browser, or
serve it locally:
```bash
cd supabase-html-crud
python3 -m http.server 8000
```
Then visit http://localhost:8000

## 4. Deploy to GitHub Pages

1. Create a new GitHub repo and push these files to it:
   ```bash
   cd supabase-html-crud
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```
2. On GitHub: go to the repo → **Settings → Pages**.
3. Under **Source**, choose **Deploy from a branch**, pick `main` and
   `/ (root)`, then **Save**.
4. After a minute, your app will be live at:
   `https://YOUR_USERNAME.github.io/YOUR_REPO/`

That's it — no server, no PHP, no build process.

## Files

- `index.html` — page markup (table + modal form)
- `app.js` — all CRUD logic, using the Supabase JS client
- `config.js` — your Supabase URL + anon key (edit this first!)
- `style.css` — minimal styling
- `schema.sql` — run once in Supabase's SQL editor (table + RLS policies)

## Notes

- `config.js` with your anon key is meant to be public/committed — that's
  normal for Supabase static-site apps. Just make sure your RLS policies
  match what you actually want strangers to be able to do.
- If you want per-user data instead of "anyone can edit anything," add
  Supabase Auth (email/password or OAuth) and change the RLS policies to
  check `auth.uid()` instead of `using (true)`.
