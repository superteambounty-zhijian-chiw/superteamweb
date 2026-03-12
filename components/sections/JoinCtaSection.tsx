import Link from 'next/link'
import type { LandingContent } from '@/types/database'

interface JoinCtaSectionProps {
  socialLinks: LandingContent['socialLinks'] | null
}

const socialConfig = [
  { key: 'telegram' as const, label: 'Telegram', icon: '✈' },
  { key: 'discord' as const, label: 'Discord', icon: '💬' },
  { key: 'twitter' as const, label: 'Twitter / X', icon: '𝕏' },
]

/**
 * Join CTA: primary message and links to Telegram, Discord, Twitter.
 */
export function JoinCtaSection({ socialLinks }: JoinCtaSectionProps) {
  return (
    <section
      className="border-t border-white/20 px-4 py-16 sm:px-6 sm:py-20"
      aria-labelledby="join-heading"
    >
      <div className="mx-auto max-w-2xl text-center">
        <h2
          id="join-heading"
          className="font-heading text-3xl font-bold text-white sm:text-4xl"
        >
          Join the community
        </h2>
        <p className="mt-3 text-white/80">
          Connect on Telegram, Discord, and X to stay updated and get involved.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          {socialConfig.map(({ key, label, icon }) => {
            const href = socialLinks?.[key]
            if (!href) return null
            return (
              <Link
                key={key}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center justify-center rounded-full border border-white/40 bg-white/10 px-6 text-sm font-medium text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                <span className="mr-2" aria-hidden>{icon}</span>
                {label}
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
