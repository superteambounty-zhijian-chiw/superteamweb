import { sanityClient } from './sanity'
import { urlFor } from './sanity.image'
import {
  landingPageQuery,
  heroQuery,
  statsQuery,
  membersQuery,
  partnersQuery,
  faqQuery,
  pastEventsQuery,
  upcomingEventsQuery,
} from './sanity.queries'
import type {
  LandingPage as SanityLandingPage,
  Hero as SanityHero,
  SanityStats,
  Member as SanityMember,
  Partner as SanityPartner,
  FaqItem as SanityFaqItem,
  Testimonial as SanityTestimonial,
  Event as SanityEvent,
} from '@/types/sanity'
import type {
  LandingContent,
  StatsMap,
  MemberView,
  PartnerView,
  FaqItemView,
  EventView,
} from '@/types/database'

/**
 * Fetches the stats document from Sanity (Stats / Impact key metrics).
 * Used by the Stats section; also synced to Supabase landing_stats via webhook.
 */
export async function getStatsFromSanity(): Promise<StatsMap | null> {
  const doc = await sanityClient.fetch<SanityStats | null>(statsQuery, {}, { next: { revalidate: 0 } })
  if (!doc) return null
  const hasAny = [doc.members, doc.events, doc.projects, doc.bounties, doc.reach].some(
    (v) => typeof v === 'number'
  )
  if (!hasAny) return null
  return {
    members: doc.members ?? undefined,
    events: doc.events ?? undefined,
    projects: doc.projects ?? undefined,
    bounties: doc.bounties ?? undefined,
    reach: doc.reach ?? undefined,
  }
}

/**
 * Fetches the landing page singleton document from Sanity and maps it to the shared LandingContent shape.
 * This is used by the marketing landing page so that content updates in Sanity appear immediately.
 */
export async function getLandingContentFromSanity(): Promise<LandingContent | null> {
  const [landingDoc, heroDoc] = await Promise.all([
    sanityClient.fetch<SanityLandingPage | null>(landingPageQuery, {}, { next: { revalidate: 0 } }),
    sanityClient.fetch<SanityHero | null>(heroQuery, {}, { next: { revalidate: 0 } }),
  ])
  if (!landingDoc && !heroDoc) return null

  const stats =
    landingDoc?.stats && Object.keys(landingDoc.stats).length > 0
      ? {
          members: landingDoc.stats.members,
          events: landingDoc.stats.events,
          projects: landingDoc.stats.projects,
          bounties: landingDoc.stats.bounties,
          reach: landingDoc.stats.reach,
        }
      : null

  return {
    heroHeadline: heroDoc?.heroHeadline ?? landingDoc?.heroHeadline ?? null,
    heroSubheadline: heroDoc?.heroSubheadline ?? landingDoc?.heroSubheadline ?? null,
    heroPrimaryCtaLabel: heroDoc?.heroPrimaryCtaLabel ?? landingDoc?.heroPrimaryCtaLabel ?? null,
    heroPrimaryCtaLink: heroDoc?.heroPrimaryCtaLink ?? landingDoc?.heroPrimaryCtaLink ?? null,
    heroSecondaryCtaLabel: heroDoc?.heroSecondaryCtaLabel ?? landingDoc?.heroSecondaryCtaLabel ?? null,
    heroSecondaryCtaLink: heroDoc?.heroSecondaryCtaLink ?? landingDoc?.heroSecondaryCtaLink ?? null,
    missionPillars: landingDoc?.missionPillars ?? null,
    stats,
    viewAllEventsUrl: landingDoc?.viewAllEventsUrl ?? null,
    heroBackgroundUrl: heroDoc?.heroBackgroundUrl ?? null,
    footerLinks: landingDoc?.footerLinks ?? null,
    socialLinks: landingDoc?.socialLinks ?? null,
  }
}

/**
 * Fetches all partner documents from Sanity and maps them into the normalized PartnerView shape.
 */
export async function getPartnersFromSanity(): Promise<PartnerView[]> {
  const partners = await sanityClient.fetch<SanityPartner[] | null>(
    partnersQuery,
    {},
    {
      // Do not cache partner list aggressively so new partners appear quickly.
      next: { revalidate: 0 },
    },
  )
  if (!partners) {
    return []
  }
  if (!partners.length) {
    return []
  }

  return partners.map((partner) => ({
    id: partner._id,
    name: partner.name,
    logoUrl: partner.logo ? urlFor(partner.logo).width(320).url() : null,
    url: partner.url ?? null,
  }))
}

/**
 * Fetches all member documents from Sanity and maps them into the normalized MemberView shape.
 * Used by both the landing page spotlight section and the members directory.
 */
export async function getMembersFromSanity(): Promise<MemberView[]> {
  const members = await sanityClient.fetch<SanityMember[]>(membersQuery)
  if (!members?.length) {
    return []
  }

  return members.map((member) => ({
    id: member._id,
    name: member.name,
    slug: member.slug?.current ?? null,
    imageUrl: member.image ? urlFor(member.image).width(256).height(256).url() : null,
    title: member.title ?? null,
    company: member.company ?? null,
    skillTags: member.skillTags ?? [],
    twitterUrl: member.twitterUrl ?? null,
    solanaAchievements: member.solanaAchievements ?? null,
    isFeatured: member.isFeatured ?? false,
    order: member.order ?? 0,
  }))
}

/**
 * Fetches all FAQ items from Sanity and maps them into the normalized FaqItemView shape.
 * Uses revalidate: 0 so published changes in Studio appear without long cache.
 */
export async function getFaqFromSanity(): Promise<FaqItemView[]> {
  const raw = await sanityClient.fetch<SanityFaqItem[] | null>(faqQuery, {}, {
    next: { revalidate: 0 },
  })
  const faqItems = Array.isArray(raw) ? raw : []
  if (!faqItems.length) {
    return []
  }

  return faqItems
    .filter((item) => item?.question != null && item?.answer != null)
    .map((item) => ({
      id: item._id,
      question: String(item.question),
      answer: String(item.answer),
      order: typeof item.order === 'number' ? item.order : 0,
    }))
}

/**
 * Fetches all testimonial documents from Sanity and returns their tweet IDs in display order.
 * Used by CommunitySection to render a vertical marquee of tweet cards.
 */
export async function getTestimonialsFromSanity(): Promise<string[]> {
  const docs = await sanityClient.fetch<SanityTestimonial[]>(/* groq */ `*[_type == "testimonial"] | order(order asc){
    _id,
    tweetId,
    order
  }`)
  if (!docs?.length) return []

  return docs
    .map((doc) => doc.tweetId?.trim())
    .filter((tweetId): tweetId is string => Boolean(tweetId))
}

/**
 * Fetches highlighted past events directly from Sanity (startAt < now && highlight == true).
 * Supabase remains the storage target via webhooks; the UI reads from Sanity.
 */
export async function getPastEventsFromSanity(): Promise<EventView[]> {
  const docs = await sanityClient.fetch<SanityEvent[]>(pastEventsQuery)
  if (!docs?.length) return []

  return docs.map((event) => ({
    id: event._id,
    name: event.name ?? null,
    description: event.description ?? null,
    startAt: event.startAt ?? null,
    endAt: event.endAt ?? null,
    timezone: event.timezone ?? null,
    url: event.url ?? null,
    coverUrl: event.coverImage ? urlFor(event.coverImage).width(640).height(360).url() : null,
    geoAddress: event.geoAddress ?? event.location ?? null,
  }))
}

/**
 * Fetches upcoming events directly from Sanity (startAt >= now()).
 */
export async function getUpcomingEventsFromSanity(): Promise<EventView[]> {
  const docs = await sanityClient.fetch<SanityEvent[]>(upcomingEventsQuery)
  if (!docs?.length) return []

  return docs.map((event) => ({
    id: event._id,
    name: event.name ?? null,
    description: event.description ?? null,
    startAt: event.startAt ?? null,
    endAt: event.endAt ?? null,
    timezone: event.timezone ?? null,
    url: event.url ?? null,
    coverUrl: event.coverImage ? urlFor(event.coverImage).width(640).height(360).url() : null,
    geoAddress: event.geoAddress ?? event.location ?? null,
  }))
}

/**
 * Fetches all landing page content and events directly from Sanity.
 * Stats section uses dedicated stats document when present, else landing page stats.
 * Supabase is used as a downstream store only (via webhook sync).
 */
export async function getLandingPageDataFromSanity(): Promise<{
  landing: LandingContent | null
  partners: PartnerView[]
  members: MemberView[]
  faq: FaqItemView[]
  pastEvents: EventView[]
  upcomingEvents: EventView[]
}> {
  const [landing, statsDoc, partners, members, faq, pastEvents, upcomingEvents] =
    await Promise.all([
      getLandingContentFromSanity(),
      getStatsFromSanity(),
      getPartnersFromSanity(),
      getMembersFromSanity(),
      getFaqFromSanity(),
      getPastEventsFromSanity(),
      getUpcomingEventsFromSanity(),
    ])

  // Prefer dedicated Stats document over embedded landing.stats for Stats section
  const landingWithStats: LandingContent | null = landing
    ? { ...landing, stats: statsDoc ?? landing.stats ?? null }
    : statsDoc
      ? { stats: statsDoc }
      : null

  return {
    landing: landingWithStats,
    partners,
    members,
    faq,
    pastEvents,
    upcomingEvents,
  }
}
