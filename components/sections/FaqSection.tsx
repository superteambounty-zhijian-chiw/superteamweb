import { ChevronDown } from 'lucide-react'
import type { FaqItemView } from '@/types/database'

interface FaqSectionProps {
  /** FAQ items from Sanity (synced via getFaqFromSanity / webhook → Supabase). */
  items: FaqItemView[] | null
}

/**
 * Expandable FAQ accordion. Uses native <details>/<summary> for accessibility.
 * Data is ordered by Sanity `order` field and kept in sync via Sanity Studio.
 * Section is always rendered so the #faq anchor works; shows placeholder when no items.
 */
export function FaqSection({ items }: FaqSectionProps) {
  const hasItems = Boolean(items?.length)

  return (
    <section
      id="faq"
      className="border-t border-white/20 px-4 py-16 sm:px-6 sm:py-20"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-3xl">
        <h2
          id="faq-heading"
          className="font-heading text-center text-3xl font-bold text-white sm:text-5xl"
        >
          FAQ
        </h2>
        {hasItems ? (
          <ul className="mt-12" role="list">
            {items!.map((item) => (
              <li key={item.id}>
                <details className="group border-b border-white/20">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-4 font-large text-white [&::-webkit-details-marker]:hidden">
                    <span className="text-left">{item.question}</span>
                    <ChevronDown
                      aria-hidden
                      className="size-5 shrink-0 text-white/70 transition-transform duration-200 group-open:rotate-180"
                    />
                  </summary>
                  <div className="grid overflow-hidden text-sm text-white/80 transition-[grid-template-rows] duration-300 ease-out [grid-template-rows:0fr] group-open:[grid-template-rows:1fr]">
                    <div className="pb-4 whitespace-pre-line">
                      {item.answer}
                    </div>
                  </div>
                </details>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-12 text-center text-white/80">
            No FAQs yet. Add FAQ items in Sanity Studio to see them here.
          </p>
        )}
      </div>
    </section>
  )
}
