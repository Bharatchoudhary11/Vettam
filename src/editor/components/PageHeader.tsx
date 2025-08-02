import type { FC } from 'react'

interface PageHeaderProps {
  title?: string
}

/** Basic page header shown at the top of each page */
export const PageHeader: FC<PageHeaderProps> = ({ title }) => {
  return (
    <header className="page-header text-center py-2 border-b border-gray-300 text-sm text-gray-600">
      {title || ''}
    </header>
  )
}

export default PageHeader
