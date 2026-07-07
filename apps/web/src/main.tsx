import { QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { Toaster } from './components/ui/sonner.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import './index.css'
import { queryClient } from './lib/queryClient.ts'
import { ThemeProvider } from './provider/theme-provider.tsx'
import { router } from './router.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
         <RouterProvider router={router} />
            <Toaster richColors />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
)
