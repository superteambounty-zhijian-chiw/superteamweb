'use client'

import { useRef, useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import type { FaqItemView } from '@/types/database'
import { cn } from '@/lib/utils'

interface FaqSectionProps {
  /** FAQ items from Sanity (synced via getFaqFromSanity / webhook → Supabase). */
  items: FaqItemView[] | null
}

/**
 * Expandable FAQ accordion with glassmorphism container.
 * The container expands to screen width on scroll (Desktop).
 */
export function FaqSection({ items }: FaqSectionProps) {
  const hasItems = Boolean(items?.length)
  const containerRef = useRef<HTMLDivElement>(null)

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end center'],
  })

  // Smooth out the scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  // Transform width from 80% to 100% (or fixed max-w to full)
  // On mobile we don't want this animation, so we'll apply it conditionally
  const widthTransform = useTransform(smoothProgress, [0, 0.8], ['80%', '100%'])
  const borderRadiusTransform = useTransform(smoothProgress, [0, 0.8], ['24px', '0px'])
  const opacity = useTransform(smoothProgress, [0, 0.2], [0, 1])

  return (
    <section
      id="faq"
      ref={containerRef}
      className="relative flex flex-col items-center py-24 sm:py-32"
      aria-labelledby="faq-heading"
    >
      <motion.div
        style={{
          width: isMobile ? '100%' : widthTransform,
          borderRadius: isMobile ? '0px' : borderRadiusTransform,
          opacity,
        }}
        className={cn(
          'relative mx-auto flex flex-col items-center overflow-hidden border border-white/10 bg-white/5 p-8 backdrop-blur-xl sm:p-12 md:p-16',
          'w-full'
        )}
      >
        <div className="w-full max-w-3xl">

          {hasItems ? (
            <ul className="mt-12 space-y-4" role="list">
              {items!.map((item) => (
                <li key={item.id} className="group">
                  <details className="group overflow-hidden rounded-2xl border border-white/5 bg-white/5 transition-all hover:bg-white/10">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-medium text-white transition-colors hover:text-white/90 [&::-webkit-details-marker]:hidden">
                      <span className="text-left text-lg">{item.question}</span>
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/5 transition-transform duration-300 group-open:rotate-180">
                        <ChevronDown className="size-5 text-white/70" />
                      </div>
                    </summary>
                    <div className="grid overflow-hidden text-white/70 transition-[grid-template-rows] duration-300 ease-out grid-rows-[0fr] group-open:grid-rows-[1fr]">
                      <div className="px-6 pb-6 text-base leading-relaxed whitespace-pre-line">
                        {item.answer}
                      </div>
                    </div>
                  </details>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-12 text-center text-white/60">
              No FAQs yet. Add FAQ items in Sanity Studio to see them here.
            </p>
          )}
        </div>
      </motion.div>
    </section>
  )
}
