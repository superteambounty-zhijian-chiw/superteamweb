/**
 * Supabase CMS row types and view types for the website.
 * One table per section: landing_page (hero), mission_pillars, landing_stats,
 * events, footer_links, social_links, partners, faq_items, members, testimonials.
 */

/** Single row from landing_page — Hero section only (singleton) */
export interface LandingPageRow {
  id: string
  hero_headline: string | null
  hero_subheadline: string | null
  hero_primary_cta_label: string | null
  hero_primary_cta_link: string | null
  hero_secondary_cta_label: string | null
  hero_secondary_cta_link: string | null
  hero_background_url: string | null
  view_all_events_url: string | null
  updated_at: string | null
  sanity_id?: string | null
}

/** Row from mission_pillars — Mission section */
export interface MissionPillarRow {
  id: string
  title: string | null
  description: string | null
  order: number | null
  created_at: string | null
  updated_at: string | null
}

/** Shape used by MissionSection (title + description) */
export interface MissionPillar {
  title?: string
  description?: string
}

/** Row from landing_stats — Stats section (singleton) */
export interface LandingStatsRow {
  id: string
  members: number | null
  events: number | null
  projects: number | null
  bounties: number | null
  reach: number | null
  updated_at: string | null
}

export interface StatsMap {
  members?: number
  events?: number
  projects?: number
  bounties?: number
  reach?: number
}

/** Row from events — Events section (Luma-synced fields) */
export interface EventRow {
  id: string
  name: string | null
  description: string | null
  start_at: string | null
  end_at: string | null
  timezone: string | null
  url: string | null
  cover_url: string | null
  geo_address: string | null
  created_at: string | null
  updated_at: string | null
  sanity_id?: string | null
  is_published?: boolean | null
}

/** Normalized event for EventSection (past + upcoming lists) */
export interface EventView {
  id: string
  name: string | null
  description: string | null
  startAt: string | null
  endAt: string | null
  timezone: string | null
  url: string | null
  coverUrl: string | null
  geoAddress: string | null
}

/** Row from footer_links — Footer section */
export interface FooterLinkRow {
  id: string
  label: string | null
  url: string | null
  order: number | null
  created_at: string | null
  updated_at: string | null
}

/** Shape used by FooterSection (label + url) */
export interface FooterLink {
  label?: string
  url?: string
}

/** Row from social_links — Join CTA + Footer social (singleton) */
export interface SocialLinksRow {
  id: string
  twitter_url: string | null
  discord_url: string | null
  telegram_url: string | null
  superteam_global_url: string | null
  updated_at: string | null
}

export interface SocialLinksMap {
  twitter?: string
  discord?: string
  telegram?: string
  superteamGlobal?: string
}

/** Row from members */
export interface MemberRow {
  id: string
  name: string
  slug: string | null
  image_url: string | null
  title: string | null
  company: string | null
  skill_tags: string[] | null
  twitter_url: string | null
  solana_achievements: string | null
  is_featured: boolean | null
  order: number | null
  created_at: string | null
  updated_at: string | null
  sanity_id?: string | null
  is_published?: boolean | null
}

/** Row from partners */
export interface PartnerRow {
  id: string
  name: string
  logo_url: string | null
  url: string | null
  order: number | null
  created_at: string | null
  updated_at: string | null
  sanity_id?: string | null
  is_published?: boolean | null
}

/** Row from faq_items */
export interface FaqItemRow {
  id: string
  question: string
  answer: string
  order: number | null
  created_at: string | null
  updated_at: string | null
  sanity_id?: string | null
  is_published?: boolean | null
}

/** Row from testimonials */
export interface TestimonialRow {
  id: string
  tweet_id: string | null
  order: number | null
  created_at: string | null
  updated_at: string | null
  sanity_id?: string | null
  is_published?: boolean | null
}

/** Normalized shape for landing sections (from Supabase or Sanity) */
export interface LandingContent {
  heroHeadline?: string | null
  heroSubheadline?: string | null
  heroPrimaryCtaLabel?: string | null
  heroPrimaryCtaLink?: string | null
  heroSecondaryCtaLabel?: string | null
  heroSecondaryCtaLink?: string | null
  missionPillars?: Array<{ title?: string; description?: string }> | null
  stats?: StatsMap | null
  viewAllEventsUrl?: string | null
  heroBackgroundUrl?: string | null
  footerLinks?: Array<{ label?: string; url?: string }> | null
  socialLinks?: SocialLinksMap | null
}

/** Normalized partner for sections (id + optional logo URL) */
export interface PartnerView {
  id: string
  name: string
  logoUrl?: string | null
  url?: string | null
}

/** Normalized member for sections and members page */
export interface MemberView {
  id: string
  name: string
  slug?: string | null
  imageUrl?: string | null
  title?: string | null
  company?: string | null
  skillTags?: string[] | null
  twitterUrl?: string | null
  solanaAchievements?: string | null
  isFeatured?: boolean | null
  order?: number | null
}

/** Normalized FAQ item */
export interface FaqItemView {
  id: string
  question: string
  answer: string
  order?: number | null
}
