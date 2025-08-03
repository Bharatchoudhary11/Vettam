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
    <div className="rag-panel">
      <div className="search-wrapper">
        <input
          className="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search clauses..."
        />
        <Search className="search-icon" />
      </div>

      <button className="btn btn-primary search-button" onClick={search}>
        {loading ? 'Searching...' : 'Search'}
      </button>

      <ul className="results-list">
        {results.length === 0 && !loading && (
          <li className="no-results">No results</li>
        )}
        {results.map((r, i) => (
          <li key={i} className="result-item">
            <div className="clause">{r.clause}</div>
            <div className="source">Source: {r.source}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default RagSearchPanel
