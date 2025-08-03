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
    const nodes = Array.from(previewRef.current?.querySelectorAll('.page') || []) as HTMLElement[]
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
    if (!clause) return
    const doc = editor?.getText() || ''
    const res = await fetch('/api/find-clause', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ doc, clause }),
    })
    const data = await res.json()
    alert(data.exists ? `Found: ${data.snippet}` : 'Clause not found')
  }

  return (
    <div className="editor-container">
      {/* ===== Left Sidebar ===== */}
      <div className="sidebar">
        <div className="outline-section">
          <h3 className="sidebar-title">Outline</h3>
          <OutlinePanel editor={editor} />
        </div>
        <div className="template-section">
          <h3 className="sidebar-title">Templates</h3>
          <TemplateSidebar editor={editor} />
        </div>
        <div className="search-section">
          <h3 className="sidebar-title">Legal Search</h3>
          <RagSearchPanel />
        </div>
      </div>

      {/* ===== Main Editor Area ===== */}
      <div className="editor-main">
        <div className="toolbar">
          <button onClick={() => editor?.chain().focus().setPageBreak().run()}>Page Break</button>
          <button className="primary" onClick={handleExport}>Export PDF</button>
          <button className="success" onClick={handleSummarize}>Summarize Doc</button>
          <button className="primary" onClick={handleConsistency}>Check Consistency</button>
          <button onClick={handleFindClause}>Find Clause</button>
          <AISuggestion editor={editor} />
        </div>

        <EditorContent editor={editor} className="editor-box" />

        <div ref={previewRef} className="preview">
          {pages.map((html, i) => (
            <div key={i} className="page">
              <PageHeader title="Document" />
              <div className="page-content" dangerouslySetInnerHTML={{ __html: html }} />
              <PageFooter pageNumber={i + 1} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Editor
