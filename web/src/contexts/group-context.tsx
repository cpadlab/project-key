import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from "react";
import { toast } from "sonner";
import { backendAPI as backend } from "@/lib/api";

interface GroupContextType {
    activeGroup: string;
    setActiveGroup: (name: string) => void;
    entries: any[];
    isLoading: boolean;
    sortOrder: string;
    setSortOrder: (order: string) => void;
}

const GroupContext = createContext<GroupContextType | undefined>(undefined);

export const GroupProvider = ({ children }: { children: ReactNode }) => {
    
    const [activeGroup, setActiveGroup] = useState("Personal");
    const [rawEntries, setRawEntries] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [sortOrder, setSortOrder] = useState("az");

    const fetchEntries = async (groupName: string) => {
        setIsLoading(true);
        try {
            const data = await backend.listEntriesByGroup(groupName);
            setRawEntries(data);
        } catch (error) {
            console.error("Error fetching entries:", error);
            toast.error("Failed to load group entries");
        } finally {
            setIsLoading(false);
        }
    };

    const sortedEntries = useMemo(() => {
        const items = [...rawEntries];
        switch (sortOrder) {
            case "az": return items.sort((a, b) => a.title.localeCompare(b.title));
            case "za": return items.sort((a, b) => b.title.localeCompare(a.title));
            case "newest": return items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            case "oldest": return items.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
            default: return items;
        }
    }, [rawEntries, sortOrder]);

    useEffect(() => {
        fetchEntries(activeGroup);
    }, [activeGroup]);

    useEffect(() => {
        const handleVaultChange = () => fetchEntries(activeGroup);
        window.addEventListener('vault-changed', handleVaultChange);
        return () => window.removeEventListener('vault-changed', handleVaultChange);
    }, [activeGroup]);

    return (
        <GroupContext.Provider value={{ 
            activeGroup, 
            setActiveGroup, 
            entries: sortedEntries,
            isLoading,
            sortOrder,
            setSortOrder
        }}>
            {children}
        </GroupContext.Provider>
    );
};

export const useGroup = () => {
    const context = useContext(GroupContext);
    if (!context) throw new Error("useGroup must be used within a GroupProvider");
    return context;
};