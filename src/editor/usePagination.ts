import { useEffect, useState } from 'react'
import type { Editor } from '@tiptap/react'

/**
 * Estimate HTML content height by rendering to a hidden temporary element
 */
function estimateHtmlHeight(html: string): number {
  const tempDiv = document.createElement('div')
  tempDiv.style.position = 'absolute'
  tempDiv.style.visibility = 'hidden'
  tempDiv.style.width = '794px' // Approx A4 width
  tempDiv.innerHTML = html
  document.body.appendChild(tempDiv)
  const height = tempDiv.offsetHeight
  document.body.removeChild(tempDiv)
  return height
}

/**
 * Automatically paginate content if it exceeds maxHeight.
 * This is a basic approximation (splits by paragraph/block-level nodes).
 */
function calculateAutomaticPages(htmlParts: string[], maxHeight = 1050): string[] {
  const result: string[] = []
  let currentPage = ''
  let currentHeight = 0

  htmlParts.forEach((block) => {
    const blockHeight = estimateHtmlHeight(block)

    // If adding this block exceeds the page height, push current page
    if (currentHeight + blockHeight > maxHeight && currentPage.trim()) {
      result.push(currentPage)
      currentPage = block
      currentHeight = blockHeight
    } else {
      currentPage += block
      currentHeight += blockHeight
    }
  })

  if (currentPage.trim()) result.push(currentPage)
  return result
}

/**
 * Paginate editor content by:
 * 1️⃣ Splitting on explicit PageBreak nodes
 * 2️⃣ Measuring content height to insert automatic breaks (Google Docs–like behavior)
 */
export function usePagination(editor: Editor | null) {
  const [pages, setPages] = useState<string[]>([])

  useEffect(() => {
    if (!editor) return

    const updatePages = () => {
      // Get the full editor content
      const html = editor.getHTML()

      // Split on explicit manual page breaks first
        const parts = html.split(/<div[^>]*data-type="page-break"[^>]*><\/div>/gi)

      // Apply automatic pagination on top of manual splits
      let autoPages: string[] = []
      parts.forEach((part) => {
        const splitPages = calculateAutomaticPages(part.split(/(<p[^>]*>.*?<\/p>)/gis), 1050)
        autoPages = [...autoPages, ...splitPages]
      })

      setPages(autoPages)
    }

    editor.on('update', updatePages)
    updatePages()

    return () => {
      editor.off('update', updatePages)
    }
  }, [editor])

  return pages
}

export default usePagination
