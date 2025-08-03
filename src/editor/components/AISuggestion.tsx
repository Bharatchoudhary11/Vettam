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
      setSuggestion('')
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
        `<span class="bg-red-200 line-through">${original}</span><span class="bg-green-200">${suggestion}</span>`,
      )
      .run()
    setSuggestion('')
  }

  if (!selectionActive) return null

  return (
    <div className="space-x-2">
      <button
        className="px-2 py-1 bg-purple-500 text-white rounded"
        onClick={requestSuggestion}
      >
        AI Suggest
      </button>
      {suggestion && (
        <span>
          <span className="mr-2">{suggestion}</span>
          <button
            className="px-1 py-0.5 bg-green-500 text-white rounded"
            onClick={acceptSuggestion}
          >
            Accept
          </button>
          <button
            className="px-1 py-0.5 bg-gray-300 ml-1 rounded"
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
