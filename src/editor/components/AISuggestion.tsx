import { Editor } from '@tiptap/react'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, Sparkles } from 'lucide-react'

// ---------------------
// ✅ Reusable Styled Button
// ---------------------
type ButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "success" | "danger";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
};

const buttonStyles: Record<string, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  success: 'btn-success',
  danger: 'btn-danger',
};

const sizeStyles: Record<string, string> = {
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
};

const StyledButton = ({ children, variant = 'primary', size = 'md', onClick }: ButtonProps) => {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.03 }}
      className={`btn ${buttonStyles[variant]} ${sizeStyles[size]}`.trim()}
      onClick={onClick}
    >
      {children}
    </motion.button>
  )
}

// ---------------------
// ✅ AI Suggestion Component
// ---------------------
export const AISuggestion = ({ editor }: { editor: Editor | null }) => {
  const [selectionActive, setSelectionActive] = useState(false)
  const [suggestion, setSuggestion] = useState('')
  const [loading, setLoading] = useState(false)

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
    setLoading(true)
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
    } finally {
      setLoading(false)
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
        `<span style="background-color:#fecaca;text-decoration:line-through;padding:0 2px;">${original}</span><span style="background-color:#bbf7d0;padding:0 2px;">${suggestion}</span>`,
      )
      .run()
    setSuggestion('')
  }

  if (!selectionActive) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 5 }}
      className="suggestion-container"
    >
      <StyledButton variant="primary" size="md" onClick={requestSuggestion}>
        <Sparkles size={16} />
        {loading ? 'Thinking...' : ' AI Suggest'}
      </StyledButton>

      <AnimatePresence>
        {suggestion && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="suggestion-box"
          >
            <span>{suggestion}</span>
            <StyledButton variant="success" size="sm" onClick={acceptSuggestion}>
              <Check size={14} /> Accept
            </StyledButton>
            <StyledButton variant="secondary" size="sm" onClick={() => setSuggestion('')}>
              <X size={14} /> Reject
            </StyledButton>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default AISuggestion
