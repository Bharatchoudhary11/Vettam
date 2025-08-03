import type { FC } from 'react'

interface PageFooterProps {
  pageNumber: number
}

/** Basic footer that displays the current page number */
export const PageFooter: FC<PageFooterProps> = ({ pageNumber }) => {
  return <footer className="page-footer">Page {pageNumber}</footer>
}

export default PageFooter
