import { useState } from 'react'
import { Search } from 'lucide-react'

interface Result {
  clause: string
  source: string
}

export const RagSearchPanel = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(false)

  const search = async () => {
    if (!query.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/rag-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })
      const data = await res.json()
      setResults(data.results || [])
    } catch (error) {
      console.error('Search failed', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-72 border-l border-gray-200 p-3 space-y-3 bg-gray-50 shadow-inner">
      <h2 className="text-base font-semibold text-gray-700 flex items-center gap-1">
        Legal Search
      </h2>

      {/* Search Input */}
      <div className="relative">
        <input
          className="border border-gray-300 rounded-md pl-8 pr-2 py-1.5 w-full text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search clauses..."
        />
        <Search
          className="absolute left-2 top-2.5 text-gray-400 w-4 h-4"
        />
      </div>

      {/* Search Button */}
      <button
        className="px-3 py-1.5 bg-blue-600 text-white rounded-md w-full text-sm font-medium hover:bg-blue-700 active:scale-95 transition"
        onClick={search}
      >
        {loading ? 'Searching...' : 'Search'}
      </button>

      {/* Results */}
      <ul className="space-y-2 text-sm">
        {results.length === 0 && !loading && (
          <li className="text-gray-500 text-xs text-center">No results</li>
        )}
        {results.map((r, i) => (
          <li
            key={i}
            className="bg-white p-2 rounded-md shadow-sm border border-gray-200 hover:border-blue-400 hover:shadow transition cursor-pointer"
          >
            <div className="font-medium text-gray-800">{r.clause}</div>
            <div className="text-xs text-gray-500 mt-1">Source: {r.source}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default RagSearchPanel
