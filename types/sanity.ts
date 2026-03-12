/**
 * TypeScript types for Sanity document shapes.
 * Align with schema in superteamsanity/schemaTypes/.
 */

export interface SanityImage {
  _type: 'image'
  asset?: { _ref: string; _type: string }
  hotspot?: { width: number; height: number; x: number; y: number }
}

export interface LandingPage {
  _id: string
  _type: 'landingPage'
  heroHeadline?: string
  heroSubheadline?: string
  heroPrimaryCtaLabel?: string
  heroPrimaryCtaLink?: string
  heroSecondaryCtaLabel?: string
  heroSecondaryCtaLink?: string
  missionPillars?: Array<{ title?: string; description?: string }>
  stats?: {
    members?: number
    events?: number
    projects?: number
    bounties?: number
    reach?: number
  }
  viewAllEventsUrl?: string
  footerLinks?: Array<{ label?: string; url?: string }>
  socialLinks?: {
    twitter?: string
    discord?: string
    telegram?: string
    superteamGlobal?: string
  }
}

export interface Hero {
  _id: string
  _type: 'hero'
  heroHeadline?: string
  heroSubheadline?: string
  heroPrimaryCtaLabel?: string
  heroPrimaryCtaLink?: string
  heroSecondaryCtaLabel?: string
  heroSecondaryCtaLink?: string
  heroBackgroundUrl?: string
}

export interface Member {
  _id: string
  _type: 'member'
  name: string
  slug?: { current: string }
  image?: SanityImage
  title?: string
  company?: string
  skillTags?: string[]
  twitterUrl?: string
  solanaAchievements?: string
  isFeatured?: boolean
  order?: number
}

export interface Partner {
  _id: string
  _type: 'partner'
  name: string
  logo?: SanityImage
  url?: string
  order?: number
}

export interface FaqItem {
  _id: string
  _type: 'faqItem'
  question: string
  answer: string
  order?: number
}

export interface Testimonial {
  _id: string
  _type: 'testimonial'
  tweetId?: string
  order?: number
}

/** Stats document — Impact metrics, synced to Supabase landing_stats */
export interface SanityStats {
  _id: string
  _type: 'stats'
  members?: number
  events?: number
  projects?: number
  bounties?: number
  reach?: number
}

export interface Event {
  _id: string
  _type: 'event'
  name?: string
  slug?: { current: string }
  description?: string
  startAt?: string
  endAt?: string
  timezone?: string
  url?: string
  location?: string
  geoAddress?: string
  highlight?: boolean
  coverImage?: SanityImage
  order?: number
}
