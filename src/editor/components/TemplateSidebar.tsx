import { Editor } from '@tiptap/react'
import { useState } from 'react'

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

  return (
    <div className="w-60 border-l p-2 space-y-2 overflow-y-auto">
      {templates.map((t) => {
        const isActive = active === t.name

        return (
          <button
            key={t.name}
            className={`w-full text-left border p-2 rounded transition-colors ${
              isActive ? 'bg-gray-200' : 'bg-white hover:bg-gray-50'
            }`}
            onClick={() => {
              editor?.commands.insertContent(t.content)
              setActive(t.name)
            }}
          >
            {t.name}
          </button>
        )
      })}
    </div>
  )
}

export default TemplateSidebar
