import { useState } from 'react'

interface Result {
  clause: string
  source: string
}

export const RagSearchPanel = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Result[]>([])

  const search = async () => {
    const res = await fetch('/api/rag-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    })
    const data = await res.json()
    setResults(data.results || [])
  }

  return (
    <div className="search-panel">
      <h2 className="panel-title">Legal Search</h2>
      <input
        className="input-text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search clauses..."
      />
      <button className="btn btn-primary btn-block" onClick={search}>
        Search
      </button>
      <ul className="result-list">
        {results.map((r, i) => (
          <li key={i}>
            <div className="result-clause">{r.clause}</div>
            <div className="result-source">{r.source}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default RagSearchPanel
