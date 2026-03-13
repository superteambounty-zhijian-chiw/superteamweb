import { NextRequest, NextResponse } from 'next/server'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { urlFor } from '@/lib/sanity.image'
import type {
  LandingPage as SanityLandingPage,
  Hero as SanityHero,
  SanityStats,
  Member as SanityMember,
  Partner as SanityPartner,
  FaqItem as SanityFaqItem,
  Testimonial as SanityTestimonial,
  Event as SanityEvent,
  SanityImage,
} from '@/types/sanity'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const sanityWebhookSecret = process.env.SANITY_WEBHOOK_SECRET

/**
 * Builds an admin Supabase client using the service role key.
 * This client is only used inside server-only route handlers.
 */
function getAdminSupabaseClient(): SupabaseClient {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Supabase admin env (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) is not set')
  }
  return createClient(supabaseUrl, supabaseServiceRoleKey)
}

interface SanityWebhookEnvelope {
  current?: unknown
  document?: unknown
  documentId?: string
  documentType?: string
  _id?: string
  _type?: string
  operation?: string
  transition?: string
}

/**
 * Derives a boolean indicating whether this webhook represents a delete / unpublish action.
 * Supports common Sanity webhook payload shapes (operation, transition fields).
 */
function isDeleteLikeOperation(payload: unknown): boolean {
  if (!payload || typeof payload !== 'object') return false
  const typed = payload as SanityWebhookEnvelope
  const op = String(typed.operation ?? '').toLowerCase()
  const transition = String(typed.transition ?? '').toLowerCase()
  if (op === 'delete' || op === 'unpublish') return true
  if (transition === 'disappear') return true
  return false
}

/**
 * Extracts a usable document (_id, _type and fields) from common Sanity webhook payloads.
 * Handles both raw document payloads and {current, previous, ...} envelopes.
 */
function extractSanityDocument(payload: unknown): { doc: unknown; id: string; type: string } {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid Sanity webhook payload')
  }

  const typed = payload as SanityWebhookEnvelope & {
    current?: { _id?: string; _type?: string }
    document?: { _id?: string; _type?: string }
    _id?: string
    _type?: string
  }

  const doc = typed.current ?? typed.document ?? typed
  const id = doc?._id ?? typed.documentId
  const type = doc?._type ?? typed.documentType

  if (!id || !type) {
    throw new Error('Missing _id or _type in Sanity webhook payload')
  }

  return { doc, id, type }
}

/**
 * Builds a public Sanity CDN URL for an image asset, or null when unavailable.
 */
function buildImageUrl(image: SanityImage | undefined): string | null {
  if (!image || !image.asset) return null
  try {
    return urlFor(image).width(1200).url()
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  if (sanityWebhookSecret) {
    const secret = request.nextUrl.searchParams.get('secret')
    if (!secret || secret !== sanityWebhookSecret) {
      return new NextResponse('Invalid webhook secret', { status: 401 })
    }
  }

  let payload: unknown
  try {
    payload = (await request.json()) as unknown
  } catch {
    return new NextResponse('Invalid JSON body', { status: 400 })
  }

  const deleteLike = isDeleteLikeOperation(payload)

  let extracted
  try {
    extracted = extractSanityDocument(payload)
  } catch (error) {
    return new NextResponse((error as Error).message, { status: 400 })
  }

  const { doc, id, type } = extracted

  const admin = getAdminSupabaseClient()

  try {
    switch (type) {
      case 'landingPage':
        if (!deleteLike) {
          await syncLandingPage(admin, id, doc as SanityLandingPage)
        }
        break
      case 'hero':
        if (!deleteLike) {
          await syncHero(admin, id, doc as SanityHero)
        }
        break
      case 'stats':
        if (!deleteLike) {
          await syncStats(admin, doc as SanityStats)
        }
        break
      case 'member':
        await syncMember(admin, id, doc as SanityMember, deleteLike)
        break
      case 'partner':
        await syncPartner(admin, id, doc as SanityPartner, deleteLike)
        break
      case 'faqItem':
        await syncFaqItem(admin, id, doc as SanityFaqItem, deleteLike)
        break
      case 'testimonial':
        await syncTestimonial(admin, id, doc as SanityTestimonial, deleteLike)
        break
      case 'event':
        await syncEvent(admin, id, doc as SanityEvent, deleteLike)
        break
      default:
        // Ignore unknown document types so hooks can be broader without failing.
        return NextResponse.json({ ok: true, skippedType: type })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    // Let Sanity retry on non-2xx responses.
    return new NextResponse(
      `Failed to sync ${type} (${id}): ${(error as Error).message}`,
      { status: 500 },
    )
  }
}

async function syncLandingPage(
  admin: SupabaseClient,
  sanityId: string,
  doc: SanityLandingPage,
): Promise<void> {
  const heroUpsert = {
    id: 'default',
    sanity_id: sanityId,
    hero_headline: doc.heroHeadline ?? null,
    hero_subheadline: doc.heroSubheadline ?? null,
    hero_primary_cta_label: doc.heroPrimaryCtaLabel ?? null,
    hero_primary_cta_link: doc.heroPrimaryCtaLink ?? null,
    hero_secondary_cta_label: doc.heroSecondaryCtaLabel ?? null,
    hero_secondary_cta_link: doc.heroSecondaryCtaLink ?? null,
    view_all_events_url: doc.viewAllEventsUrl ?? null,
    hero_background_url: (doc as SanityLandingPage & { heroBackgroundUrl?: string }).heroBackgroundUrl ?? null,
  }

  const { error: heroError } = await admin.from('landing_page').upsert(heroUpsert)
  if (heroError) throw heroError

  const missionPillars = doc.missionPillars ?? []
  const stats = doc.stats ?? {}
  const footerLinks = doc.footerLinks ?? []
  const socialLinks = doc.socialLinks ?? {}

  const { error: deletePillarsError } = await admin
    .from('mission_pillars')
    .delete()
    .not('id', 'is', null)
  if (deletePillarsError) throw deletePillarsError

  if (missionPillars.length > 0) {
    const pillarRows = missionPillars.map((pillar, index) => ({
      title: pillar?.title ?? null,
      description: pillar?.description ?? null,
      order: index,
    }))
    const { error: insertPillarsError } = await admin.from('mission_pillars').insert(pillarRows)
    if (insertPillarsError) throw insertPillarsError
  }

  const statsUpsert = {
    id: 'default',
    members: stats.members ?? 0,
    events: stats.events ?? 0,
    projects: stats.projects ?? 0,
    bounties: stats.bounties ?? 0,
    reach: stats.reach ?? 0,
  }

  const { error: statsError } = await admin.from('landing_stats').upsert(statsUpsert)
  if (statsError) throw statsError

  const { error: deleteFooterError } = await admin
    .from('footer_links')
    .delete()
    .not('id', 'is', null)
  if (deleteFooterError) throw deleteFooterError

  if (footerLinks.length > 0) {
    const footerRows = footerLinks.map((link, index) => ({
      label: link?.label ?? null,
      url: link?.url ?? null,
      order: index,
    }))
    const { error: insertFooterError } = await admin.from('footer_links').insert(footerRows)
    if (insertFooterError) throw insertFooterError
  }

  const socialUpsert = {
    id: 'default',
    twitter_url: socialLinks.twitter ?? null,
    discord_url: socialLinks.discord ?? null,
    telegram_url: socialLinks.telegram ?? null,
    superteam_global_url: socialLinks.superteamGlobal ?? null,
  }

  const { error: socialError } = await admin.from('social_links').upsert(socialUpsert)
  if (socialError) throw socialError
}

/**
 * Syncs the dedicated hero document to Supabase landing_page (singleton row).
 */
async function syncHero(
  admin: SupabaseClient,
  sanityId: string,
  doc: SanityHero,
): Promise<void> {
  const heroUpsert = {
    id: 'default',
    sanity_id: sanityId,
    hero_headline: doc.heroHeadline ?? null,
    hero_subheadline: doc.heroSubheadline ?? null,
    hero_primary_cta_label: doc.heroPrimaryCtaLabel ?? null,
    hero_primary_cta_link: doc.heroPrimaryCtaLink ?? null,
    hero_secondary_cta_label: doc.heroSecondaryCtaLabel ?? null,
    hero_secondary_cta_link: doc.heroSecondaryCtaLink ?? null,
    hero_background_url: doc.heroBackgroundUrl ?? null,
  }

  const { error } = await admin.from('landing_page').upsert(heroUpsert)
  if (error) throw error
}

/**
 * Syncs the dedicated stats document to Supabase landing_stats (singleton row).
 */
async function syncStats(admin: SupabaseClient, doc: SanityStats): Promise<void> {
  const statsUpsert = {
    id: 'default',
    members: doc.members ?? null,
    events: doc.events ?? null,
    projects: doc.projects ?? null,
    bounties: doc.bounties ?? null,
    reach: doc.reach ?? null,
  }
  const { error } = await admin.from('landing_stats').upsert(statsUpsert)
  if (error) throw error
}

async function syncMember(
  admin: SupabaseClient,
  sanityId: string,
  doc: SanityMember,
  deleteLike: boolean,
): Promise<void> {
  if (deleteLike) {
    const { error } = await admin
      .from('members')
      .update({ is_published: false })
      .eq('sanity_id', sanityId)
    if (error) throw error
    return
  }

  const imageUrl = buildImageUrl(doc.image)

  const upsert = {
    sanity_id: sanityId,
    name: doc.name,
    slug: doc.slug?.current ?? null,
    image_url: imageUrl,
    title: doc.title ?? null,
    company: doc.company ?? null,
    skill_tags: doc.skillTags ?? [],
    twitter_url: doc.twitterUrl ?? null,
    solana_achievements: doc.solanaAchievements ?? null,
    is_featured: doc.isFeatured ?? false,
    order: doc.order ?? 0,
    is_published: true,
  }

  const { error } = await admin.from('members').upsert(upsert, { onConflict: 'sanity_id' })
  if (error) throw error
}

async function syncPartner(
  admin: SupabaseClient,
  sanityId: string,
  doc: SanityPartner,
  deleteLike: boolean,
): Promise<void> {
  if (deleteLike) {
    const { error } = await admin
      .from('partners')
      .update({ is_published: false })
      .eq('sanity_id', sanityId)
    if (error) throw error
    return
  }

  const logoUrl = buildImageUrl(doc.logo)

  const upsert = {
    sanity_id: sanityId,
    name: doc.name,
    logo_url: logoUrl,
    url: doc.url ?? null,
    order: doc.order ?? 0,
    is_published: true,
  }

  const { error } = await admin.from('partners').upsert(upsert, { onConflict: 'sanity_id' })
  if (error) throw error
}

async function syncFaqItem(
  admin: SupabaseClient,
  sanityId: string,
  doc: SanityFaqItem,
  deleteLike: boolean,
): Promise<void> {
  if (deleteLike) {
    const { error } = await admin
      .from('faq_items')
      .update({ is_published: false })
      .eq('sanity_id', sanityId)
    if (error) throw error
    return
  }

  const upsert = {
    sanity_id: sanityId,
    question: doc.question,
    answer: doc.answer,
    order: doc.order ?? 0,
    is_published: true,
  }

  const { error } = await admin.from('faq_items').upsert(upsert, { onConflict: 'sanity_id' })
  if (error) throw error
}

async function syncTestimonial(
  admin: SupabaseClient,
  sanityId: string,
  doc: SanityTestimonial,
  deleteLike: boolean,
): Promise<void> {
  if (deleteLike) {
    const { error } = await admin
      .from('testimonials')
      .update({ is_published: false })
      .eq('sanity_id', sanityId)
    if (error) throw error
    return
  }

  const upsert = {
    sanity_id: sanityId,
    tweet_id: doc.tweetId ?? null,
    order: doc.order ?? 0,
    is_published: true,
  }

  const { error } = await admin
    .from('testimonials')
    .upsert(upsert, { onConflict: 'sanity_id' })
  if (error) throw error
}

async function syncEvent(
  admin: SupabaseClient,
  sanityId: string,
  doc: SanityEvent,
  deleteLike: boolean,
): Promise<void> {
  if (deleteLike) {
    const { error } = await admin
      .from('events')
      .update({ is_published: false })
      .eq('sanity_id', sanityId)
    if (error) throw error
    return
  }

  const coverUrl = buildImageUrl(doc.coverImage)

  const upsert = {
    sanity_id: sanityId,
    name: doc.name ?? null,
    description: doc.description ?? null,
    start_at: doc.startAt ?? null,
    end_at: doc.endAt ?? null,
    timezone: doc.timezone ?? null,
    url: doc.url ?? null,
    cover_url: coverUrl,
    geo_address: doc.geoAddress ?? null,
    location: doc.location ?? null,
    highlight: doc.highlight ?? false,
    order: doc.order ?? 0,
    is_published: true,
  }

  const { error } = await admin.from('events').upsert(upsert, { onConflict: 'sanity_id' })
  if (error) throw error
}

