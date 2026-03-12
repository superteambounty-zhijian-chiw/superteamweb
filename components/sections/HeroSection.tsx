import Link from 'next/link'
import type { LandingContent } from '@/types/database'

interface HeroSectionProps {
  data: Pick<
    LandingContent,
    | 'heroHeadline'
    | 'heroSubheadline'
    | 'heroPrimaryCtaLabel'
    | 'heroPrimaryCtaLink'
    | 'heroSecondaryCtaLabel'
    | 'heroSecondaryCtaLink'
  > | null
}

// function renderHeroHeadlineWithSolanaGradient(headline: string) {
//   const solanaMatch = headline.match(/Solana/i)
//   if (!solanaMatch) {
//     return headline
//   }

//   const [beforeSolana, afterSolana] = headline.split(solanaMatch[0])

//   return (
//     <>
//       {beforeSolana}
//       <span className="bg-gradient-to-r from-[#9945FF] via-[#B25CFF] to-[#14F195] bg-clip-text text-transparent">
//         {solanaMatch[0]}
//       </span>
//       {afterSolana}
//     </>
//   )
// }

/**
 * Hero section: headline, subheadline, and primary/secondary CTAs.
 * Uses fallback copy when Sanity content is missing.
 */
export function HeroSection({ data }: HeroSectionProps) {
  const headline = data?.heroHeadline ?? 'Build on Solana in Malaysia'
  const subheadline =
    data?.heroSubheadline ??
    'Join the community of builders, creators, and innovators driving the Solana ecosystem in Malaysia.'
  const primaryLabel = data?.heroPrimaryCtaLabel ?? 'Join Community'
  const primaryLink = data?.heroPrimaryCtaLink ?? '#'
  const secondaryLabel = data?.heroSecondaryCtaLabel ?? 'Explore Opportunities'
  const secondaryLink = data?.heroSecondaryCtaLink ?? '#'

  return (
    <section
      className="relative flex min-h-screen flex-col justify-end overflow-hidden px-4 pb-16 pt-20 sm:px-6 sm:pb-20 sm:pt-24 md:pb-24 md:pt-28"
      aria-labelledby="hero-heading"
    >
      {/* Background hero video from public assets */}
      <video
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      >
        <source src="/assets/Abstract_Solana_Energy_in_Kuala_Lumpur.mp4" type="video/mp4" />
      </video>
      {/* Dark gradient overlay from bottom to top to keep text readable on top of bright video */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"
        aria-hidden="true"
      />
      {/* Soft radial glow behind main hero content */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(153,69,255,0.15),transparent_60%)]"
        aria-hidden="true"
      />

      {/* Bottom row: headline/subheadline left, CTAs right */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <h1
            id="hero-heading"
            className="font-heading text-balance text-left text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl md:tracking-[-0.04em]"
          >
            {headline}
          </h1>
          <p className="mt-5 text-left text-base leading-relaxed text-[#D0D4E0] sm:text-lg">
            {subheadline}
          </p>
        </div>
        <div className="flex flex-shrink-0 flex-wrap items-center justify-end gap-4 sm:justify-end">
          <Link
            href={primaryLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group/cta inline-flex h-12 min-w-[11rem] items-center justify-end gap-3 rounded-full border border-primary/40 bg-primary py-3 pl-8 pr-6 text-base font-semibold text-primary-foreground shadow-inner shadow-[0_0_25px_rgba(153,69,255,0.45)] transition-[min-width,padding,background-color] duration-300 ease-out hover:min-w-[14rem] hover:bg-primary/90 hover:pl-10 hover:pr-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span>{primaryLabel}</span>
            {/* Up-right arrow, visible on hover with smooth fade-in */}
            <span
              className="flex h-5 w-5 flex-shrink-0 opacity-0 transition-opacity duration-300 ease-out group-hover/cta:opacity-100"
              aria-hidden
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7" />
                <path d="M7 7h10v10" />
              </svg>
            </span>
          </Link>
          <Link
            href={secondaryLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center text-sm font-medium text-[#E5E7F5] underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span>{secondaryLabel}</span>
            <span className="ml-2 translate-x-0 text-lg transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}
