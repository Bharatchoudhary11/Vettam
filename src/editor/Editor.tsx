import { useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import PageBreak from './extensions/PageBreak'
import { usePagination } from './usePagination'
import { PageHeader } from './components/PageHeader'
import { PageFooter } from './components/PageFooter'
import { exportPdf } from './exportPdf'

export const Editor = () => {
  const editor = useEditor({
    extensions: [StarterKit, PageBreak],
    content: '<p></p>',
  })

  const pages = usePagination(editor?.getHTML() || '')
  const previewRef = useRef<HTMLDivElement>(null)

  const handleExport = async () => {
    const nodes = Array.from(
      previewRef.current?.querySelectorAll('.page') || [],
    ) as HTMLElement[]
    await exportPdf(nodes)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          className="px-2 py-1 bg-gray-200 rounded"
          onClick={() => editor?.chain().focus().setPageBreak().run()}
        >
          Page Break
        </button>
        <button
          className="px-2 py-1 bg-blue-500 text-white rounded"
          onClick={handleExport}
        >
          Export PDF
        </button>
      </div>
      <EditorContent
        editor={editor}
        className="border min-h-[300px] p-4"
      />
      <div ref={previewRef} className="preview">
        {pages.map((html, i) => (
          <div
            key={i}
            className="page w-[794px] h-[1122px] mx-auto mb-4 bg-white shadow flex flex-col"
          >
            <PageHeader title="Document" />
            <div
              className="flex-1 p-8 prose"
              dangerouslySetInnerHTML={{ __html: html }}
            />
            <PageFooter pageNumber={i + 1} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Editor
