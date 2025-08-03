import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Import styles
import './index.css'
import 'prosemirror-view/style/prosemirror.css'

import App from './App.tsx'

const rootElement = document.getElementById('root') as HTMLElement

if (!rootElement) {
  throw new Error("Root element not found. Check index.html for <div id='root'></div>")
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
