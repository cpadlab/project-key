import { type GroupModel } from "@/global"
import { GroupDropdown } from "./dropdown"
import { DEFAULT_ICONS } from "@/components/blocks/icon-selector";
import { cn } from "@/lib/utils";

import { useGroup } from "@/contexts/group-context";

interface GroupCardProps {
    data: GroupModel;
}

const GroupCard = ({ data }: GroupCardProps) => {

    const { activeGroup, setActiveGroup } = useGroup();

    const isActive = activeGroup === data.name;

    const IconEntry = DEFAULT_ICONS.find(item => item.id === data.icon) || DEFAULT_ICONS[0];
    const IconComponent = IconEntry.icon;

    const handleGroupClick = () => {
        setActiveGroup(data.name);
        console.log(`Selected group: ${data.name}`);
    };

    return (
        <div className={cn("group/card flex items-center justify-between p-1 mb-1 rounded-lg transition-colors",isActive ? "bg-accent text-accent-foreground shadow-sm" : "bg-card text-card-foreground hover:bg-accent/50")}>
            
            <button onClick={handleGroupClick} className="flex items-center gap-3 cursor-pointer flex-1 text-left outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-md p-1">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-white shadow-sm" style={{ backgroundColor: data.color || 'var(--color-primary)' }} >
                    <IconComponent className="h-4 w-4" />
                </div>    
                <div className="flex flex-col overflow-hidden">
                    <span className={cn("text-sm truncate leading-tight", isActive ? "font-bold" : "font-medium")}>
                        {data.name}
                    </span>
                </div>
            </button>
            
            <GroupDropdown data={data} />
            
        </div>
    );
};

export default GroupCard;