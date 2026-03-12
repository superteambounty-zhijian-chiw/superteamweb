'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

// Admin is not the part of landing page, no need in adding it to the navbar.

/** Nav link label and href */
const NAV_LINKS: { label: string; href: string }[] = [
  { label: 'Home', href: '/' },
  { label: 'Opportunities', href: '/#mission' },
  { label: 'Events', href: '/#events' },
  { label: 'Members', href: '/members' },
  
  { label: 'Wall of Love', href: '/#wall-of-love' },
  { label: 'FAQ', href: '/#faq' },
]

/** Social icon config: image from frontend public assets, alt and URL */
const SOCIAL_LINKS: { src: string; alt: string; href: string }[] = [
  { src: '/assets/twitter.png', alt: 'Twitter / X', href: 'https://x.com/SuperteamMY' },
  { src: '/assets/telegram.png', alt: 'Telegram', href: 'https://t.me/SuperteamMY' },
]

const LOGO_SRC = '/assets/superteamMY_logo_transparent.png'

/** Breakpoint (px) at which desktop nav switches to hamburger menu */
const NAV_BREAKPOINT = 1200

/**
 * Top navigation with glassmorphism design.
 * Desktop (≥1200px): logo left, links center, social icons right.
 * Mobile (<1200px): logo left, hamburger right; click toggles menu with links + social.
 */
export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(true)

  useEffect(() => {
    const check = () => {
      const desktop = window.innerWidth >= NAV_BREAKPOINT
      setIsDesktop(desktop)
      if (desktop) setIsMenuOpen(false)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <>
    <header
      className="fixed top-0 left-0 right-0 z-50 w-full pt-4"
      style={{ paddingLeft: 'max(1rem, env(safe-area-inset-left))', paddingRight: 'max(1rem, env(safe-area-inset-right))' }}
      role="banner"
    >
      {/* Glassmorphism bar: semi-transparent + blur */}
      <nav
        className="mx-auto flex h-14 max-w-[1400px] items-center justify-between rounded-full border border-white/10 bg-white/5 px-6 shadow-lg backdrop-blur-md sm:px-8"
        aria-label="Main navigation"
      >
        {/* Logo — left */}
        <Link
          href="/"
          className="relative flex shrink-0 items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-full"
          aria-label="Superteam Malaysia home"
        >
          <Image
            src={LOGO_SRC}
            alt="Superteam Malaysia"
            width={140}
            height={36}
            className="h-8 w-auto object-contain"
            priority
          />
        </Link>

        {/* Center nav links — visible only ≥1200px (arbitrary breakpoint) */}
        <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-8 min-[1200px]:flex">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-sm font-medium text-white/90 transition-colors hover:text-white"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right: social icons (desktop) or hamburger (mobile) */}
        <div className="flex items-center gap-4">
          {/* Social icons — visible only ≥1200px */}
          <div className="hidden items-center gap-5 min-[1200px]:flex">
            {SOCIAL_LINKS.map(({ src, alt, href }) => (
              <a
                key={alt}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-90 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                aria-label={alt}
              >
                <Image src={src} alt="" width={22} height={22} className="h-[22px] w-[22px] object-contain" />
              </a>
            ))}
          </div>

          {/* Hamburger / Close — visible <1200px; use Lucide icons (no image assets) */}
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg border-0 bg-transparent p-0 opacity-90 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-[1200px]:hidden"
            onClick={() => setIsMenuOpen((o) => !o)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav-menu"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" size={24} />
            ) : (
              <Menu className="h-6 w-6" size={24} />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay — expands down smoothly when open (<1200px) */}
      <div
        id="mobile-nav-menu"
        className="min-[1200px]:hidden"
        aria-hidden={!isMenuOpen}
      >
        <div
          className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
          style={{
            maxHeight: isMenuOpen ? 480 : 0,
          }}
        >
          <div className="mx-4 mt-2 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-md sm:mx-6 md:mx-8">
            <ul className="flex flex-col gap-4" role="list">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="block rounded-lg px-4 py-3 text-base font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white"
                    onClick={closeMenu}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex gap-6 border-t border-white/10 pt-6">
              {SOCIAL_LINKS.map(({ src, alt, href }) => (
                <a
                  key={alt}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-90 transition-opacity hover:opacity-100"
                  aria-label={alt}
                >
                  <Image src={src} alt="" width={28} height={28} className="h-7 w-7 object-contain" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
    </>
  )
}
