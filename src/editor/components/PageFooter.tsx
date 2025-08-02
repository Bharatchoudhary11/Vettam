import type { FC } from 'react'

interface PageFooterProps {
  pageNumber: number
}

/** Basic footer that displays the current page number */
export const PageFooter: FC<PageFooterProps> = ({ pageNumber }) => {
  return (
    <footer className="page-footer text-center py-2 border-t border-gray-300 text-sm text-gray-600">
      Page {pageNumber}
    </footer>
  )
}

export default PageFooter
