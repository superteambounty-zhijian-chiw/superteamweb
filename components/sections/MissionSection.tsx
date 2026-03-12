'use client'

import Image from 'next/image'
import { useRef, useState, useEffect, type ReactNode } from 'react'
import type { LandingContent } from '@/types/database'
import { cn } from '@/lib/utils'
import { BentoCard } from '@/components/ui/bento-grid'

interface MissionSectionProps {
  pillars: LandingContent['missionPillars'] | null
}

const defaultPillars = [
  { title: 'Builder support', description: 'Mentorship and resources for Solana developers.' },
  { title: 'Events', description: 'Meetups, hackathons, and community gatherings.' },
  { title: 'Grants', description: 'Funding and grants for ecosystem projects.' },
  { title: 'Jobs & bounties', description: 'Opportunities to build and earn.' },
  { title: 'Ecosystem', description: 'Connecting builders with the global Superteam network.' },
  { title: 'Education', description: 'Workshops and learning resources.' },
]

/** Returns the background media used inside each mission content card. */
function missionCardBackground(kind: 'builder' | 'events' | 'grantsJobs' | 'ecosystem' | 'education'): ReactNode {
  const srcMap: Record<string, string> = {
    builder: '/assets/solana-comm5.jpg',
    events: '/assets/solana-comm4.jpg',
    grantsJobs: '/assets/solana-comm3.jpg',
    ecosystem: '/assets/solana-comm2.jpg',
    education: '/assets/solana-comm.jpg',
  }

  const altMap: Record<string, string> = {
    builder: 'Builders collaborating in the Solana community',
    events: 'Community events and meetups',
    grantsJobs: 'Funding and opportunities for Solana builders',
    ecosystem: 'City skyline representing the broader ecosystem',
    education: 'Learning and workshop environment',
  }

  const src = srcMap[kind]
  if (!src) return null

  return (
    <div className="relative h-full w-full overflow-hidden">
      <Image
        src={src}
        alt={altMap[kind]}
        fill
        priority={kind === 'builder'}
        sizes="(min-width: 1024px) 20vw, (min-width: 768px) 40vw, 100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
    </div>
  )
}

/** "Who We Are" title + bento grid content; fades in when in view. */
function WhoWeAreContent({
  items,
}: {
  items: Array<{ title?: string; description?: string }>
}) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.15, rootMargin: '0px 0px -5% 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const [builder, events, grants, jobs, ecosystem, education] = items.slice(0, 6)

  const combinedGrantsJobs = {
    title: grants?.title ?? jobs?.title ?? 'Grants & opportunities',
    description:
      [grants?.description, jobs?.description]
        .filter((part) => part && part.length > 0)
        .join(' ') || 'Funding and opportunities to build and earn.',
  }

  const cards = [
    builder && {
      ...builder,
      background: missionCardBackground('builder'),
    },
    events && {
      ...events,
      background: missionCardBackground('events'),
    },
    {
      ...combinedGrantsJobs,
      background: missionCardBackground('grantsJobs'),
    },
    ecosystem && {
      ...ecosystem,
      background: missionCardBackground('ecosystem'),
    },
    education && {
      ...education,
      background: missionCardBackground('education'),
    },
  ].filter(Boolean) as Array<{
    title?: string
    description?: string
    background?: ReactNode
  }>

  const firstRowCards = cards.slice(0, 3)
  const secondRowCards = cards.slice(3, 5)

  return (
    <div
      ref={sectionRef}
      className="relative z-10 mx-auto max-w-6xl px-4 py-28 sm:px-6 md:py-32"
    >
      <h2
        id="mission-heading"
        className="font-heading text-center text-3xl font-bold text-white sm:text-4xl"
      >
        Empowering Builders in Malaysia
      </h2>
      <div
        className={cn(
          'mt-14 transition-opacity duration-700 ease-out md:mt-20',
          isVisible ? 'opacity-100' : 'opacity-0'
        )}
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {firstRowCards.map((item, idx) => (
            <BentoCard
              key={`mission-top-${idx}`}
              name={item.title ?? 'Pillar'}
              description={item.description ?? ''}
              background={item.background}
              className={cn(
                'min-h-[10.5rem] border border-white/15 bg-white/5 text-white dark:border-white/20 dark:bg-white/10 md:min-h-[18rem] [&_h3]:text-white [&_p]:text-white/80'
              )}
            />
          ))}

          <div className="md:col-span-3">
            <div className="flex flex-col items-stretch justify-center gap-6 md:flex-row">
              {secondRowCards.map((item, idx) => (
                <BentoCard
                  key={`mission-bottom-${idx}`}
                  name={item.title ?? 'Pillar'}
                  description={item.description ?? ''}
                  background={item.background}
                  className={cn(
                    'min-h-[10.5rem] w-full border border-white/15 bg-white/5 text-white dark:border-white/20 dark:bg-white/10 md:min-h-[18rem] md:w-[calc((100%-3rem)/3)] [&_h3]:text-white [&_p]:text-white/80'
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Mission section: "Who We Are" title + mission pillars in a 3+2 card layout.
 * No sticky card or overlay — this scrolls like a normal section.
 */
export function MissionSection({ pillars }: MissionSectionProps) {
  const items = (pillars?.length ? pillars : defaultPillars) as Array<{
    title?: string
    description?: string
  }>

  return (
    <section
      className="relative overflow-hidden border-t border-border/40 bg-black"
      aria-labelledby="mission-heading"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-black [background-image:radial-gradient(rgba(255,255,255,0.28)_1.2px,transparent_1.2px)] [background-size:14px_14px]"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/35 to-black" />
      <WhoWeAreContent items={items} />
    </section>
  )
}
