import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'
import Toast from './components/ui/Toast'

const root = createRoot(document.getElementById('root'))

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      {/* Toast portal target in AdminLayout, fallback here */}
      <div id="toast-portal"><Toast /></div>
    </QueryClientProvider>
  </StrictMode>
)
