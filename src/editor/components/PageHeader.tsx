import type { FC } from 'react'
import { FileText } from 'lucide-react'

interface PageHeaderProps {
  title?: string
  subtitle?: string
  logoUrl?: string
}

/** Styled page header with optional logo and subtitle */
export const PageHeader: FC<PageHeaderProps> = ({ title, subtitle, logoUrl }) => {
  return (
    <header className="page-header">
      <div className="left">
        {logoUrl ? (
          <img src={logoUrl} alt="Logo" className="page-header-icon" />
        ) : (
          <FileText className="page-header-icon" />
        )}
        <div>
          <span className="title">{title || 'Untitled Document'}</span>
          {subtitle && <span className="subtitle">{subtitle}</span>}
        </div>
      </div>
      <div className="date">{new Date().toLocaleDateString()}</div>
    </header>
  )
}

export default PageHeader
