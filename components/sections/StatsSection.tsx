"use client"

import { useRef, useEffect, useState } from 'react'
import { useInView } from 'motion/react'
import type { LandingContent } from '@/types/database'

/** Stat key order and display labels for the stats section */
const STAT_ENTRIES: Array<{ key: keyof NonNullable<LandingContent['stats']>; label: string }> = [
  { key: 'members', label: 'Members' },
  { key: 'events', label: 'Events hosted' },
  { key: 'projects', label: 'Projects built' },
  { key: 'bounties', label: 'Bounties completed' },
  { key: 'reach', label: 'Community reach' },
]

/** Ease-out cubic for count-up animation */
function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3
}

/** Duration in ms for the count-up animation */
const COUNTER_DURATION_MS = 1800

interface StatsSectionProps {
  stats: LandingContent['stats'] | null
}

/**
 * Impact stats: Members, Events hosted, Projects built, Bounties completed, Community reach.
 * Renders animated counters when the section scrolls into view.
 */
export function StatsSection({ stats }: StatsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

  const entries = stats
    ? STAT_ENTRIES.filter(({ key }) => typeof stats[key] === 'number').map(({ key, label }) => ({
        key,
        label,
        value: stats[key] as number,
      }))
    : []

  if (entries.length === 0) {
    return null
  }

  return (
    <section
      ref={sectionRef}
      className="border-t border-border/40 bg-background px-4 py-16 sm:px-6 sm:py-20"
      aria-labelledby="stats-heading"
    >
      <div className="mx-auto max-w-6xl">
        <h2 id="stats-heading" className="sr-only">
          Impact stats
        </h2>
        <div className="flex flex-wrap justify-center gap-6 sm:flex-nowrap">
          {entries.map(({ key, label, value }) => (
            <StatCard key={key} label={label} value={value} shouldAnimate={isInView} />
          ))}
        </div>
      </div>
    </section>
  )
}

interface StatCardProps {
  label: string
  value: number
  shouldAnimate: boolean
}

/**
 * Single stat with count-up animation when shouldAnimate becomes true.
 */
function StatCard({ label, value, shouldAnimate }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!shouldAnimate || hasAnimated.current) return
    hasAnimated.current = true

    const start = performance.now()
    const startValue = 0

    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / COUNTER_DURATION_MS, 1)
      const eased = easeOutCubic(progress)
      const current = Math.round(startValue + (value - startValue) * eased)
      setDisplayValue(current)
      if (progress < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }, [shouldAnimate, value])

  return (
    <div className="flex w-1/3 flex-col items-center py-4 sm:w-1/5">
      <span
        className="font-heading text-3xl font-bold text-white sm:text-4xl"
        aria-label={`${value} ${label}`}
      >
        {displayValue.toLocaleString()}
      </span>
      <span className="mt-1 text-sm text-white">{label}</span>
    </div>
  )
}
