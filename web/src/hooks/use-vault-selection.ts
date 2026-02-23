import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { backendAPI as backend } from "@/lib/api";

export const useVaultSelection = (onHistoryChange?: () => void) => {
    
    const navigate = useNavigate();

    const handleSelectVault = async (path: string) => {
        try {
            const success = await backend.setFilePath(path);
            if (success) {
                navigate("/login");
            } else {
                toast.error("File not found", {
                    description: "The selected vault no longer exists and was removed from history."
                });
                if (onHistoryChange) {
                    onHistoryChange();
                }
            }
        } catch (error) {
            console.error("Selection error:", error);
            toast.error("An unexpected error occurred");
        }
    };

    const openFileSelector = async () => {
        try {
            const path = await backend.selectVaultFile();
            if (path) {
                await handleSelectVault(path);
            }
        } catch (error) {
            console.error("File dialog error:", error);
            toast.error("Error opening file dialog");
        }
    };

    return { handleSelectVault, openFileSelector };

};