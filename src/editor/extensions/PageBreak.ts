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
        ({ commands }: any) =>
          commands.insertContent({ type: this.name }),
    } as any
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

export default PageBreak
