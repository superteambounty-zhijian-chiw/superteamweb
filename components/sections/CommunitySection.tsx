import React from 'react'

import { Marquee } from '@/components/ui/marquee'
import { TweetCard } from '@/components/ui/tweet-card'
import { DotPattern } from '@/components/ui/dot-pattern'
import { sanityClient } from '@/lib/sanity'
import { testimonialsQuery } from '@/lib/sanity.queries'

interface TestimonialRecord {
    _id: string
    tweetId?: string | null
    tweetUrl?: string | null
}


/**
 * Extracts a numeric tweet ID from a value (handles raw IDs and full tweet URLs).
 */
function extractTweetId(value: string | null | undefined): string | null {
    const trimmed = value?.trim()
    if (!trimmed) return null
    const numericMatch = trimmed.match(/^\d+$/)
    if (numericMatch) return numericMatch[0]
    const urlMatch = trimmed.match(/(?:twitter\.com|x\.com)\/[^/]+\/status\/(\d+)/i)
    return urlMatch ? urlMatch[1] : null
}

/**
 * Splits tweet IDs into N columns using round-robin distribution.
 */
function splitTweetIdsIntoColumns(tweetIds: string[], columnCount: number): string[][] {
    const columns: string[][] = Array.from({ length: columnCount }, () => [])
    tweetIds.forEach((id, index) => columns[index % columnCount].push(id))
    return columns
}

/**
 * CommunitySection displays community testimonials as a vertical marquee of tweet cards.
 * Tweet IDs are sourced from Sanity and each tweet is rendered using the shared TweetCard component.
 */
export const CommunitySection = async () => {
    const testimonials = await sanityClient.fetch<TestimonialRecord[]>(
        testimonialsQuery,
        {},
        { next: { revalidate: 30 } },
    )
    const validTweetIds = testimonials
        .map((item) => extractTweetId(item.tweetId) ?? extractTweetId(item.tweetUrl))
        .filter((id): id is string => Boolean(id))

    if (!validTweetIds.length) {
        return null
    }

    const columns2 = splitTweetIdsIntoColumns(validTweetIds, 2)
    const columns3 = splitTweetIdsIntoColumns(validTweetIds, 3)
    const columns4 = splitTweetIdsIntoColumns(validTweetIds, 4)

    return (
        <section className="relative mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-8 overflow-hidden px-4 py-16 md:px-8">
            <DotPattern
                width={24}
                height={24}
                cx={1}
                cy={1}
                cr={1}
                glow
                className="z-0 text-accent/35 opacity-80"
            />
            <div className="relative z-10 flex w-full flex-col items-center justify-center gap-8">
                <header className="flex flex-col items-center gap-2 text-center">
                    <p className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
                        Community
                    </p>
                    <h2 className="text-balance text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                        What builders are saying
                    </h2>
                    <p className="max-w-xl text-pretty text-sm text-muted-foreground md:text-base">
                        Real tweets from the Superteam Malaysia community, streamed live from our testimonials
                        collection.
                    </p>
                </header>

                {/* Mobile: 2 columns */}
                <div className="grid w-full grid-cols-2 gap-4 md:hidden">
                    {columns2.map((tweetIds, columnIndex) => (
                        <div key={columnIndex} className="relative flex justify-center overflow-hidden">
                            <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-10 bg-gradient-to-b from-background via-transparent to-background" />
                            <Marquee
                                className="relative h-[600px] w-full max-w-[280px] md:h-[1600px]"
                                vertical
                                pauseOnHover
                                repeat={3}
                                reverse={columnIndex % 2 === 1}
                            >
                                <div className="flex flex-col gap-4 py-4">
                                    {tweetIds.map((tweetId) => (
                                        <TweetCard
                                            key={tweetId}
                                            id={tweetId}
                                            className="max-w-[280px] w-full"
                                        />
                                    ))}
                                </div>
                            </Marquee>
                        </div>
                    ))}
                </div>

                {/* <1000px: 3 columns */}
                <div className="hidden w-full grid-cols-3 gap-4 md:grid [@media(min-width:1000px)]:hidden">
                    {columns3.map((tweetIds, columnIndex) => (
                        <div key={columnIndex} className="relative flex justify-center overflow-hidden">
                            <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-10 bg-gradient-to-b from-background via-transparent to-background" />
                            <Marquee
                                className="relative h-[600px] w-full max-w-[280px] md:h-[1600px]"
                                vertical
                                pauseOnHover
                                repeat={3}
                                reverse={columnIndex % 2 === 1}
                            >
                                <div className="flex flex-col gap-4 py-4">
                                    {tweetIds.map((tweetId) => (
                                        <TweetCard
                                            key={tweetId}
                                            id={tweetId}
                                            className="max-w-[280px] w-full"
                                        />
                                    ))}
                                </div>
                            </Marquee>
                        </div>
                    ))}
                </div>

                {/* >=1000px: 4 columns */}
                <div className="hidden w-full grid-cols-4 gap-4 [@media(min-width:1000px)]:grid">
                    {columns4.map((tweetIds, columnIndex) => (
                        <div key={columnIndex} className="relative flex justify-center overflow-hidden">
                            <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-10 bg-gradient-to-b from-background via-transparent to-background" />
                            <Marquee
                                className="relative h-[600px] w-full max-w-[280px] md:h-[1600px]"
                                vertical
                                pauseOnHover
                                repeat={3}
                                reverse={columnIndex % 2 === 1}
                            >
                                <div className="flex flex-col gap-4 py-4">
                                    {tweetIds.map((tweetId) => (
                                        <TweetCard
                                            key={tweetId}
                                            id={tweetId}
                                            className="max-w-[280px] w-full"
                                        />
                                    ))}
                                </div>
                            </Marquee>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}