import { createClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2025-01-01'

if (!projectId) {
  console.warn('NEXT_PUBLIC_SANITY_PROJECT_ID is not set; Sanity client will not work.')
}

/**
 * Public Sanity client for reading published content.
 * Use in Server Components with Next.js cache options.
 */
export const sanityClient = createClient({
  projectId: projectId ?? '',
  dataset,
  apiVersion,
  useCdn: true,
})

/**
 * Optional: client with read token for draft/preview in Server Components.
 * Set SANITY_API_READ_TOKEN in env for preview mode.
 */
export function createPreviewClient(token: string) {
  return createClient({
    projectId: projectId ?? '',
    dataset,
    apiVersion,
    useCdn: false,
    token,
  })
}
