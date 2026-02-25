import { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef, type ReactNode } from "react";
import { toast } from "sonner";
import { backendAPI as backend } from "@/lib/api";
import type { GroupModel } from "@/global";

interface GroupContextType {
    groups: GroupModel[];
    refreshGroups: () => Promise<void>;
    activeGroup: string;
    setActiveGroup: (name: string) => void;
    entries: any[];
    isLoading: boolean;
    sortOrder: string;
    selectedEntries: string[];
    toggleEntrySelection: (uuid: string) => void;
    clearSelection: () => void;
    setSortOrder: (order: string) => void;
}

const GroupContext = createContext<GroupContextType | undefined>(undefined);

export const GroupProvider = ({ children }: { children: ReactNode }) => {
    
    const [groups, setGroups] = useState<GroupModel[]>([]);
    const [activeGroup, setActiveGroup] = useState("Personal");
    const [rawEntries, setRawEntries] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [sortOrder, setSortOrder] = useState("az");
    const [selectedEntries, setSelectedEntries] = useState<string[]>([]);

    const isFetchingRef = useRef(false);

    const toggleEntrySelection = useCallback((uuid: string) => {
        setSelectedEntries(prev => 
            prev.includes(uuid) ? prev.filter(id => id !== uuid) : [...prev, uuid]
        );
    }, []);

    const clearSelection = useCallback(() => {
        setSelectedEntries([]);
    }, []);

    useEffect(() => {
        clearSelection();
    }, [activeGroup, clearSelection]);

    const refreshGroups = useCallback(async () => {
        try {
            const data = await backend.listGroups();
            setGroups(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching groups:", error);
        }
    }, []);

    useEffect(() => {
        if (activeGroup !== "Personal" && groups.length > 0) {
            const groupExists = groups.some(g => g.name === activeGroup);
            if (!groupExists) {
                setActiveGroup("Personal");
            }
        }
    }, [groups, activeGroup]);

    const fetchEntries = useCallback(async (groupName: string) => {
        
        if (isFetchingRef.current) return;
        isFetchingRef.current = true;
        setIsLoading(true);
        
        try {
            const data = await backend.listEntriesByGroup(groupName);
            setRawEntries(Array.isArray(data) ? data : []);
            console.log(data)
        } catch (error) {
            console.error("Error fetching entries:", error);
            toast.error("Failed to load group entries");
        } finally {
            setIsLoading(false);
            isFetchingRef.current = false;
        }

    }, []);

    const sortedEntries = useMemo(() => {
        const items = [...rawEntries];
        switch (sortOrder) {
            case "az": return items.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
            case "za": return items.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
            case "newest": return items.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
            case "oldest": return items.sort((a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime());
            default: return items;
        }
    }, [rawEntries, sortOrder]);

    useEffect(() => {
        
        refreshGroups();
        fetchEntries(activeGroup);

        const handleVaultChange = () => {
            refreshGroups();
            fetchEntries(activeGroup);
        };

        window.addEventListener('vault-changed', handleVaultChange);
        return () => window.removeEventListener('vault-changed', handleVaultChange);
        
    }, [activeGroup, refreshGroups, fetchEntries]);

    return (
        <GroupContext.Provider value={{ 
            groups,
            refreshGroups,
            activeGroup, 
            setActiveGroup, 
            entries: sortedEntries,
            isLoading,
            sortOrder,
            setSortOrder,
            selectedEntries,
            toggleEntrySelection,
            clearSelection
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