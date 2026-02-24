import { createContext, useContext, useState, type ReactNode } from "react";

interface GroupContextType {
    activeGroup: string;
    setActiveGroup: (name: string) => void;
}

const GroupContext = createContext<GroupContextType | undefined>(undefined);

export const GroupProvider = ({ children }: { children: ReactNode }) => {
    
    const [activeGroup, setActiveGroup] = useState("Personal");

    return (
        <GroupContext.Provider value={{ activeGroup, setActiveGroup }}>
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