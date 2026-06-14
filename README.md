# Phoenix Fitness Website Admin Setup

This project is a Next.js app with:

- Public website content loaded from Neon Postgres when `DATABASE_URL` is configured.
- Serverless route handlers for Vercel under `app/api`.
- Admin panel at `/admin` for editing text, menus, buttons, photos, trainers, testimonials, and leads.
- Unsigned Cloudinary uploads using cloud name `dd9j6cxtw` and upload preset `ml_default`.
- Contact form lead capture into Neon.

## 1. Install dependencies

```bash
npm install
```

## 2. Create the Neon database

1. Create a Neon project.
2. Copy the pooled Postgres connection string.
3. Use it as `DATABASE_URL`.

The app creates these tables automatically on first use:

- `site_content` stores editable website content as JSON.
- `leads` stores contact form submissions.
- `admins` stores admin login users.

## 3. Add environment variables

Create `.env.local` for local development:

```bash
DATABASE_URL="postgresql://..."
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="change-this-password"
ADMIN_SESSION_SECRET="use-a-long-random-secret"
```

The first request that touches Neon will create the tables and seed the admin user from `ADMIN_EMAIL` and `ADMIN_PASSWORD` if that email does not already exist.

This repo includes a local test admin template:

```bash
ADMIN_EMAIL="admin@phoenixfitness.test"
ADMIN_PASSWORD="TestAdmin123!"
```

After adding `DATABASE_URL`, create or reset that admin user with:

```bash
npm run seed:admin
```

## 4. Run locally

```bash
npm run dev
```

Open:

- Website: `http://localhost:3000`
- Admin panel: `http://localhost:3000/admin`

## 5. Upload photos and videos

In `/admin`, open the Media tab and choose a file.

Uploads go directly from the browser to:

```text
https://api.cloudinary.com/v1_1/dd9j6cxtw/auto/upload
```

The upload preset is:

```text
ml_default
```

Because this is an unsigned preset, no Cloudinary API key is needed in the app.

## 6. Capture leads

The public contact form posts to:

```text
/api/contact
```

Successful submissions are stored in the `leads` table and shown in the Admin panel Leads tab.

## 7. Deploy to Vercel

1. Push this project to GitHub.
2. Import the repo in Vercel.
3. Vercel should detect Next.js automatically. This repo also includes `vercel.json` with:

```json
{
  "framework": "nextjs",
  "installCommand": "npm install",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev"
}
```

4. Add these Vercel environment variables:

```bash
DATABASE_URL="postgresql://..."
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="change-this-password"
ADMIN_SESSION_SECRET="use-a-long-random-secret"
```

5. Deploy.
6. Visit `/admin` on the Vercel domain and sign in.

The app uses Next.js App Router pages and route handlers, so direct links like `/admin`, `/about`, `/personal-training`, `/facility`, `/trainers`, `/get-started`, and `/api/*` are server-rendered routes on Vercel. No single-page-app fallback rewrite is needed.

## 8. Admin workflow

1. Sign in at `/admin`.
2. Use Store Editor to edit homepage sections and page-specific hero/section content.
3. Add reusable page sections like split image/text, feature grids, process steps, trainer grids, and intake blocks.
4. Upload or paste image/video URLs in the relevant media fields.
5. Review captured intake submissions in the Leads tab.
6. Add Google and Facebook pixel IDs in the Pixels tab.
7. Changes autosave, and Save Now can be used for a manual save.

## Notes

- If `DATABASE_URL` is missing, the public website still renders using built-in default content, but admin login, visual editing, and lead capture require Neon.
- To rotate the admin password after the first seed, update the `admins` table directly or create a new admin email/password pair before first deployment.
- Keep `ADMIN_SESSION_SECRET` private. Changing it logs out existing admin sessions.
