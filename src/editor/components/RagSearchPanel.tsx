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
    <div className="w-60 border-l p-2 space-y-2 overflow-y-auto">
      <h2 className="font-bold">Legal Search</h2>
      <input
        className="border p-1 w-full"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search clauses..."
      />
      <button
        className="px-2 py-1 bg-blue-500 text-white w-full"
        onClick={search}
      >
        Search
      </button>
      <ul className="space-y-2 text-sm">
        {results.map((r, i) => (
          <li key={i}>
            <div className="font-semibold">{r.clause}</div>
            <div className="text-gray-600">{r.source}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default RagSearchPanel
