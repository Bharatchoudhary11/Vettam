import { Node } from '@tiptap/core'

export interface PageBreakOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    pageBreak: {
      setPageBreak: () => ReturnType;
    }
  }
}

const PageBreak = Node.create<PageBreakOptions>({
  name: 'pageBreak',
  group: 'block',
  atom: true,
  selectable: true,

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'page-break',
        role: 'separator',
        'aria-label': 'Page Break'
      },
    }
  },

  addCommands() {
    return {
      setPageBreak:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
          })
        },
    }
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, unknown> }) {
    return ['div', { 
      ...this.options.HTMLAttributes,
      ...HTMLAttributes 
    }]
  },

  parseHTML() {
    return [
      {
        tag: 'div.page-break',
      },
    ]
  },
})

export default PageBreak
