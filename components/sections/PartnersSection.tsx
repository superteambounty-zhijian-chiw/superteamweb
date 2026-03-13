import Image from 'next/image'
import Link from 'next/link'
import type { PartnerView } from '@/types/database'

interface PartnersSectionProps {
  partners: PartnerView[] | null
}

/**
 * Partners logo grid with hover effects.
 * Logos are sourced from Sanity Studio (via `getPartnersFromSanity`) and
 * represent both Solana projects and Malaysian ecosystem partners.
 */
export function PartnersSection({ partners }: PartnersSectionProps) {
  const hasPartners = Boolean(partners?.length)

  return (
    <section
      className="border-t border-border/40 px-4 py-8 sm:px-6 sm:py-10"
      aria-labelledby="partners-heading"
    >
      <div className="mx-auto max-w-6xl">
        <h2
          id="partners-heading"
          className="font-heading text-center text-3xl font-bold text-foreground sm:text-4xl"
        >
          Powered by Leading Web3 Partners
        </h2>

        {hasPartners ? (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-8 sm:gap-x-10 sm:gap-y-10">
            {partners!.map((partner) => {
              const logoUrl = partner.logoUrl ?? null
              const content = (
                <span className="flex items-center justify-center transition-transform duration-150 ease-out hover:scale-105">
                  {logoUrl ? (
                    <Image
                      src={logoUrl}
                      alt={partner.name}
                      width={220}
                      height={110}
                      className="max-h-16 w-auto object-contain opacity-80 hover:opacity-100"
                    />
                  ) : (
                    <span className="text-lg font-medium text-muted-foreground">
                      {partner.name}
                    </span>
                  )}
                </span>
              )
              return partner.url ? (
                <Link
                  key={partner.id}
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="basis-1/3 sm:basis-auto flex justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {content}
                </Link>
              ) : (
                <span key={partner.id} className="basis-1/3 sm:basis-auto flex justify-center">{content}</span>
              )
            })}
          </div>
        ) : (
          <p className="mt-8 text-center text-sm text-muted-foreground">
            No partners yet. Add Partner documents in Sanity Studio to see them here.
          </p>
        )}
      </div>
    </section>
  )
}
