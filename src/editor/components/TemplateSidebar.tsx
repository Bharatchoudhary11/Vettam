import { Editor } from '@tiptap/react'
import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { Button } from '../../components/ui/button'

const templates = [
  {
    name: 'NDA Clause',
    content:
      '<h2>Confidentiality</h2><p>The parties agree to keep all confidential information secret and not disclose it to any third party without prior written consent.</p>',
  },
  {
    name: 'Termination',
    content:
      '<h2>Termination</h2><p>Either party may terminate this agreement with thirty (30) days written notice to the other party.</p>',
  },
  {
    name: 'Governing Law',
    content:
      '<h2>Governing Law</h2><p>This agreement shall be governed by and construed in accordance with the laws of the applicable jurisdiction.</p>',
  },
]

export const TemplateSidebar = ({ editor }: { editor: Editor | null }) => {
  const [active, setActive] = useState<string | null>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])

  const handleSelect = (t: { name: string; content: string }) => {
    editor?.commands.insertContent(t.content)
    setActive(t.name)
  }

  const MotionButton = motion(Button)

  return (
    <motion.aside
      initial={{ x: 80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-full sm:w-64 border-l bg-white p-4 space-y-2 overflow-y-auto"
      role="listbox"
      aria-label="Insert template"
    >
      {templates.map((t, i) => (
        <motion.div
          key={t.name}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <MotionButton
            ref={(el) => {
              itemRefs.current[i] = el
            }}
            role="option"
            aria-selected={active === t.name}
            variant={active === t.name ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect(t)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') itemRefs.current[i + 1]?.focus()
              if (e.key === 'ArrowUp') itemRefs.current[i - 1]?.focus()
            }}
          >
            {t.name}
          </MotionButton>
        </motion.div>
      ))}
    </motion.aside>
  )
}

export default TemplateSidebar
