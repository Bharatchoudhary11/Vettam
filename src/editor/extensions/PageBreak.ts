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

export default Node.create<PageBreakOptions>({
  name: 'pageBreak',

  group: 'block',
  
  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addCommands() {
    return {
      setPageBreak:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            marks: [],
          })
        },
    }
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, unknown> }) {
    return ['div', { 
      class: 'page-break',
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
