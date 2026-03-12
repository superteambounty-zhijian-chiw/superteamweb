import { createImageUrlBuilder, type ImageUrlBuilder, type SanityImageSource } from '@sanity/image-url'
import { sanityClient } from './sanity'

const imageBuilder = createImageUrlBuilder(sanityClient)

/**
 * Builds a URL for a Sanity image asset.
 * Chain .width(), .height(), .url() etc. Use with Next.js Image (remotePatterns for cdn.sanity.io).
 */
export function urlFor(source: SanityImageSource): ImageUrlBuilder {
  return imageBuilder.image(source)
}
