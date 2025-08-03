import { Editor } from '@tiptap/react'
import { useState } from 'react'
import { FileText } from 'lucide-react'

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
    <div className="w-72 border-l border-gray-200 p-3 space-y-3 overflow-y-auto bg-gray-50 shadow-inner">
      <h2 className="text-base font-semibold text-gray-700 flex items-center gap-2">
        📑 Templates
      </h2>

      {templates.map((t) => {
        const isActive = active === t.name

        return (
          <button
            key={t.name}
            className={`w-full flex items-center gap-2 text-left px-3 py-2 rounded-md border text-sm font-medium transition-all duration-200 shadow-sm
              ${isActive 
                ? 'bg-purple-100 border-purple-400 text-purple-700' 
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-purple-300'
              }`}
            onClick={() => {
              editor?.commands.insertContent(t.content)
              setActive(t.name)
            }}
          >
            <FileText size={16} className="text-gray-500" />
            {t.name}
          </button>
        )
      })}
    </div>
  )
}

export default TemplateSidebar
