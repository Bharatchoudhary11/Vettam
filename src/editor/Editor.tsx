import { useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import PageBreak from './extensions/PageBreak'
import { usePagination } from './usePagination'
import { PageHeader } from './components/PageHeader'
import { PageFooter } from './components/PageFooter'
import { OutlinePanel } from './components/OutlinePanel'
import { TemplateSidebar } from './components/TemplateSidebar'
import { RagSearchPanel } from './components/RagSearchPanel'
import { AISuggestion } from './components/AISuggestion'
import { exportPdf } from './exportPdf'

export const Editor = () => {
  const editor = useEditor({
    extensions: [StarterKit, PageBreak],
    content: '<p></p>',
  })

  const pages = usePagination(editor)
  const previewRef = useRef<HTMLDivElement>(null)

  const handleExport = async () => {
    const nodes = Array.from(
      previewRef.current?.querySelectorAll('.page') || [],
    ) as HTMLElement[]
    await exportPdf(nodes)
  }

  const handleSummarize = async () => {
    const doc = editor?.getText() || ''
    const res = await fetch('/api/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ doc }),
    })
    const data = await res.json()
    alert(data.summary)
  }

  const handleConsistency = async () => {
    const doc = editor?.getText() || ''
    const res = await fetch('/api/check-consistency', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ doc }),
    })
    const data = await res.json()
    alert(data.issues?.length ? data.issues.join('\n') : 'No issues found')
  }

  const handleFindClause = async () => {
    const clause = prompt('Enter clause text to find') || ''
    const doc = editor?.getText() || ''
    if (!clause) return
    const res = await fetch('/api/find-clause', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ doc, clause }),
    })
    const data = await res.json()
    alert(data.exists ? `Found: ${data.snippet}` : 'Clause not found')
  }

  return (
    <div className="flex h-screen">
      <OutlinePanel editor={editor} />
      <div className="flex-1 space-y-4 p-4 overflow-y-auto">
        <div className="flex gap-2 flex-wrap">
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
          <button
            className="px-2 py-1 bg-green-600 text-white rounded"
            onClick={handleSummarize}
          >
            Summarize Doc
          </button>
          <button
            className="px-2 py-1 bg-yellow-500 text-white rounded"
            onClick={handleConsistency}
          >
            Check Consistency
          </button>
          <button
            className="px-2 py-1 bg-purple-600 text-white rounded"
            onClick={handleFindClause}
          >
            Find Clause
          </button>
        </div>
        <AISuggestion editor={editor} />
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
      <TemplateSidebar editor={editor} />
      <RagSearchPanel />
    </div>
  )
}

export default Editor
