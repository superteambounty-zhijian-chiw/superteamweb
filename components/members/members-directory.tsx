"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"

import { FlickeringGrid } from "@/components/ui/flickering-grid"
import { cn } from "@/lib/utils"

/** Public profile data for a single member card on the directory grid. */
interface MemberCardData {
  id: string
  name: string
  title?: string | null
  company?: string | null
  imageUrl?: string | null
  skillTags?: string[] | null
  twitterUrl?: string | null
}

/** Props for the members directory grid, driven by Sanity data from the server page. */
interface MembersDirectoryProps {
  members: MemberCardData[]
}

/** All supported skill filters shown as pills and in the dropdown. */
const SKILL_FILTERS = [
  "Core Team",
  "Rust",
  "Frontend",
  "Design",
  "Content",
  "Growth",
  "Product",
  "Community",
] as const

type SkillFilter = (typeof SKILL_FILTERS)[number] | "All"

/** Build a stable subtitle string combining title and company for the card footer. */
function getMemberSubtitle(title?: string | null, company?: string | null) {
  if (title && company) return `${title} / ${company}`
  if (title) return title
  if (company) return company
  return ""
}

/** Member card rendered in the grid, with hover glow and smooth focus styles. */
function MemberCard({ member }: { member: MemberCardData }) {
  const subtitle = getMemberSubtitle(member.title ?? null, member.company ?? null)
  const tags = (member.skillTags ?? []).filter(Boolean)

  return (
    <article
      className={cn(
        "group relative flex flex-col rounded-3xl border border-white/10 bg-slate-900/70 p-4",
        "shadow-[0_18px_45px_rgba(0,0,0,0.55)] backdrop-blur-xl",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-1 hover:border-[#14F195]/40 hover:shadow-[0_0_40px_rgba(20,241,149,0.55)]"
      )}
    >
      <div className="flex flex-col items-stretch gap-4">
        <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-2xl border border-white/15 bg-slate-800/80">
          {member.imageUrl ? (
            <Image
              src={member.imageUrl}
              alt={member.name}
              fill
              sizes="96px"
              className="object-cover"
            />
          ) : (
            <span
              className="flex h-full w-full items-center justify-center text-2xl font-semibold text-slate-100"
              aria-hidden
            >
              {member.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1 text-center">
          <h2 className="truncate text-base font-semibold text-slate-50">{member.name}</h2>
          {subtitle ? (
            <p className="truncate text-xs text-slate-300">{subtitle}</p>
          ) : null}
        </div>

        {tags.length ? (
          <div className="mt-1 flex flex-wrap justify-center gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/15 bg-slate-900/80 px-2 py-0.5 text-[11px] font-medium text-slate-100"
              >
                {tag.trim().startsWith("#") ? tag.trim() : `#${tag.trim()}`}
              </span>
            ))}
          </div>
        ) : null}

        {member.twitterUrl ? (
          <a
            href={member.twitterUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex items-center justify-center rounded-full border border-transparent bg-slate-800/80 px-3 py-1 text-xs font-medium text-[#14F195] transition-colors hover:border-[#14F195]/80 hover:bg-slate-900/80"
            aria-label={`Open ${member.name} on Twitter/X`}
          >
            Twitter / X
          </a>
        ) : null}
      </div>
    </article>
  )
}

/** Grid of member cards with search, skill filters, and scroll-in animation. */
export function MembersDirectory({ members }: MembersDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [skillFilter, setSkillFilter] = useState<SkillFilter>("All")
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const cards = Array.from(
      containerRef.current.querySelectorAll<HTMLDivElement>("[data-member-card]")
    )

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0")
            entry.target.classList.remove("opacity-0", "translate-y-4")
          }
        })
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    )

    cards.forEach((card) => observer.observe(card))

    return () => observer.disconnect()
  }, [members])

  const normalizedQuery = searchQuery.trim().toLowerCase()

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const fieldsToSearch = [
        member.name,
        member.title ?? "",
        member.company ?? "",
        (member.skillTags ?? []).join(" "),
      ]

      const matchesQuery =
        !normalizedQuery ||
        fieldsToSearch.some((value) => value.toLowerCase().includes(normalizedQuery))

      if (!matchesQuery) return false

      if (skillFilter === "All") return true

      const tags = (member.skillTags ?? []).map((tag) => tag.toLowerCase())
      return tags.includes(skillFilter.toLowerCase())
    })
  }, [members, normalizedQuery, skillFilter])

  const handleResetFilters = () => {
    setSearchQuery("")
    setSkillFilter("All")
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 opacity-80">
          <FlickeringGrid color="#9945FF" maxOpacity={0.22} className="rounded-[3rem]" />
        </div>
        <div className="absolute inset-10 opacity-60">
          <FlickeringGrid color="#14F195" maxOpacity={0.18} className="rounded-[3rem]" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/70 to-slate-950" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-30 sm:px-6 lg:px-8">
        <header className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex flex-1 flex-col items-center sm:items-start">
            <h1 className="text-center font-heading text-3xl font-bold tracking-tight text-slate-50 sm:text-left sm:text-4xl">
              Superteam Member
            </h1>
            <p className="mt-2 max-w-xl text-center text-sm text-slate-300 sm:text-left">
              Discover builders, designers, and contributors across the Superteam community.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <label className="flex-1">
              <span className="sr-only">Search members</span>
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by name, role, company, or skill"
                className="w-full rounded-full border border-white/15 bg-slate-900/80 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 shadow-[0_0_0_rgba(0,0,0,0.45)] outline-none transition focus:border-[#9945FF] focus:ring-2 focus:ring-[#9945FF]/60"
              />
            </label>

            <div className="flex items-center justify-end gap-2 sm:justify-start">
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-200">
                <span className="hidden text-xs text-slate-300 sm:inline">Skill</span>
                <select
                  value={skillFilter}
                  onChange={(event) => setSkillFilter(event.target.value as SkillFilter)}
                  className="bg-slate-900/80 text-xs text-slate-100 outline-none"
                >
                  <option value="All" style={{ backgroundColor: "#020617", color: "#ffffff" }}>
                    All
                  </option>
                  {SKILL_FILTERS.map((filter) => (
                    <option
                      key={filter}
                      value={filter}
                      style={{ backgroundColor: "#020617", color: "#ffffff" }}
                    >
                      {filter}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleResetFilters}
                className="rounded-full border border-white/10 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-100 transition hover:border-[#14F195]/80 hover:text-[#14F195]"
              >
                Reset
              </button>
            </div>
          </div>
        </header>

        <div className="flex flex-wrap gap-2">
          {SKILL_FILTERS.map((filter) => {
            const isActive = skillFilter === filter
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setSkillFilter(isActive ? "All" as SkillFilter : filter)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  isActive
                    ? "border-[#14F195]/80 bg-slate-900/90 text-[#14F195]"
                    : "border-white/15 bg-slate-900/70 text-slate-100 hover:border-[#9945FF]/70 hover:text-[#9945FF]"
                )}
              >
                {filter}
              </button>
            )
          })}
        </div>

        <div
          ref={containerRef}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              data-member-card
              className="opacity-0 translate-y-4 transform transition-all duration-500 ease-out"
            >
              <MemberCard member={member} />
            </div>
          ))}

          {!filteredMembers.length && (
            <p className="col-span-full mt-8 text-center text-sm text-slate-300">
              No members match your search. Try adjusting the filters.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

