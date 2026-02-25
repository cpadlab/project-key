import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Outlet, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react";

import Leftbar from "./components/leftbar/leftbar"
import { backendAPI as backend } from "@/lib/api"
import { Spinner } from "@/components/ui/spinner";

const DashboardLayout = () => {

    const navigate = useNavigate();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {

        const verifySession = async () => {
            try {
                const active = await backend.isSessionActive();
                if (!active) {
                    navigate("/", { replace: true });
                } else {
                    setIsChecking(false);
                }
            } catch (error) {
                console.error("Error:", error);
                navigate("/", { replace: true });
            }
        };

        verifySession();
        
    }, [navigate]);

    /* if (isChecking) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <Spinner />
            </div>
        );
    } */

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