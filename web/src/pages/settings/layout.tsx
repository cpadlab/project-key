import { Outlet } from "react-router-dom"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import { SettingsSidebar } from "./components/leftbar"

const SettingsLayout = () => {
    return (
        <SidebarProvider>
            
            <SettingsSidebar />

            <SidebarInset>
                <main className="flex-1 overflow-y-auto p-4 bg-background">
                    <div className="mx-auto max-w-4xl w-full">
                        <Outlet />
                    </div>
                </main>
            </SidebarInset>

        </SidebarProvider>
    )
}

export default SettingsLayout