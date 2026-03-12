/**
 * GROQ queries for Superteam Malaysia.
 * Use with sanityClient.fetch() in Server Components; pass { next: { revalidate: 60 } } for ISR.
 */

/** Single stats document (singleton by convention — first doc of type "stats") */
export const statsQuery = `*[_type == "stats"][0]{
  _id,
  members,
  events,
  projects,
  bounties,
  reach
}`

/** Single landing page document (singleton by _id) */
export const landingPageQuery = `*[_type == "landingPage"][0]{
  _id,
  heroHeadline,
  heroSubheadline,
  heroPrimaryCtaLabel,
  heroPrimaryCtaLink,
  heroSecondaryCtaLabel,
  heroSecondaryCtaLink,
  missionPillars,
  stats,
  viewAllEventsUrl,
  footerLinks,
  socialLinks
}`

/** Single hero document (singleton by convention — first doc of type "hero") */
export const heroQuery = `*[_type == "hero"][0]{
  _id,
  heroHeadline,
  heroSubheadline,
  heroPrimaryCtaLabel,
  heroPrimaryCtaLink,
  heroSecondaryCtaLabel,
  heroSecondaryCtaLink,
  "heroBackgroundUrl": coalesce(heroBackground.video.asset->url, heroBackground.image.asset->url)
}`

/** All members, ordered by order then name */
export const membersQuery = `*[_type == "member"] | order(order asc, name asc){
  _id,
  name,
  slug,
  image,
  title,
  company,
  skillTags,
  twitterUrl,
  solanaAchievements,
  isFeatured,
  order
}`

/** Featured members for landing spotlight */
export const featuredMembersQuery = `*[_type == "member" && isFeatured == true] | order(order asc, name asc){
  _id,
  name,
  slug,
  image,
  title,
  company,
  skillTags,
  twitterUrl,
  isFeatured,
  order
}`

/** All partners, ordered */
export const partnersQuery = `*[_type == "partner"] | order(order asc){
  _id,
  name,
  logo,
  url,
  order
}`

/** All FAQ items, ordered. "order" quoted in projection (reserved word in GROQ). */
export const faqQuery = `*[_type == "faqItem"] | order(order asc){
  _id,
  question,
  answer,
  "order": order
}`

/** All testimonials (Wall of Love), ordered. Includes tweetUrl for legacy docs. */
export const testimonialsQuery = `*[_type == "testimonial"] | order(order asc){
  _id,
  tweetId,
  tweetUrl,
  order
}`

/** Upcoming events for EventSection (startAt >= now()), ordered by startAt asc */
export const upcomingEventsQuery = `*[_type == "event" && defined(startAt) && startAt >= now()] | order(startAt asc){
  _id,
  name,
  description,
  startAt,
  endAt,
  timezone,
  url,
  geoAddress,
  location,
  coverImage,
  order
}`

/** Highlighted past events for EventSection (startAt < now() && highlight == true), ordered by startAt desc */
export const pastEventsQuery = `*[_type == "event" && defined(startAt) && startAt < now() && highlight == true] | order(startAt desc){
  _id,
  name,
  description,
  startAt,
  endAt,
  timezone,
  url,
  geoAddress,
  location,
  coverImage,
  order
}`
