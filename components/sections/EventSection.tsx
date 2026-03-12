'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { EventView } from '@/types/database'
import { cn } from '@/lib/utils'

/** Fallback Luma URL when CMS view_all_events_url is not set (Superteam Malaysia) */
const DEFAULT_LUMA_URL = 'https://lu.ma/mysuperteam'

/** Interval in ms for auto-advancing the past events slider */
const PAST_EVENT_SLIDER_INTERVAL_MS = 5000

interface EventSectionProps {
  pastEvents: EventView[]
  upcomingEvents: EventView[]
  viewAllEventsUrl: string | null
}

/**
 * Events section: title/subtitle, single highlighted past event (image left, content right)
 * with auto-slider and dot pagination, then upcoming events in glassmorphism containers
 * and "View All Events" CTA.
 */
export function EventSection({
  pastEvents,
  upcomingEvents,
  viewAllEventsUrl,
}: EventSectionProps) {
  const lumaUrl = viewAllEventsUrl ?? DEFAULT_LUMA_URL
  const [pastSlideIndex, setPastSlideIndex] = useState(0)
  const totalPast = pastEvents.length

  useEffect(() => {
    if (totalPast <= 1) return
    const id = setInterval(() => {
      setPastSlideIndex((i) => (i + 1) % totalPast)
    }, PAST_EVENT_SLIDER_INTERVAL_MS)
    return () => clearInterval(id)
  }, [totalPast])

  return (
    <section
      id="events"
      className="relative overflow-hidden border-t border-border/40 px-4 py-16 sm:px-6 sm:py-20"
      aria-labelledby="events-heading"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/assets/forest_city.jpg')" }}
        aria-hidden
      />
      {/* Horizontal oval gradient: darker outer, transparent inner */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: 'radial-gradient(ellipse 100% 40% at 50% 50%, transparent 0%, transparent 25%, rgba(0,0,0,0.4) 80%, rgba(0,0,0,0.75) 100%)',
        }}
        aria-hidden
      />
      <div className="relative z-10 mx-auto max-w-6xl">
        <header className="mb-10">
          <h2 id="events-heading" className="font-heading text-3xl font-bold text-foreground sm:text-4xl text-center">
          Where Builders Meet
          </h2>
          <p className="mt-2 text-muted-foreground text-center">
            Join Superteam Malaysia events on Luma — meetups, workshops, and community gatherings.
          </p>
        </header>

        {/* Past events: sliding hero (slide left for next) + dot slider below */}
        {pastEvents.length > 0 && (
          <div className="mb-14">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{
                  width: `${totalPast * 100}%`,
                  transform: `translateX(${-(pastSlideIndex * 100) / totalPast}%)`,
                }}
              >
                {pastEvents.map((event, i) => (
                  <div key={event.id} className="flex-shrink-0" style={{ width: `${100 / totalPast}%` }}>
                    <PastEventHero
                      event={event}
                      slideIndex={i}
                      totalSlides={totalPast}
                    />
                  </div>
                ))}
              </div>
            </div>
            {/* Dot slider below past event highlight */}
            {totalPast > 1 && (
              <div className="mt-4 flex justify-center gap-2" role="tablist" aria-label="Past event slides">
                {pastEvents.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    role="tab"
                    aria-selected={i === pastSlideIndex}
                    aria-label={`Go to past event ${i + 1}`}
                    onClick={() => setPastSlideIndex(i)}
                    className={cn(
                      'h-2.5 w-2.5 rounded-full transition-colors duration-300',
                      i === pastSlideIndex
                        ? 'bg-[#8b9dfc]'
                        : 'bg-white/30 hover:bg-white/50 dark:bg-white/20 dark:hover:bg-white/40'
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Upcoming events — glassmorphism containers, no countdown */}
        {upcomingEvents.length > 0 && (
          <div className="mb-10">
            <h3 className="mb-6 font-heading text-xl font-semibold text-foreground">
              Upcoming
            </h3>
            <ul className="space-y-4">
              {upcomingEvents.map((event) => (
                <UpcomingEventRow key={event.id} event={event} />
              ))}
            </ul>
          </div>
        )}

        {/* View All Events CTA — links to Luma */}
        <div className="flex justify-center">
          <Link
            href={lumaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
            )}
          >
            View All Events
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}

/**
 * Single past event hero: large image on the left, title + description on the right.
 * Used inside the auto-rotating slider.
 */
function PastEventHero({
  event,
  slideIndex,
  totalSlides,
}: {
  event: EventView
  slideIndex: number
  totalSlides: number
}) {
  const title = event.name ?? 'Event'
  const dateStr = event.startAt
    ? formatEventDateRange(event.startAt, event.endAt, event.timezone ?? undefined)
    : ''
  const location = event.geoAddress ?? 'Online'
  const description = event.description ?? ''

  return (
    <article
      className="flex flex-col sm:flex-row"
      aria-roledescription="slide"
      aria-label={`Past event ${slideIndex + 1} of ${totalSlides}: ${title}`}
    >
      {/* Left: single image container — 1:1 aspect, full size, rounded corners */}
      <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-xl bg-muted/30 sm:w-[42%] sm:max-w-[420px]">
        {event.coverUrl ? (
          <Image
            src={event.coverUrl}
            alt=""
            fill
            className="object-fit"
            sizes="(min-width: 1024px) 420px, (min-width: 640px) 42vw, 100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#9945ff]/20 to-[#14f195]/10" />
        )}
      </div>
      {/* Right: title + description — full Glassmorphism, gradient border (transparent at outer edges) */}
      <div className="relative flex flex-1 overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 backdrop-blur-md bg-white/[0.01] dark:bg-white/[0.06] rounded-xl"
          aria-hidden
        />
        {/* Gradient border: transparent at outer edges, visible toward center */}
        <div
          className="pointer-events-none absolute inset-0 border border-transparent"
          style={{
            borderImage: 'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.2) 30%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.2) 70%, transparent 100%) 1',
          }}
          aria-hidden
        />
        <div className="relative z-10 flex flex-col justify-center py-6 pl-0 sm:py-8 sm:pl-10">
          <h3 className="font-heading text-xl font-semibold text-foreground sm:text-2xl">{title}</h3>
          <p className="mt-1 text-sm text-black">
            {dateStr}
            {location ? ` · ${location}` : ''}
          </p>
          {description ? (
            <p className="mt-3 line-clamp-4 text-sm text-black">{description}</p>
          ) : null}
          {event.url ? (
            <Link
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm font-medium text-white"
            >
              View on Luma →
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  )
}

/**
 * Single upcoming event row: not a card. White-grey divider on top; glassmorphism
 * background with gradient (transparent at left/right, glass toward center); no rounded corners.
 */
function UpcomingEventRow({ event }: { event: EventView }) {
  const title = event.name ?? 'Event'
  const dateStr = event.startAt
    ? formatEventDateRange(event.startAt, event.endAt, event.timezone ?? undefined)
    : ''
  const location = event.geoAddress ?? 'Online'
  const subtitle = [dateStr, location].filter(Boolean).join(' · ') || 'Date · Time · Place'
  const registerUrl = event.url ?? null

  return (
    <li className="relative overflow-hidden">
      {/* White-grey divider on top of each upcoming event */}
      <div className="border-t border-white/20 dark:border-white/20" aria-hidden />
      {/* Glassmorphism: transparent at left/right, glass toward center; no rounded corners */}
      <div className="relative flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        {/* Gradient glass overlay: transparent edges -> glass center */}
        <div
          className="pointer-events-none absolute inset-0 backdrop-blur-md bg-white/[0.06] dark:bg-white/[0.06]"
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
          }}
          aria-hidden
        />
        <div className="relative z-10 min-w-0 flex-1">
          <h4 className="font-medium text-foreground">{title}</h4>
          <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
        </div>
        {registerUrl && (
          <Link
            href={registerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'relative z-10 shrink-0 inline-flex items-center gap-1.5 rounded-full border border-border bg-background/80 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
            )}
          >
            Register
            <span aria-hidden>→</span>
          </Link>
        )}
      </div>
    </li>
  )
}

/**
 * Format ISO start/end into a human-readable range like "16 January 2025" or
 * "16 January 2025, 7:00 – 9:00 PM MYT" when timezone is provided.
 * Only uses timezone if it's a valid IANA identifier (e.g. Asia/Kuala_Lumpur);
 * abbreviations like "MYT" are appended as display text only.
 */
function formatEventDateRange(startIso: string, endIso: string | null, timezone?: string): string {
  const start = new Date(startIso)
  if (Number.isNaN(start.getTime())) return startIso

  const end = endIso ? new Date(endIso) : null
  const locale: string | undefined = undefined

  // Intl requires IANA identifiers (e.g. Asia/Kuala_Lumpur), not abbreviations (MYT, PST).
  const validTimeZone = timezone && isIanaTimeZone(timezone) ? timezone : undefined
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }
  if (validTimeZone) {
    options.timeZone = validTimeZone
  }

  if (!end || Number.isNaN(end.getTime())) {
    return start.toLocaleString(locale, options) + (timezone && !validTimeZone ? ` ${timezone}` : '')
  }

  const sameDay =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate()

  const dateOpts: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }
  if (validTimeZone) dateOpts.timeZone = validTimeZone

  const timeOpts: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit' }
  if (validTimeZone) timeOpts.timeZone = validTimeZone

  const dateFormatter = new Intl.DateTimeFormat(locale, dateOpts)
  const timeFormatter = new Intl.DateTimeFormat(locale, timeOpts)

  const tzSuffix = timezone && !validTimeZone ? ` ${timezone}` : ''

  if (sameDay) {
    const datePart = dateFormatter.format(start)
    const startTime = timeFormatter.format(start)
    const endTime = timeFormatter.format(end)
    return `${datePart}, ${startTime} – ${endTime}${tzSuffix}`
  }

  const startFull = start.toLocaleString(locale, options)
  const endFull = end.toLocaleString(locale, options)
  return `${startFull} – ${endFull}${tzSuffix}`
}

/** True if value is a valid IANA time zone identifier (e.g. Asia/Kuala_Lumpur). */
function isIanaTimeZone(value: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: value })
    return true
  } catch {
    return false
  }
}
