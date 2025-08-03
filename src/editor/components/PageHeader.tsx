import type { FC } from 'react'

interface PageHeaderProps {
  title?: string
}

/** Basic page header shown at the top of each page */
export const PageHeader: FC<PageHeaderProps> = ({ title }) => {
  return <header className="page-header">{title || ''}</header>
}

export default PageHeader
