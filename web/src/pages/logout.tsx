import { useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";

import { backendAPI as backend } from "@/lib/api";

const LogoutPage = () => {

    const navigate = useNavigate();

    useEffect(() => {

        const performLogout = async () => {            
            try {
                const success = await backend.closeSession();        
                if (success) {
                    toast.success("Session closed successfully");
                    navigate("/", { replace: true }); 
                } else {
                    toast.error("There was a problem logging out of the backend.");
                    navigate("/", { replace: true });
                }
            } catch (error) {
                console.error("Error:", error);
                toast.error("Critical error while attempting to log out.");
                navigate("/", { replace: true });
            }
        };

        performLogout();

    }, [navigate]);

    return (
        <div className="flex h-screen w-full items-center justify-center flex-col gap-4">
            <Spinner />
        </div>
    );
}

export default LogoutPage