# Superteam Malaysia Frontend

The official landing page for **Superteam Malaysia**, built with modern web technologies to showcase the community, missions, events, and member achievements.

## 🚀 Project Overview
This project serves as the primary gateway for Superteam Malaysia. It features a dynamic landing page that pulls content directly from **Sanity CMS**, ensuring that the team can update site content without manual code changes. Key sections include:
- **Hero & Mission**: Introduction to Superteam MY's core values.
- **Impact Stats**: Real-time metrics on community reach and activity.
- **Partners**: Showcase of organizations supporting the ecosystem.
- **Past Events**: Highlights of previous community gatherings and hackathons.
- **Members**: Spotlight on featured community members and their achievements.
- **FAQ**: Common questions about joining and participating in Superteam MY.
- **Community**: Vertical marquee of testimonials and social proof.

## 🛠 Tech Stack
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **CMS**: [Sanity.io](https://www.sanity.io/) (via `next-sanity`)
- **Database**: [Supabase](https://supabase.com/) (Downstream store for sync)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Components**: [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/), [shadcn/ui](https://ui.shadcn.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## ⚙️ Environment Variables
Create a `.env.local` file in the root directory and add the following:

```env
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01
SANITY_WEBHOOK_SECRET=your_webhook_secret

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_anon_key
```

## 🗄️ Database Schema (Supabase)
Run the following SQL in your Supabase SQL Editor to align your local/production database with the Sanity content model:

```sql
-- =============================================================================
-- SUPERTEAM MALAYSIA - COMPREHENSIVE CMS SCHEMA
-- Aligned with Sanity schemaTypes and synchronization webhook.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. landing_page (Hero & General Config Singleton)
-- -----------------------------------------------------------------------------
create table if not exists public.landing_page (
  id text primary key default 'default',
  hero_headline text,
  hero_subheadline text,
  hero_primary_cta_label text,
  hero_primary_cta_link text,
  hero_secondary_cta_label text,
  hero_secondary_cta_link text,
  hero_background_url text, -- Store image or video URL
  view_all_events_url text,
  sanity_id text unique,
  updated_at timestamptz default now()
);

-- -----------------------------------------------------------------------------
-- 2. landing_stats (Impact Metrics Singleton)
-- -----------------------------------------------------------------------------
create table if not exists public.landing_stats (
  id text primary key default 'default',
  members int default 0,
  events int default 0,
  projects int default 0,
  bounties int default 0,
  reach int default 0,
  updated_at timestamptz default now()
);

-- -----------------------------------------------------------------------------
-- 3. social_links (Social Presence Singleton)
-- -----------------------------------------------------------------------------
create table if not exists public.social_links (
  id text primary key default 'default',
  twitter_url text,
  discord_url text,
  telegram_url text,
  superteam_global_url text,
  updated_at timestamptz default now()
);




-- -----------------------------------------------------------------------------
-- 6. events (Upcoming and Past Highlights)
-- -----------------------------------------------------------------------------
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  name text,
  description text,
  start_at timestamptz,
  end_at timestamptz,
  timezone text,
  url text,
  cover_url text,
  geo_address text,
  location text,
  highlight boolean default false,
  "order" int default 0,
  sanity_id text unique,
  is_published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- -----------------------------------------------------------------------------
-- 7. members (Community Spotlight)
-- -----------------------------------------------------------------------------
create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text,
  image_url text,
  title text,
  company text,
  skill_tags text[] default '{}',
  twitter_url text,
  solana_achievements text,
  is_featured boolean default false,
  "order" int default 0,
  sanity_id text unique,
  is_published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- -----------------------------------------------------------------------------
-- 8. partners (Ecosystem Supporters)
-- -----------------------------------------------------------------------------
create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  url text,
  "order" int default 0,
  sanity_id text unique,
  is_published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- -----------------------------------------------------------------------------
-- 9. faq_items (Q&A Section)
-- -----------------------------------------------------------------------------
create table if not exists public.faq_items (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  "order" int default 0,
  sanity_id text unique,
  is_published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- -----------------------------------------------------------------------------
-- 10. testimonials (Wall of Love / Tweets)
-- -----------------------------------------------------------------------------
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  tweet_id text,
  "order" int default 0,
  sanity_id text unique,
  is_published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- -----------------------------------------------------------------------------
-- INDEXES & PERFORMANCE
-- -----------------------------------------------------------------------------
create index if not exists idx_events_start_at on public.events (start_at);
create index if not exists idx_events_order on public.events ("order");
create index if not exists idx_members_order on public.members ("order");
create index if not exists idx_partners_order on public.partners ("order");
create index if not exists idx_faq_order on public.faq_items ("order");
create index if not exists idx_testimonials_order on public.testimonials ("order");

-- -----------------------------------------------------------------------------
-- SINGLETON INITIALIZATION
-- -----------------------------------------------------------------------------
insert into public.landing_page (id) values ('default') on conflict (id) do nothing;
insert into public.landing_stats (id) values ('default') on conflict (id) do nothing;
insert into public.social_links (id) values ('default') on conflict (id) do nothing;

```

## 🛠 Local Development Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 3. Linting
```bash
npm run lint
```

## 📦 Installation Steps
1. Clone the repository.
2. Navigate to the `frontend` directory.
3. Install dependencies using `npm install`.
4. Configure environment variables as shown above.
5. Run the development server.

## 🚀 Deployment Instructions
The easiest way to deploy this project is via [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

1. Push your code to a GitHub repository.
2. Import the project into Vercel.
3. Add your environment variables in the Vercel project settings.
4. Deploy!

For Sanity content updates to reflect immediately, ensure you have configured Sanity webhooks if you plan to use caching (currently `revalidate: 0` is used for many fetches to ensure freshness).
