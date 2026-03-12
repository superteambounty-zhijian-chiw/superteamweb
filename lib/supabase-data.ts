import { supabase } from './supabase'
import type {
  LandingPageRow,
  LandingStatsRow,
  MissionPillarRow,
  FooterLinkRow,
  SocialLinksRow,
  MemberRow,
  PartnerRow,
  FaqItemRow,
  EventRow,
  LandingContent,
  MemberView,
  PartnerView,
  FaqItemView,
  EventView,
} from '@/types/database'

/**
 * Single source for all section content from Supabase.
 * One table per section: landing_page (hero), mission_pillars, landing_stats,
 * footer_links, social_links, partners, faq_items.
 */

/** Fetch all landing section data and assemble into LandingContent */
export async function getLandingContent(): Promise<LandingContent | null> {
  const [heroRes, pillarsRes, statsRes, footerRes, socialRes] = await Promise.all([
    supabase.from('landing_page').select('*').eq('id', 'default').single(),
    supabase.from('mission_pillars').select('id, title, description, order').order('order', { ascending: true, nullsFirst: false }),
    supabase.from('landing_stats').select('*').eq('id', 'default').single(),
    supabase.from('footer_links').select('id, label, url, order').order('order', { ascending: true, nullsFirst: false }),
    supabase.from('social_links').select('*').eq('id', 'default').single(),
  ])

  const hero = heroRes.data as LandingPageRow | null
  if (heroRes.error || !hero) return null

  const missionPillars =
    pillarsRes.data && !pillarsRes.error
      ? (pillarsRes.data as MissionPillarRow[]).map((p) => ({
          title: p.title ?? undefined,
          description: p.description ?? undefined,
        }))
      : []

  const statsRow = statsRes.data as LandingStatsRow | null
  const stats =
    !statsRes.error && statsRow
      ? {
          members: statsRow.members ?? 0,
          events: statsRow.events ?? 0,
          projects: statsRow.projects ?? 0,
          bounties: statsRow.bounties ?? 0,
          reach: statsRow.reach ?? 0,
        }
      : null

  const footerLinks =
    footerRes.data && !footerRes.error
      ? (footerRes.data as FooterLinkRow[]).map((f) => ({
          label: f.label ?? undefined,
          url: f.url ?? undefined,
        }))
      : []

  const socialRow = socialRes.data as SocialLinksRow | null
  const socialLinks =
    !socialRes.error && socialRow
      ? {
          twitter: socialRow.twitter_url ?? undefined,
          discord: socialRow.discord_url ?? undefined,
          telegram: socialRow.telegram_url ?? undefined,
          superteamGlobal: socialRow.superteam_global_url ?? undefined,
        }
      : null

  return {
    heroHeadline: hero.hero_headline,
    heroSubheadline: hero.hero_subheadline,
    heroPrimaryCtaLabel: hero.hero_primary_cta_label,
    heroPrimaryCtaLink: hero.hero_primary_cta_link,
    heroSecondaryCtaLabel: hero.hero_secondary_cta_label,
    heroSecondaryCtaLink: hero.hero_secondary_cta_link,
    viewAllEventsUrl: hero.view_all_events_url,
    heroBackgroundUrl: hero.hero_background_url ?? null,
    missionPillars: missionPillars.length ? missionPillars : null,
    stats,
    footerLinks: footerLinks.length ? footerLinks : null,
    socialLinks,
  }
}

/**
 * Fetch past events (start_at < now), ordered by start_at desc.
 * Used for EventSection "past events" cards (Luma-integrated content from Supabase).
 */
export async function getHighlightedPastEvents(): Promise<EventView[]> {
  const nowIso = new Date().toISOString()
  const { data, error } = await supabase
    .from('events')
    .select('id, name, description, start_at, end_at, timezone, url, cover_url, geo_address')
    .eq('is_published', true)
    .lt('start_at', nowIso)
    .order('start_at', { ascending: false })

  if (error || !data) return []
  return (data as EventRow[]).map(rowToEventView)
}

/**
 * Fetch upcoming events (start_at >= now), ordered by start_at asc.
 * Used for EventSection list with countdown and Register (Luma link).
 */
export async function getUpcomingEvents(): Promise<EventView[]> {
  const nowIso = new Date().toISOString()
  const { data, error } = await supabase
    .from('events')
    .select('id, name, description, start_at, end_at, timezone, url, cover_url, geo_address')
    .eq('is_published', true)
    .gte('start_at', nowIso)
    .order('start_at', { ascending: true })

  if (error || !data) return []
  return (data as EventRow[]).map(rowToEventView)
}

function rowToEventView(r: EventRow): EventView {
  return {
    id: r.id,
    name: r.name,
    description: r.description,
    startAt: r.start_at,
    endAt: r.end_at,
    timezone: r.timezone,
    url: r.url,
    coverUrl: r.cover_url,
    geoAddress: r.geo_address,
  }
}

/**
 * Fetch all data for the marketing landing page from Supabase.
 * Use this so every section (Hero, Mission, Stats, Partners, Members, FAQ, Join CTA, Footer, Events) gets content from Supabase.
 */
export async function getLandingPageData(): Promise<{
  landing: LandingContent | null
  partners: PartnerView[]
  members: MemberView[]
  faq: FaqItemView[]
  pastEvents: EventView[]
  upcomingEvents: EventView[]
}> {
  const [landing, partners, members, faq, pastEvents, upcomingEvents] = await Promise.all([
    getLandingContent(),
    getPartners(),
    getMembers(),
    getFaqItems(),
    getHighlightedPastEvents(),
    getUpcomingEvents(),
  ])
  return { landing, partners, members, faq, pastEvents, upcomingEvents }
}

/** Fetch all partners, ordered */
export async function getPartners(): Promise<PartnerView[]> {
  const { data, error } = await supabase
    .from('partners')
    .select('id, name, logo_url, url, order')
    .eq('is_published', true)
    .order('order', { ascending: true, nullsFirst: false })

  if (error || !data) return []
  return (data as PartnerRow[]).map((r) => ({
    id: r.id,
    name: r.name,
    logoUrl: r.logo_url,
    url: r.url,
  }))
}

/** Fetch all FAQ items, ordered */
export async function getFaqItems(): Promise<FaqItemView[]> {
  const { data, error } = await supabase
    .from('faq_items')
    .select('id, question, answer, order')
    .eq('is_published', true)
    .order('order', { ascending: true, nullsFirst: false })

  if (error || !data) return []
  return (data as FaqItemRow[]).map((r) => ({
    id: r.id,
    question: r.question,
    answer: r.answer,
    order: r.order,
  }))
}

/** Fetch all members, ordered */
export async function getMembers(): Promise<MemberView[]> {
  const { data, error } = await supabase
    .from('members')
    .select('id, name, slug, image_url, title, company, skill_tags, twitter_url, solana_achievements, is_featured, order')
    .eq('is_published', true)
    .order('order', { ascending: true, nullsFirst: false })
    .order('name', { ascending: true })

  if (error || !data) return []
  return (data as MemberRow[]).map(rowToMemberView)
}

/** Fetch featured members only (for landing spotlight) */
export async function getFeaturedMembers(): Promise<MemberView[]> {
  const { data, error } = await supabase
    .from('members')
    .select('id, name, slug, image_url, title, company, skill_tags, twitter_url, solana_achievements, is_featured, order')
    .eq('is_featured', true)
    .eq('is_published', true)
    .order('order', { ascending: true, nullsFirst: false })
    .order('name', { ascending: true })

  if (error || !data) return []
  return (data as MemberRow[]).map(rowToMemberView)
}

function rowToMemberView(r: MemberRow): MemberView {
  return {
    id: r.id,
    name: r.name,
    slug: r.slug,
    imageUrl: r.image_url,
    title: r.title,
    company: r.company,
    skillTags: r.skill_tags ?? [],
    twitterUrl: r.twitter_url,
    solanaAchievements: r.solana_achievements,
    isFeatured: r.is_featured ?? false,
    order: r.order ?? 0,
  }
}
