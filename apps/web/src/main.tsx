import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient.ts'
import { AuthProvider } from './context/AuthContext.tsx'
import { ThemeProvider } from './provider/theme-provider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        
      <AuthProvider>
        
    <BrowserRouter>
      <App />
    </BrowserRouter>
</AuthProvider>
       </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
)
