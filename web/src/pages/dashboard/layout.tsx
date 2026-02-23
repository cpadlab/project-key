import { SidebarProvider } from "@/components/ui/sidebar"
import { Outlet } from "react-router-dom"

import Leftbar from "./components/leftbar/leftbar"

const DashboardLayout = () => {
    return (
        <SidebarProvider>
            <Leftbar />
            <Outlet />
        </SidebarProvider>
    )
}

export default DashboardLayout