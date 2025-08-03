import { useEffect, useState } from 'react'
import type { Editor } from '@tiptap/react'

/**
 * Paginate editor content by splitting the editor's HTML on page break nodes.
 * The hook listens to editor updates so pagination stays in sync as the user edits.
 * A more sophisticated implementation could additionally measure content height
 * and insert automatic breaks based on page size.
 */
export function usePagination(editor: Editor | null) {
  const [pages, setPages] = useState<string[]>([])

  useEffect(() => {
    if (!editor) return

    const updatePages = () => {
      const html = editor.getHTML()
      const parts = html.split(/<div data-type="page-break"[^>]*><\/div>/g)
      setPages(parts)
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
