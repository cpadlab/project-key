import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { toast } from "sonner";

import { backendAPI as backend } from "@/lib/api";
import type { GroupContextType } from "@/global";

const GroupContext = createContext<GroupContextType | undefined>(undefined);

export const GroupProvider = ({ children }: { children: ReactNode }) => {
    
    const [activeGroup, setActiveGroup] = useState("Personal");
    const [entries, setEntries] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchEntries = async (groupName: string) => {
        setIsLoading(true);
        try {
            console.log(`Fetching entries for group: [${groupName}]`);
            const data = await backend.listEntriesByGroup(groupName);
            console.log(`Entries received for ${groupName}:`, data);   
            setEntries(data);
        } catch (error) {
            console.error("Error fetching entries:", error);
            toast.error("Failed to load group entries");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEntries(activeGroup);
    }, [activeGroup]);

    useEffect(() => {
        const handleVaultChange = () => fetchEntries(activeGroup);
        window.addEventListener('vault-changed', handleVaultChange);
        return () => window.removeEventListener('vault-changed', handleVaultChange);
    }, [activeGroup]);

    return (
        <GroupContext.Provider value={{ activeGroup, setActiveGroup, entries, isLoading }}>
            {children}
        </GroupContext.Provider>
    );

};

export const useGroup = () => {
    const context = useContext(GroupContext);
    if (!context) {
        throw new Error("useGroup must be used within a GroupProvider");
    }
    return context;
};