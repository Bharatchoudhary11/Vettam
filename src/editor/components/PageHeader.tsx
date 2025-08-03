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
    <header className="page-header flex items-center justify-between px-4 py-2 border-b border-gray-300 bg-gray-50 shadow-sm">
      {/* Left: Logo or icon */}
      <div className="flex items-center gap-2">
        {logoUrl ? (
          <img src={logoUrl} alt="Logo" className="h-6 w-auto" />
        ) : (
          <FileText className="w-5 h-5 text-purple-600" />
        )}
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-800">{title || 'Untitled Document'}</span>
          {subtitle && (
            <span className="text-xs text-gray-500">{subtitle}</span>
          )}
        </div>
      </div>

      {/* Right: Placeholder for date or extra info */}
      <div className="text-xs text-gray-500">
        {new Date().toLocaleDateString()}
      </div>
    </header>
  )
}

export default PageHeader
