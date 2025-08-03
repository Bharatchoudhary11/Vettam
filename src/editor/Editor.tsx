import { useRef, useState } from 'react'
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

// First, let's declare the page break command type
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    pageBreak: {
      setPageBreak: () => ReturnType;
    }
  }
}

interface APIResponse {
  summary?: string;
  issues?: string[];
  exists?: boolean;
  snippet?: string;
}

export const Editor = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Update the extensions array to properly register PageBreak
  const editor = useEditor({
    extensions: [
      StarterKit,
      PageBreak.configure({
        HTMLAttributes: {
          class: 'page-break',
        },
      }),
    ],
    content: '<p></p>',
  })

  const pages = usePagination(editor?.getHTML() || '')
  const previewRef = useRef<HTMLDivElement>(null)

  const handleApiRequest = async (
    endpoint: string, 
    data: Record<string, string>
  ): Promise<APIResponse> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error(`API error: ${res.statusText}`);
      return await res.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    const nodes = Array.from(
      previewRef.current?.querySelectorAll('.page') || [],
    ) as HTMLElement[]
    await exportPdf(nodes)
  }

  const handleSummarize = async () => {
    try {
      const data = await handleApiRequest('summarize', { 
        doc: editor?.getText() || '' 
      });
      if (data.summary) alert(data.summary);
    } catch (err) {
      console.error('Summarization failed:', err);
    }
  }

  const handleConsistency = async () => {
    try {
      const data = await handleApiRequest('check-consistency', { 
        doc: editor?.getText() || '' 
      });
      alert(data.issues?.length ? data.issues.join('\n') : 'No issues found');
    } catch (err) {
      console.error('Consistency check failed:', err);
    }
  }

  const handleFindClause = async () => {
    const clause = prompt('Enter clause text to find');
    if (!clause) return;
    
    try {
      const data = await handleApiRequest('find-clause', { 
        doc: editor?.getText() || '',
        clause 
      });
      alert(data.exists ? `Found: ${data.snippet}` : 'Clause not found');
    } catch (err) {
      console.error('Find clause failed:', err);
    }
  }

  return (
    <div className="editor-layout">
      <OutlinePanel editor={editor} />
      <div className="editor-main">
        <div className="toolbar">
          <button
            className="btn btn-gray"
            onClick={() => editor?.chain().focus().setPageBreak().run()}
            disabled={!editor?.isEditable}
          >
            Page Break
          </button>
          <button
            className="btn btn-primary"
            onClick={handleExport}
            disabled={isLoading}
          >
            {isLoading ? 'Exporting...' : 'Export PDF'}
          </button>
          <button
            className="btn btn-success"
            onClick={handleSummarize}
            disabled={isLoading}
          >
            {isLoading ? 'Summarizing...' : 'Summarize Doc'}
          </button>
          <button
            className="btn btn-warning"
            onClick={handleConsistency}
            disabled={isLoading}
          >
            {isLoading ? 'Checking...' : 'Check Consistency'}
          </button>
          <button
            className="btn btn-purple"
            onClick={handleFindClause}
            disabled={isLoading}
          >
            {isLoading ? 'Searching...' : 'Find Clause'}
          </button>
        </div>
        {error && <div className="error-box">{error}</div>}
        <AISuggestion editor={editor} />
        <EditorContent editor={editor} className="editor-content" />
        <div ref={previewRef} className="preview">
          {pages.map((html, i) => (
            <div key={i} className="page">
              <PageHeader title="Document" />
              <div
                className="page-body"
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
