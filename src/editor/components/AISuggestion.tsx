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
  primary: "bg-purple-600 text-white hover:bg-purple-700",
  secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
  success: "bg-green-500 text-white hover:bg-green-600",
  danger: "bg-red-500 text-white hover:bg-red-600",
};

const sizeStyles: Record<string, string> = {
  sm: "px-3 py-1 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

const StyledButton = ({
  children,
  variant = "primary",
  size = "md",
  onClick,
}: ButtonProps) => {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.03 }}
      className={`rounded-lg font-medium shadow-md transition-all duration-200 
        ${buttonStyles[variant]} ${sizeStyles[size]}`}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};

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
        `<span class="bg-red-200 line-through px-0.5">${original}</span><span class="bg-green-200 px-0.5">${suggestion}</span>`,
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
      className="flex items-center space-x-3 p-2 bg-white shadow-md rounded-lg border border-gray-200"
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
            className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-md border border-gray-300"
          >
            <span className="text-gray-800">{suggestion}</span>
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
