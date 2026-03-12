import { cn } from "@/lib/utils"
import { Marquee } from "@/components/ui/marquee"
import type { MemberView } from "@/types/database"
import Image from "next/image"

/** Props for the members section (data from Supabase via getLandingPageData) */
interface MemberSectionProps {
  members: MemberView[]
}

/**
 * Build a compact "role/company" subtitle line.
 * Keeps the card layout stable when either field is missing.
 */
function getMemberSubtitle({
  title,
  company,
}: {
  title: string | null | undefined
  company: string | null | undefined
}) {
  if (title && company) return `${title} / ${company}`
  if (title) return title
  if (company) return company
  return null
}

/**
 * Single member card for the marquee.
 * Matches the new rounded glassmorphism style (avatar, name, role/company, tags).
 * If `twitterUrl` exists, the whole card opens Twitter/X in a new tab.
 */
function MemberCard({
  imageUrl,
  name,
  title,
  company,
  skillTags,
  twitterUrl,
}: {
  imageUrl: string | null | undefined
  name: string
  title: string | null | undefined
  company: string | null | undefined
  skillTags: string[] | null | undefined
  twitterUrl: string | null | undefined
}) {
  const subtitle = getMemberSubtitle({ title, company })
  const tags = (skillTags ?? []).filter(Boolean).slice(0, 3)

  const cardContent = (
    <div
      className={cn(
        "group flex h-[372px] w-56 select-none flex-col rounded-3xl p-4",
        "bg-white/10 dark:bg-white/5 backdrop-blur-md",
        "border border-white/25 dark:border-white/10",
        "shadow-[0_10px_30px_rgba(0,0,0,0.12)]",
        "transition-transform duration-200 hover:-translate-y-0.5"
      )}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-white/20 bg-white/10">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
            sizes="224px"
          />
        ) : (
          <span
            className="flex h-full w-full items-center justify-center text-2xl font-semibold text-foreground/80"
            aria-hidden
          >
            {name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      <div className="mt-4 min-w-0">
        <p className="truncate text-base font-semibold text-foreground">
          {name}
        </p>
        {subtitle && (
          <p className="truncate text-sm text-black">{subtitle}</p>
        )}
      </div>

      {/* Reserve space so cards align even when tags are missing */}
      <div className="mt-auto min-h-[44px] pt-3">
        {!!tags.length ? (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-medium",
                  "bg-white/10 dark:bg-white/5",
                  "border border-white/25 dark:border-white/10",
                  "text-foreground/90"
                )}
              >
                {tag.trim().startsWith("#") ? tag.trim() : `#${tag.trim()}`}
              </span>
            ))}
          </div>
        ) : (
          <span className="sr-only">No tags</span>
        )}
      </div>
    </div>
  )

  return (
    <div className="flex shrink-0 flex-col items-start px-2 py-6">
      {twitterUrl ? (
        <a
          href={twitterUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open ${name} on Twitter/X`}
          className="rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          {cardContent}
        </a>
      ) : (
        cardContent
      )}
    </div>
  )
}

/**
 * Members section: horizontal marquee of glassmorphism member cards.
 * Single-row marquee — data (avatar, name, role/company, tags, twitter URL)
 * is fetched from Supabase and passed in via `members` props.
 */
export function MemberSection({ members }: MemberSectionProps) {
  if (!members.length) return null

  return (
    <section className="relative flex w-full flex-col items-center justify-center overflow-hidden py-8">
      <div className="pointer-events-none absolute inset-0 -z-10 max-h-[1000px]">
        <Image
          src="/assets/Add a heading.jpg"
          alt=""
          fill
          priority
          className="object-fit-cover"
        />
      </div>

      <h2 className="mb-6 text-center font-heading text-3xl font-bold text-foreground sm:text-4xl">
        Meet the Builders
      </h2>

      <Marquee pauseOnHover className="[--duration:35s]">
        {members.map((member) => (
          <MemberCard
            key={member.id}
            imageUrl={member.imageUrl}
            name={member.name}
            title={member.title}
            company={member.company}
            skillTags={member.skillTags}
            twitterUrl={member.twitterUrl}
          />
        ))}
      </Marquee>
      {/* Fade edges so marquee content blends at sides */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background to-transparent" />
    </section>
  )
}
