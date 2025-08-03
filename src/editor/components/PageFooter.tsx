import type { FC } from 'react'
import { Minus } from 'lucide-react'

interface PageFooterProps {
  pageNumber: number
  totalPages?: number
}

/** Styled footer showing current page number */
export const PageFooter: FC<PageFooterProps> = ({ pageNumber, totalPages }) => {
  return (
    <footer className="page-footer w-full flex justify-center items-center py-2 border-t border-gray-300 text-sm text-gray-600 bg-gray-50 shadow-inner">
      <span className="flex items-center gap-1">
        <Minus className="text-gray-400 w-4 h-4" />
        Page {pageNumber}
        {totalPages && ` of ${totalPages}`}
        <Minus className="text-gray-400 w-4 h-4" />
      </span>
    </footer>
  )
}

export default PageFooter
