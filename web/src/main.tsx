import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from '@/App.tsx'
import '@/styles/global.css'
import { Toaster } from '@/components/ui/sonner'


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
        <Toaster />
    </StrictMode>,
)
