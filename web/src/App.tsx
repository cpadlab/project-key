import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from "@/components/ui/sonner" 

import { ThemeProvider } from "./contexts/theme-context"
import WelcomePage from "./pages/welcome"
import LoginPage from "./pages/login/page"
import RouteDirector from "./pages/route-director"
import DashboardLayout from "./pages/dashboard/layout"
import DashboardPage from "./pages/dashboard/page"

function App() {
    return (
        <ThemeProvider>
            
            <Router>
                <Routes>
                    <Route path="/" element={<RouteDirector />} />
                    <Route path="/welcome" element={<WelcomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route element={<DashboardLayout />}>
                        <Route path="/dashboard" element={<DashboardPage />} />
                    </Route>
                </Routes>
            </Router>

            <Toaster />
        </ThemeProvider>
    )
}

export default App