import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Outlet } from "react-router-dom"
import { useEffect } from "react";

import Leftbar from "./components/leftbar/leftbar"
import { backendAPI as backend } from "@/lib/api"
import { useAppNavigate } from "@/hooks/use-app-navigate"

const DashboardLayout = () => {

    const { navigate } = useAppNavigate();

    useEffect(() => {

        const verifySession = async () => {
            try {
                const active = await backend.isSessionActive();
                if (!active) {
                    navigate("/", { replace: true });
                }
            } catch (error) {
                console.error("Error:", error);
                navigate("/", { replace: true });
            }
        };

        verifySession();
        
    }, [navigate]);

    return (
        <SidebarProvider>
            <Leftbar />
            <SidebarInset>
                <Outlet />
            </SidebarInset>
        </SidebarProvider>
    )
}

export default DashboardLayout