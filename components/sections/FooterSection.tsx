import Image from 'next/image'
import Link from 'next/link'
import type { LandingContent } from '@/types/database'

interface FooterSectionProps {
  footerLinks: LandingContent['footerLinks'] | null
  socialLinks: LandingContent['socialLinks'] | null
}

/**
 * FooterSection: renders Superteam Malaysia logo on the left and grouped navigation,
 * global Superteam links, and local social links on the right based on the wireframe.
 */
export function FooterSection({ footerLinks, socialLinks }: FooterSectionProps) {
  const superteamGlobalWebsiteUrl = socialLinks?.superteamGlobal ?? 'https://superteam.fun/'
  const superteamGlobalTwitterUrl = 'https://x.com/superteam'
  const superteamMalaysiaTwitterUrl = socialLinks?.twitter ?? 'https://x.com/SuperteamMY'
  const superteamMalaysiaTelegramUrl = socialLinks?.telegram ?? 'https://t.me/SuperteamMY'

  return (
    <footer
      className="border-t border-white/20 px-4 py-12 sm:px-6"
      role="contentinfo"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-10 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 sm:h-20 sm:w-20">
            <Image
              src="/assets/superteamMY_logo_transparent.png"
              alt="Superteam Malaysia logo"
              fill
              sizes="80px"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="font-heading text-lg font-semibold text-white">
            Superteam Malaysia
          </div>
        </div>

        <div className="grid w-full max-w-2xl gap-8 text-sm text-white/80 sm:max-w-none sm:grid-cols-3 sm:ml-auto sm:text-right sm:items-end sm:justify-items-end">
          <nav aria-label="Footer quick navigation">
            <ul className="space-y-2">
              {(footerLinks ?? []).map((link, index) =>
                link?.url ? (
                  <li key={index}>
                    <Link
                      href={link.url}
                      className="transition-colors hover:text-white"
                    >
                      {link.label ?? 'Link'}
                    </Link>
                  </li>
                ) : null
              )}
              <li>
                <Link
                  href="/members"
                  className="transition-colors hover:text-white"
                >
                  Members
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Global Superteam links">
            <ul className="space-y-2">
              <li>
                <Link
                  href={superteamGlobalWebsiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-white"
                >
                  Visit Global Website
                </Link>
              </li>
              <li>
                <Link
                  href={superteamGlobalTwitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-white"
                >
                  Global Twitter
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Superteam Malaysia social links">
            <ul className="space-y-2">
              <li>
                <Link
                  href={superteamMalaysiaTwitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-white"
                >
                  Twitter
                </Link>
              </li>
              <li>
                <Link
                  href={superteamMalaysiaTelegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-white"
                >
                  Telegram
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-6xl text-center text-xs text-white/70">
        The home for Solana builders in Malaysia.
      </p>
    </footer>
  )
}
