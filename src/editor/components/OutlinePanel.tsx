import { Editor } from '@tiptap/react'
import { useEffect, useState } from 'react'
import { Slice } from '@tiptap/pm/model'

interface OutlineItem {
  id: string
  level: number
  text: string
  pos: number
}

export const OutlinePanel = ({ editor }: { editor: Editor | null }) => {
  const [items, setItems] = useState<OutlineItem[]>([])
  const [collapsed, setCollapsed] = useState<Set<number>>(new Set())

  useEffect(() => {
    if (!editor) return

    const generate = () => {
      const headings: OutlineItem[] = []
      editor.state.doc.descendants((node, pos) => {
        if (node.type.name === 'heading' && [1, 2, 3].includes(node.attrs.level)) {
          const id = `heading-${pos}`
          const dom = editor.view.nodeDOM(pos) as HTMLElement | null
          if (dom) dom.id = id
          headings.push({
            id,
            level: node.attrs.level,
            text: node.textContent,
            pos,
          })
        }
      })
      setItems(headings)
    }

    generate()
    editor.on('update', generate)
    return () => {
      editor.off('update', generate)
    }
  }, [editor])

  const navigate = (id: string) => {
    const el = document.getElementById(id)
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const toggleCollapse = (pos: number) => {
    if (!editor) return
    const dom = editor.view.nodeDOM(pos) as HTMLElement | null
    if (!dom) return
    const newSet = new Set(collapsed)
    let sib = dom.nextElementSibling as HTMLElement | null
    while (sib && !/^H[1-3]$/.test(sib.tagName)) {
      sib.classList.toggle('hidden')
      sib = sib.nextElementSibling as HTMLElement | null
    }
    if (newSet.has(pos)) newSet.delete(pos)
    else newSet.add(pos)
    setCollapsed(newSet)
  }

  const moveUp = (index: number) => {
    if (!editor || index === 0) return
    const { state, view } = editor
    const pos0 = items[index - 1].pos
    const pos1 = items[index].pos
    const pos2 = items[index + 1]?.pos ?? state.doc.content.size
    const prev = state.doc.slice(pos0, pos1)
    const current = state.doc.slice(pos1, pos2)
    const slice = new Slice(current.content.append(prev.content), 0, 0)
    const tr = state.tr.replaceRange(pos0, pos2, slice)
    view.dispatch(tr)
  }

  const moveDown = (index: number) => {
    if (!editor || index === items.length - 1) return
    const { state, view } = editor
    const pos1 = items[index].pos
    const pos2 = items[index + 1].pos
    const pos3 = items[index + 2]?.pos ?? state.doc.content.size
    const current = state.doc.slice(pos1, pos2)
    const next = state.doc.slice(pos2, pos3)
    const slice = new Slice(next.content.append(current.content), 0, 0)
    const tr = state.tr.replaceRange(pos1, pos3, slice)
    view.dispatch(tr)
  }

  return (
    <div className="outline-panel">
      {items.map((item, i) => (
        <div key={item.id} className="outline-item">
          <button
            onClick={() => navigate(item.id)}
            className="outline-text"
            style={{ paddingLeft: (item.level - 1) * 8 }}
          >
            {item.text || 'Untitled'}
          </button>
          <button onClick={() => toggleCollapse(item.pos)} className="icon-button">
            {collapsed.has(item.pos) ? '+' : '-'}
          </button>
          <button disabled={i === 0} onClick={() => moveUp(i)} className="icon-button">
            ↑
          </button>
          <button
            disabled={i === items.length - 1}
            onClick={() => moveDown(i)}
            className="icon-button"
          >
            ↓
          </button>
        </div>
      ))}
    </div>
  )
}

export default OutlinePanel
