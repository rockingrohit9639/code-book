import html2canvas from 'html2canvas'
import { uniqBy } from 'lodash'
import { Post } from '~/types/post'

export const componentToImage = async (html: HTMLElement | null): Promise<string | null> => {
  if (html) {
    /** Converting HTML to canvas */
    const canvas = await html2canvas(html)

    /** Getting base64 image data from canvas */
    const base64DataImageData = canvas.toDataURL('image/png')

    /** Returning base64 image data */
    return base64DataImageData
  }

  return null
}

export function getMergedPosts(posts: Post[], trendingPosts: Post[]): Promise<Post[]> {
  const mergedPosts = [...posts, ...trendingPosts]
  return Promise.resolve(uniqBy(mergedPosts, (post) => post.id))
}
