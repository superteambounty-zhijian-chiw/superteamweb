'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

/** Fallback Luma URL when CMS view_all_events_url is not set (Superteam Malaysia) */
const DEFAULT_LUMA_URL = 'https://lu.ma/mysuperteam'

/**
 * Luma calendar embed ID — get this from your Luma dashboard:
 * Calendars → select calendar → Settings → Embed → copy the cal-xxx ID.
 * Example: 'cal-Gzr5sGdPCbqqfyA'
 */
const LUMA_CALENDAR_EMBED_ID = 'cal-sZfiZHfUS5piycU'

interface EventSectionProps {
  viewAllEventsUrl: string | null
}

/**
 * Events section: title/subtitle, single highlighted past event (image left, content right)
 * with auto-slider and dot pagination, then upcoming events in glassmorphism containers
 * and "View All Events" CTA.
 */
export function EventSection({
  viewAllEventsUrl,
}: EventSectionProps) {
  const lumaUrl = viewAllEventsUrl ?? DEFAULT_LUMA_URL
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
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 z-1 bg-black/50" aria-hidden />
      {/* Horizontal oval gradient: darker outer, transparent inner */}
      <div
        className="absolute inset-0 z-2"
        style={{
          background: 'radial-gradient(ellipse 100% 40% at 50% 50%, transparent 0%, transparent 25%, rgba(0,0,0,0.4) 80%, rgba(0,0,0,0.75) 100%)',
        }}
        aria-hidden
      />
      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Upcoming events — Split layout */}
        <div className="mb-20 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <h2 id="events-heading" className="font-heading text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Where Builders Meet
            </h2>
            <p className="mt-6 text-lg text-white sm:text-xl max-w-lg">
              Join Superteam Malaysia events on Luma — meetups, workshops, and community gatherings.
            </p>
            <div className="mt-10">
              <Link
                href={lumaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'inline-flex items-center justify-center rounded-xl border border-white/10 px-8 py-3 text-lg font-medium text-white transition-all hover:border-white/20 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                )}
              >
                View More
              </Link>
            </div>
          </div>
          <div className="w-full">
            <div className="mb-4 lg:hidden">
              <h3 className="font-heading text-xl font-semibold text-foreground text-center">
                Upcoming
              </h3>
            </div>
            <LumaCalendarEmbed calendarId={LUMA_CALENDAR_EMBED_ID} />
          </div>
        </div>
      </div>
    </section>
  )
}



/**
 * Luma embedded calendar widget.
 * Renders an iframe pointing to lu.ma/embed/calendar/{calendarId}/events.
 * The calendarId should be the `cal-xxx` ID from your Luma dashboard:
 * Calendars → select calendar → Settings → Embed.
 */
function LumaCalendarEmbed({ calendarId }: { calendarId: string }) {
  return (
    <div
      className="relative overflow-hidden rounded-xl"
      style={{
        /* Subtle glassmorphism wrapper to blend with the section */
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: '0 4px 32px rgba(0,0,0,0.25)',
      }}
    >
      <iframe
        src={`https://lu.ma/embed/calendar/${calendarId}/events`}
        width="100%"
        height="800"
        frameBorder="0"
        style={{
          display: 'block',
          borderRadius: '0.75rem',
          colorScheme: 'dark',
        }}
        allowFullScreen
        aria-hidden={false}
        tabIndex={0}
        title="Superteam Malaysia upcoming events"
      />
    </div>
  )
}


