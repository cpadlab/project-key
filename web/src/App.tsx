import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom"
import { Toaster } from "@/components/ui/sonner" 

import { ThemeProvider } from "./contexts/theme-context"
import WelcomePage from "./pages/welcome"
import LoginPage from "./pages/login/page"
import RouteDirector from "./pages/route-director"
import DashboardLayout from "./pages/dashboard/layout"
import DashboardPage from "./pages/dashboard/page"
import { CloseConfirmationDialog } from "./components/blocks/dialogs/close-confirmation-dialog"
import LogoutPage from "./pages/logout"
import SettingsLayout from "./pages/settings/layout"
import AppearanceSettings from "./pages/settings/sections/appearance/page"
import SettingsPage from "./pages/settings/page"
import SecuritySettings from "./pages/settings/sections/security/page"
import MaintenanceSettings from "./pages/settings/sections/maintenance/page"
import AdvancedSettings from "./pages/settings/sections/advanced/page"
import SystemSettings from "./pages/settings/sections/system"
import { GroupProvider } from "./contexts/group-context"
import DataTransferSettings from "./pages/settings/sections/data-transfer/page"

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
                </Router>

            </GroupProvider>

            <Toaster />
            <CloseConfirmationDialog />

        </ThemeProvider>
    )
}

export default App