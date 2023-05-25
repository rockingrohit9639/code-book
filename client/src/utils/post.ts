import html2canvas from 'html2canvas'

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
