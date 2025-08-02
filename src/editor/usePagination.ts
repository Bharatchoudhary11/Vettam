import { useEffect, useState } from 'react'

/**
 * Very small pagination helper that splits raw HTML by the page break node.
 * A more sophisticated implementation could additionally measure content height
 * and insert automatic breaks based on page size.
 */
export function usePagination(html: string) {
  const [pages, setPages] = useState<string[]>([])

  useEffect(() => {
    const parts = html.split(/<div data-type="page-break"[^>]*><\/div>/g)
    setPages(parts)
  }, [html])

  return pages
}

export default usePagination
