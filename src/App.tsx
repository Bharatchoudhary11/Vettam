import './App.css'
import { Editor } from './editor/Editor'

function App() {
  return (
    <div className="app-wrapper">
      {/* Header Bar */}
      <header className="app-header">
        <div className="header-content"></div>
      </header>

      {/* Main Editor Area */}
      <main className="app-main">
        <Editor />
      </main>

      {/* Footer */}
      <footer className="app-footer">
        © {new Date().getFullYear()} Vettam – AI-Powered Legal Research & Workflow
      </footer>
    </div>
  )
}

export default App
