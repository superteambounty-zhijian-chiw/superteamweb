import Link from 'next/link'
import { Send } from 'lucide-react'
import type { LandingContent } from '@/types/database'

interface JoinCtaSectionProps {
  socialLinks: LandingContent['socialLinks'] | null
}

const DEFAULT_TELEGRAM = 'https://t.me/SuperteamMY'
const DEFAULT_TWITTER = 'https://x.com/SuperteamMY'

/**
 * Join CTA: primary message and interactive cards for Telegram and X.
 */
export function JoinCtaSection({ socialLinks }: JoinCtaSectionProps) {
  const telegramUrl = socialLinks?.telegram || DEFAULT_TELEGRAM
  const twitterUrl = socialLinks?.twitter || DEFAULT_TWITTER

  return (
    <section
      className="px-4 py-16 sm:px-6 sm:py-24"
      aria-labelledby="join-heading"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h2
            id="join-heading"
            className="font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl"
          >
            Join the community
          </h2>
          <p className="mt-4 text-lg text-white/60">
            Connect with us to stay updated and get involved in the Superteam Malaysia ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Telegram Card */}
          <Link
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col items-start overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all hover:bg-white/10"
          >
            <div className="flex size-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md ring-1 ring-white/20 transition-transform group-hover:scale-110">
              <Send className="size-5" />
            </div>
            <h3 className="mt-8 text-2xl font-bold text-white">Get in touch</h3>
            <p className="mt-2 text-balance text-white/50">
              Join our Telegram group to reach out directly, ask questions, and chat with the team.
            </p>
            <div className="mt-auto pt-8">
              <span className="text-sm font-medium text-white transition-opacity group-hover:opacity-80">
                Message us on Telegram →
              </span>
            </div>
          </Link>

          {/* Twitter Card */}
          <Link
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col items-start overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all hover:bg-white/10"
          >
            <div className="flex size-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md ring-1 ring-white/20 transition-transform group-hover:scale-110">
              <XLogo className="size-5" />
            </div>
            <h3 className="mt-8 text-2xl font-bold text-white">Stay with us</h3>
            <p className="mt-2 text-balance text-white/50">
              Follow us on X for the latest news, project announcements, and community highlights.
            </p>
            <div className="mt-auto pt-8">
              <span className="text-sm font-medium text-white transition-opacity group-hover:opacity-80">
                Follow us on X →
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}

function XLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}
