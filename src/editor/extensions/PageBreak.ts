import { Node } from '@tiptap/core'

/**
 * PageBreak is a simple block level atom that represents a manual page break.
 * It renders a div with a data attribute that can be detected by the pagination engine
 * and styled via CSS.
 */
export const PageBreak = Node.create({
  name: 'pageBreak',
  group: 'block',
  atom: true,
  selectable: true,
  addCommands() {
    return {
      setPageBreak:
        () =>
        ({ commands }) => {
          return commands.insertContent({ type: this.name })
        },
    }
  },
  parseHTML() {
    return [
      {
        tag: 'div[data-type="page-break"]',
      },
    ]
  },
  renderHTML() {
    return ['div', { 'data-type': 'page-break', class: 'page-break' }]
  },
})

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    pageBreak: {
      setPageBreak: () => ReturnType
    }
  }
}

export default PageBreak
