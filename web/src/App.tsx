import { lazy, Suspense, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Outlet, useLocation } from "react-router-dom"
import { Toaster } from "@/components/ui/sonner" 
import nprogress from "nprogress"

import { ThemeProvider } from "./contexts/theme-context"
import { GroupProvider } from "./contexts/group-context"
import { CloseConfirmationDialog } from "./components/blocks/dialogs/close-confirmation-dialog"

const WelcomePage = lazy(() => import("./pages/welcome"))
const LoginPage = lazy(() => import("./pages/login/page"))
const RouteDirector = lazy(() => import("./pages/route-director"))
const DashboardLayout = lazy(() => import("./pages/dashboard/layout"))
const DashboardPage = lazy(() => import("./pages/dashboard/page"))
const LogoutPage = lazy(() => import("./pages/logout"))
const SettingsLayout = lazy(() => import("./pages/settings/layout"))
const SettingsPage = lazy(() => import("./pages/settings/page"))
const AppearanceSettings = lazy(() => import("./pages/settings/sections/appearance/page"))
const SecuritySettings = lazy(() => import("./pages/settings/sections/security/page"))
const MaintenanceSettings = lazy(() => import("./pages/settings/sections/maintenance/page"))
const AdvancedSettings = lazy(() => import("./pages/settings/sections/advanced/page"))
const SystemSettings = lazy(() => import("./pages/settings/sections/system"))
const DataTransferSettings = lazy(() => import("./pages/settings/sections/data-transfer/page"))

const NavigationWatcher = () => {
    const location = useLocation()
    useEffect(() => {
        nprogress.done()
    }, [location])
    return null
}

const GroupContextWrapper = () => (
    <GroupProvider>
        <Outlet />
    </GroupProvider>
);

function App() {
    return (
        <ThemeProvider>
            <GroupProvider>
                <Router>
                    <NavigationWatcher />
                    <Suspense fallback={null}> 
                        <Routes>
                            <Route path="/" element={<RouteDirector />} />
                            <Route path="/welcome" element={<WelcomePage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/logout" element={<LogoutPage />} />
                            
                            <Route element={<GroupContextWrapper />}>
                                <Route element={<DashboardLayout />}>
                                    <Route path="/dashboard" element={<DashboardPage />} />
                                </Route>
                                
                                <Route path="/settings" element={<SettingsLayout />}>
                                    <Route index element={<SettingsPage />} />
                                    <Route path="appearance" element={<AppearanceSettings />} />
                                    <Route path="security" element={<SecuritySettings />} />
                                    <Route path="maintenance" element={<MaintenanceSettings />} />
                                    <Route path="advanced" element={<AdvancedSettings />} />
                                    <Route path="system" element={<SystemSettings />} />
                                    <Route path="data-transfer" element={<DataTransferSettings />} />
                                </Route>
                            </Route>
                        </Routes>
                    </Suspense>
                </Router>
            </GroupProvider>

            <Toaster />
            <CloseConfirmationDialog />
        </ThemeProvider>
    )
}

export default App