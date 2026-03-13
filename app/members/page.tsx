import Link from "next/link"

import { MembersDirectory } from "@/components/members/members-directory"
import { getMembers } from "@/lib/supabase-data"
import { DotPattern } from "@/components/ui/dot-pattern"
import { cn } from "@/lib/utils"

/** Members directory page: fetch data from Supabase and render interactive directory UI. */
export default async function MembersPage() {
  const members = await getMembers()

  if (!members.length) {
    return (
      <main className="relative min-h-screen bg-slate-950 overflow-hidden">
        <DotPattern
          width={32}
          height={32}
          cr={1}
          className={cn(
            "mask-[radial-gradient(600px_circle_at_center,white,transparent)]",
            "opacity-30 text-white/40"
          )}
        />
        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-4 py-40 sm:px-6 sm:py-40">
          <h1 className="font-heading text-3xl font-bold text-slate-50">Superteam Member</h1>
          <p className="mt-3 text-center text-sm text-slate-300">
            No members yet. Add members via Sanity Studio to populate the directory.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center text-sm font-medium text-[#14F195] hover:underline"
          >
            ← Back to home
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="relative min-h-screen bg-slate-950 overflow-hidden">
      <DotPattern
        width={32}
        height={32}
        cr={1}
        className={cn(
          "mask-[radial-gradient(1000px_circle_at_center,white,transparent)]",
          "opacity-30 text-white/40"
        )}
      />
      <div className="relative z-10">
        <MembersDirectory members={members} />
        <div className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
          <Link
            href="/"
            className="mt-6 inline-flex items-center text-sm font-medium text-[#14F195] hover:underline"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  )
}
