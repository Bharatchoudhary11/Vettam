import './App.css'
import { Editor } from './editor/Editor'

function App() {
  return (
    <div className="h-screen w-screen bg-gray-100 flex flex-col">
      {/* Header Bar */}
      <header className="bg-white shadow px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
        </div>
      </header>

      {/* Main Editor Area */}
      <main className="flex-1 overflow-hidden">
        <Editor />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t text-center py-2 text-sm text-gray-500">
        © {new Date().getFullYear()} Vettam – AI-Powered Legal Research & Workflow
      </footer>
    </div>
  )
}

export default App
