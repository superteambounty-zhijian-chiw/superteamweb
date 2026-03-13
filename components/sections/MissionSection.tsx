'use client'

import Image from 'next/image'
import { useState, useEffect, useMemo } from 'react'
import type { LandingContent } from '@/types/database'
import { motion } from 'motion/react'
import { DotPattern } from '@/components/ui/dot-pattern'
import { cn } from '@/lib/utils'

interface MissionSectionProps {
  pillars: LandingContent['missionPillars'] | null
}

interface PillarItem {
  title?: string
  description?: string
  kind: string
}

const defaultPillars: PillarItem[] = [
  { title: 'Builder support', description: 'Mentorship and resources for Solana developers.', kind: 'builder' },
  { title: 'Events', description: 'Meetups, hackathons, and community gatherings.', kind: 'events' },
  { title: 'Grants', description: 'Funding and grants for ecosystem projects.', kind: 'grantsJobs' },
  { title: 'Jobs & bounties', description: 'Opportunities to build and earn.', kind: 'ecosystem' },
  { title: 'Education', description: 'Workshops and learning resources.', kind: 'education' },
]

const srcMap: Record<string, string> = {
  builder: '/assets/solana-comm5.jpg',
  events: '/assets/solana-comm4.jpg',
  grantsJobs: '/assets/solana-comm3.jpg',
  ecosystem: '/assets/solana-comm2.jpg',
  education: '/assets/solana-comm.jpg',
}

function MissionCard({
  title,
  description,
  kind,
}: {
  title: string
  description: string
  kind: string
}) {
  const src = srcMap[kind as keyof typeof srcMap] || srcMap.builder

  return (
    <div className="flex h-auto md:h-[450px] w-full flex-row md:flex-col items-center md:items-stretch overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 transition-all hover:border-white/20">
      <div className="relative h-24 w-24 sm:h-32 sm:w-32 md:h-[70%] md:w-full shrink-0 overflow-hidden rounded-2xl md:mb-6">
        <Image
          src={src}
          alt={title}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 30vw, (min-width: 768px) 50vw, 128px"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent hidden md:block" />
      </div>
      <div className="flex flex-col gap-1 pl-6 md:px-2 md:pt-0">
        <h3 className="font-heading text-lg md:text-xl font-bold text-white">{title}</h3>
        <p className="text-sm text-white/60 line-clamp-2 md:line-clamp-3">{description}</p>
      </div>
    </div>
  )
}

export function MissionSection({ pillars }: MissionSectionProps) {
  const items: PillarItem[] = useMemo(() => {
    const rawItems = (pillars?.length ? pillars : defaultPillars) as Array<{ title?: string; description?: string; kind?: string }>
    return rawItems.map((item, idx) => ({
      ...item,
      kind: item.kind || Object.keys(srcMap)[idx % Object.keys(srcMap).length]
    }))
  }, [pillars])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (isMobile) return // Disable auto-slide on mobile

    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1
        // Reset when it grows too large to prevent overflow, but keep it a multiple of items.length
        if (next > 1000) return next % items.length
        return next
      })
    }, 5000)
    return () => clearInterval(timer)
  }, [items.length, isMobile])

  return (
    <section
      className="relative overflow-hidden border-t border-border/40 bg-black py-24 md:py-32"
      aria-labelledby="mission-heading"
    >
      {/* Background decoration */}
      <DotPattern
        width={32}
        height={32}
        className={cn(
          "mask-[radial-gradient(500px_circle_at_center,white,transparent)] opacity-20 text-white/40"
        )}
      />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-black to-transparent pointer-events-none" />

      <div className="relative z-10 mx-auto w-full px-4">
        <h2
          id="mission-heading"
          className="font-heading mb-16 text-center text-4xl font-bold tracking-tight text-white sm:text-5xl md:mb-24"
        >
          Empowering Builders in Malaysia
        </h2>

        <div className="relative mx-auto max-w-7xl px-4">
          {isMobile ? (
            <div className="flex flex-col gap-4">
              {items.map((item, idx) => (
                <MissionCard
                  key={`${item.title}-${idx}`}
                  title={item.title ?? ''}
                  description={item.description ?? ''}
                  kind={item.kind}
                />
              ))}
            </div>
          ) : (
            <div className="overflow-hidden">
              <motion.div
                className="flex gap-6"
                animate={{
                  x: `calc(-${(currentIndex % items.length) * (100 / 3)}% - ${(currentIndex % items.length) * 1.5}rem)`,
                }}
                transition={{
                  duration: 0.6,
                  ease: "easeInOut",
                }}
              >
                {/* Render 3 copies of items to allow for the sliding through the middle copy */}
                {[...items, ...items, ...items].map((item, idx) => (
                  <div
                    key={`${item.title}-${idx}`}
                    className="w-full shrink-0 md:w-[calc((100%-3rem)/3)]"
                  >
                    <MissionCard
                      title={item.title ?? ''}
                      description={item.description ?? ''}
                      kind={item.kind}
                    />
                  </div>
                ))}
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
