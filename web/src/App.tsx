import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from "@/components/ui/sonner" 

import { ThemeProvider } from "./contexts/theme-context"
import WelcomePage from "./pages/welcome"

const DashboardPage = () => {
    return (
        <div className="h-dvh flex items-center justify-center bg-background text-foreground">
            <h1 className="text-3xl font-bold">Welcome to your Vault! 🔐</h1>
        </div>
    )
}

function App() {
    return (
        <ThemeProvider>
            
            <Router>
                <Routes>
                    <Route path="/" element={<WelcomePage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                </Routes>
            </Router>

            <Toaster />
        </ThemeProvider>
    )
}

export default App