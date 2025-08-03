import type { FC } from 'react'
import { Minus } from 'lucide-react'

interface PageFooterProps {
  pageNumber: number
  totalPages?: number
}

/** Styled footer showing current page number */
export const PageFooter: FC<PageFooterProps> = ({ pageNumber, totalPages }) => {
  return (
    <footer className="page-footer">
      <span className="footer-content">
        <Minus className="footer-icon" />
        Page {pageNumber}
        {totalPages && ` of ${totalPages}`}
        <Minus className="footer-icon" />
      </span>
    </footer>
  )
}

export default PageFooter
