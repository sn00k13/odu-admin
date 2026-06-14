# odu-admin

Internal admin panel for The Odu Project (https://theoduproject.com). Built with Next.js 15, TypeScript, and Tailwind CSS. Deployed separately from the public site.

## Paired project

The public-facing site lives at `../odu-nextjs`. Both projects share the same Supabase instance. Changes to table schemas or field names must be kept in sync across both codebases.

## Tech stack

- **Framework**: Next.js 15 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + global CSS in `app/globals.css`
- **Database**: Supabase (Postgres)
- **Rich text editor**: TipTap (`BlogEditor` component — used for all content types)
- **Image uploads**: Cloudinary (`CloudinaryUpload` component)
- **Icons**: lucide-react

## Auth

Authentication is **custom cookie-based**, not Supabase Auth. There is no Supabase JWT involved.

- Login: `POST /api/login` — validates a password against `ADMIN_PASSWORD` env var, sets `odu_admin_auth` cookie
- Logout: `POST /api/logout`
- Guard: `middleware.ts` redirects all non-`/login`, non-`/api/*` routes to `/login` if the cookie is missing or wrong
- Server-side check: `lib/auth.ts` → `isAdmin()` — call this at the top of every API route handler before touching the database

## Supabase client usage — critical distinction

Two clients exist. Using the wrong one will either break RLS-protected reads or expose data.

| Client | File | Key used | Bypasses RLS |
|---|---|---|---|
| `createClient()` | `lib/supabase/server.ts` | Anon key | No |
| `createAdminClient()` | `lib/supabase/admin.ts` | Service role key | Yes |

**Rule:**
- `newsletters`, `subscribers` reads → **`createAdminClient()`** (these tables have RLS enabled; anon key cannot read them)
- `blogs`, `projects`, `comments` reads → `createClient()` (anon key, existing behaviour)
- All writes (INSERT, UPDATE, DELETE) in API routes → **`createAdminClient()`** (already the case for all tables)

`createAdminClient()` is synchronous. `createClient()` is async (requires `await`).

## RLS policy decisions

`newsletters` and `subscribers` have RLS enabled. `blogs`, `projects`, `comments` do not (or have open anon read policies).

```sql
-- newsletters: anon can only read published rows
create policy "Public can read published newsletters"
  on public.newsletters for select using (published = true);

-- subscribers: anon can insert (public sign-up form), cannot select
create policy "Anyone can subscribe"
  on public.subscribers for insert with check (true);
```

## Database schema

### blogs
```
id bigint pk, title text, content text (TipTap HTML), image text (Cloudinary URL),
category text, firstname text, lastname text, views int8 default 0, likes int8 default 0,
published bool default false, created_at timestamptz, updated_at timestamptz
```

### comments
```
id bigint pk, blog_id bigint (fk blogs.id), user_id text, name text, text text,
created_at timestamptz
```

### projects
```
id bigint pk, title text, content text (TipTap HTML), image text (Cloudinary URL),
category text, published bool default false, created_at timestamptz, updated_at timestamptz
```

### newsletters
```
id bigint pk, title text (internal name), subject text (email subject line),
content text (TipTap HTML), published bool default false,
sent_at timestamptz (nullable, set once on first publish), created_at timestamptz,
updated_at timestamptz
```

### subscribers
```
id bigint pk, email text unique, name text (nullable),
subscribed bool default true, created_at timestamptz
```

## File structure

```
app/
  (dashboard)/            # Route group — all behind auth, shares AdminSidebar layout
    page.tsx              # Overview / stats
    blogs/
      page.tsx            # Blog list
      BlogsTable.tsx      # Client component — inline publish/delete
      new/page.tsx
      [id]/edit/page.tsx
    projects/             # Same structure as blogs
    newsletters/          # Same structure as blogs
    subscribers/
      page.tsx            # Read-only list (no create — subscribers sign up on public site)
      SubscribersTable.tsx
    comments/
      page.tsx
      CommentsTable.tsx
  api/
    login/route.ts
    logout/route.ts
    blogs/route.ts              # POST
    blogs/[id]/route.ts         # PATCH, DELETE
    projects/route.ts           # POST
    projects/[id]/route.ts      # PATCH, DELETE
    newsletters/route.ts        # POST
    newsletters/[id]/route.ts   # PATCH, DELETE
    subscribers/[id]/route.ts   # PATCH (toggle subscribed), DELETE — no POST
  login/
    page.tsx
    LoginForm.tsx
  globals.css
  layout.tsx

components/
  AdminSidebar.tsx        # Nav: Overview, Blogs, Projects, Newsletters, Subscribers, Comments
  BlogEditor.tsx          # TipTap rich text editor — reused by all content forms
  CloudinaryUpload.tsx    # Drag-and-drop Cloudinary image uploader — reused by content forms
  BlogForm.tsx            # Blog create/edit form
  ProjectForm.tsx         # Project create/edit form
  NewsletterForm.tsx      # Newsletter create/edit form (no image — title, subject, content)

lib/
  types.ts                # Blog, Comment, Project, Newsletter, Subscriber interfaces
  data.ts                 # Server-side data fetching functions
  auth.ts                 # isAdmin()
  supabase/
    client.ts             # Browser client (not used in admin)
    server.ts             # SSR client (anon key)
    admin.ts              # Service role client
```

## Adding a new content type — checklist

Follow this pattern every time:

1. **`lib/types.ts`** — add interface
2. **`lib/data.ts`** — add `getAll*Admin()` and `getSingle*()` functions; use `createAdminClient()` if the table has RLS
3. **`app/api/<type>/route.ts`** — POST handler with `isAdmin()` guard
4. **`app/api/<type>/[id]/route.ts`** — PATCH + DELETE handlers with `isAdmin()` guard
5. **`components/<Type>Form.tsx`** — create/edit form; reuse `BlogEditor` and `CloudinaryUpload`
6. **`app/(dashboard)/<type>/`** — `page.tsx`, `<Type>Table.tsx`, `new/page.tsx`, `[id]/edit/page.tsx`
7. **`components/AdminSidebar.tsx`** — add nav entry with a lucide icon
8. **Supabase** — create table + enable RLS if the data is sensitive; update this file with schema

## API route conventions

- Every handler calls `if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })` first
- PATCH always merges `updated_at: new Date().toISOString()` into the update payload
- PATCH and DELETE use `Number(id)` to cast the route param
- POST returns the inserted row with `status: 201`

## Styling conventions

- Primary colour: `red-600` / `red-700` (hover) — buttons, active nav, focus rings
- Layout: white sidebar (`w-56`) + `bg-gray-50` main area
- Tables: `.admin-table` CSS class defined in `globals.css`
- Status badges: `bg-green-50 text-green-700` (published/active) vs `bg-gray-100 text-gray-500` (draft/inactive)
- All forms are `max-w-4xl`, use `space-y-6`, and end with a save + cancel button row

## Environment variables

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
ADMIN_PASSWORD
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
NEXT_PUBLIC_SITE_URL           # defaults to https://theoduproject.com
```
