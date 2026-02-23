import { type GroupModel } from "@/global"
import { GroupDropdown } from "./dropdown"
import { DEFAULT_ICONS } from "@/components/blocks/icon-selector";

interface GroupCardProps {
    data: GroupModel;
}

const GroupCard = ({ data }: GroupCardProps) => {

    const IconEntry = DEFAULT_ICONS.find(item => item.id === data.icon) || DEFAULT_ICONS[0];
    const IconComponent = IconEntry.icon;

    const handleGroupClick = () => {
        console.log(`Selected group: ${data.name}`);
    };

    return (
        <div className="group flex items-center justify-between p-1 mb-1 rounded-lg bg-card text-card-foreground hover:bg-accent/50 transition-colors">
            
            <button onClick={handleGroupClick} className="flex items-center gap-3 cursor-pointer flex-1 text-left outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-md p-1">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-white shadow-sm" style={{ backgroundColor: data.color || 'var(--color-primary)' }} >
                    <IconComponent className="h-4 w-4" />
                </div>    
                <div className="flex flex-col overflow-hidden">
                    <span className="font-medium text-sm truncate leading-tight">
                        {data.name}
                    </span>
                </div>
            </button>
            
            <GroupDropdown data={data} />

        </div>
    );
};

export default GroupCard;