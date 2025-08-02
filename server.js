import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

// Inline AI rewrite suggestions endpoint
app.post('/api/suggest-rewrite', (req, res) => {
  const { text } = req.body
  // Placeholder suggestion logic
  const suggestion = text ? text.split('').reverse().join('') : ''
  res.json({ suggestion })
})

// RAG-powered legal search endpoint
app.post('/api/rag-search', (req, res) => {
  const { query } = req.body
  // Placeholder results; integrate with pgvector/Pinecone here
  const results = [
    {
      clause: 'Sample confidentiality clause',
      source: 'Case Reference A',
      similarity: 0.9,
    },
  ]
  res.json({ results })
})

// Tool-calling endpoints
app.post('/api/find-clause', (req, res) => {
  const { doc, clause } = req.body
  const exists = typeof doc === 'string' && typeof clause === 'string' && doc.includes(clause)
  res.json({ exists, snippet: exists ? clause : '' })
})

app.post('/api/summarize', (req, res) => {
  const { doc } = req.body
  const summary = typeof doc === 'string' ? doc.slice(0, 100) : ''
  res.json({ summary })
})

app.post('/api/check-consistency', (req, res) => {
  const { doc } = req.body
  // Placeholder: no advanced checks
  const issues = []
  res.json({ issues })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`API server listening on port ${PORT}`)
})
