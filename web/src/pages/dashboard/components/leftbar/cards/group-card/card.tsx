import { type GroupModel } from "@/global"
import { GroupDropdown } from "./dropdown"
import { DEFAULT_ICONS } from "@/components/blocks/icon-selector";
import { cn } from "@/lib/utils";
import { useGroup } from "@/contexts/group-context";

// Importamos los componentes del Menú Contextual
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
    ContextMenuSeparator,
} from "@/components/ui/context-menu"
import { Pencil, Trash2 } from "lucide-react"
import { useState } from "react"

interface GroupCardProps {
    data: GroupModel;
}

const GroupCard = ({ data }: GroupCardProps) => {
    const { activeGroup, setActiveGroup } = useGroup();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    
    const isActive = activeGroup === data.name;
    const IconEntry = DEFAULT_ICONS.find(item => item.id === data.icon) || DEFAULT_ICONS[0];
    const IconComponent = IconEntry.icon;

    const handleGroupClick = () => {
        setActiveGroup(data.name);
    };

    return (
        <ContextMenu>
            {/* El Trigger envuelve toda la tarjeta para detectar el clic derecho */}
            <ContextMenuTrigger>
                <div className={cn(
                    "group/card flex items-center justify-between p-1 mb-1 rounded-lg transition-colors", 
                    isActive ? "bg-accent text-accent-foreground" : "bg-card text-card-foreground hover:bg-accent/50"
                )}>
                    <button onClick={handleGroupClick} className="flex items-center gap-3 cursor-pointer flex-1 text-left outline-none p-1">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-white" style={{ backgroundColor: data.color || 'var(--color-primary)' }} >
                            <IconComponent className="h-4 w-4" />
                        </div>    
                        <div className="flex flex-col overflow-hidden">
                            <span className={cn("text-sm truncate leading-tight", isActive ? "font-bold" : "font-medium")}>
                                {data.name}
                            </span>
                        </div>
                    </button>
                    
                    {/* El dropdown tradicional sigue funcionando en el botón de tres puntos */}
                    <GroupDropdown data={data} />
                </div>
            </ContextMenuTrigger>

            {/* Este es el contenido que aparece al hacer clic derecho */}
            <ContextMenuContent className="w-48">
                <ContextMenuItem className="gap-2" onSelect={() => {/* Abrir diálogo de edición */}}>
                    <Pencil className="h-4 w-4" />
                    <span>Modify Group</span>
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem 
                    variant="destructive" 
                    className="gap-2" 
                    onSelect={() => setIsDeleteDialogOpen(true)}
                >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete Group</span>
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    );
};

export default GroupCard;