import Link from "next/link"

import { MembersDirectory } from "@/components/members/members-directory"
import { getMembersFromSanity } from "@/lib/sanity-data"

/** Members directory page: fetch data from Sanity and render interactive directory UI. */
export default async function MembersPage() {
  const members = await getMembersFromSanity()

  if (!members.length) {
    return (
      <main className="min-h-screen bg-slate-950">
        <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-40 sm:px-6 sm:py-40">
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
    <main className="min-h-screen bg-slate-950">
      <MembersDirectory members={members} />
      <div className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
        <Link
          href="/"
          className="mt-6 inline-flex items-center text-sm font-medium text-[#14F195] hover:underline"
        >
          ← Back to home
        </Link>
      </div>
    </main>
  )
}
