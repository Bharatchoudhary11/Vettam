import { Editor } from '@tiptap/react'
import { useEffect, useState } from 'react'

export const AISuggestion = ({ editor }: { editor: Editor | null }) => {
  const [selectionActive, setSelectionActive] = useState(false)
  const [suggestion, setSuggestion] = useState('')

  useEffect(() => {
    if (!editor) return
    const update = () => {
      const { from, to } = editor.state.selection
      setSelectionActive(from !== to)
    }
    editor.on('selectionUpdate', update)
    return () => {
      editor.off('selectionUpdate', update)
    }
  }, [editor])

  const requestSuggestion = async () => {
    if (!editor) return
    const { from, to } = editor.state.selection
    const text = editor.state.doc.textBetween(from, to)
    try {
      const res = await fetch('/api/suggest-rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      if (!res.ok) {
        console.error('Failed to fetch suggestion', res.status)
        return
      }
      const data = await res.json()
      setSuggestion(data.suggestion)
    } catch (err) {
      console.error('Suggestion request failed', err)
    }
  }

  const acceptSuggestion = () => {
    if (!editor) return
    const { from, to } = editor.state.selection
    const original = editor.state.doc.textBetween(from, to)
    editor
      .chain()
      .focus()
      .insertContentAt(
        { from, to },
        `<span style="background:#fecaca;text-decoration:line-through;">${original}</span><span style="background:#bbf7d0;">${suggestion}</span>`,
      )
      .run()
    setSuggestion('')
  }

  if (!selectionActive) return null

  return (
    <div className="suggestion-actions">
      <button className="btn btn-purple" onClick={requestSuggestion}>
        AI Suggest
      </button>
      {suggestion && (
        <span className="suggestion-result">
          <span className="suggestion-text">{suggestion}</span>
          <button className="btn btn-success btn-small" onClick={acceptSuggestion}>
            Accept
          </button>
          <button
            className="btn btn-gray btn-small"
            onClick={() => setSuggestion('')}
          >
            Reject
          </button>
        </span>
      )}
    </div>
  )
}

export default AISuggestion
