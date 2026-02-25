import { useState } from "react"
import { type GroupModel } from "@/global"
import { cn } from "@/lib/utils"
import { useGroup } from "@/contexts/group-context"
import { DEFAULT_ICONS } from "@/components/blocks/icon-selector"

import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from "@/components/ui/context-menu"
import { GroupDropdown } from "./dropdown"
import { GroupMenuItems } from "./menu-items"
import { DeleteGroupDialog } from "./delete-dialog"
import { GroupFormDialog } from "../../forms/group-form-dialog"

interface GroupCardProps {
    data: GroupModel;
}

const GroupCard = ({ data }: GroupCardProps) => {
    
    const { activeGroup, setActiveGroup } = useGroup()
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)

    const isActive = activeGroup === data.name
    const IconEntry = DEFAULT_ICONS.find(item => item.id === data.icon) || DEFAULT_ICONS[0]
    const IconComponent = IconEntry.icon

    return (
        <ContextMenu>

            <ContextMenuTrigger>
                <div className={cn("group/card flex items-center justify-between p-1 mb-1 rounded-lg transition-colors", isActive ? "bg-accent text-accent-foreground" : "bg-card text-card-foreground hover:bg-accent/50")}>

                    <button onClick={() => setActiveGroup(data.name)} className="flex items-center gap-3 cursor-pointer flex-1 text-left outline-none p-1">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-white" style={{ backgroundColor: data.color || 'var(--color-primary)' }} >
                            <IconComponent className="h-4 w-4" />
                        </div>    
                        <div className="flex flex-col overflow-hidden">
                            <span className={cn("text-sm truncate leading-tight", isActive ? "font-bold" : "font-medium")}>
                                {data.name}
                            </span>
                        </div>
                    </button>
                    
                    <GroupDropdown data={data} onEdit={() => setIsUpdateDialogOpen(true)} onDelete={() => setIsDeleteDialogOpen(true)} />

                </div>
            </ContextMenuTrigger>

            <ContextMenuContent className="w-56">
                <GroupMenuItems data={data} onEdit={() => setIsUpdateDialogOpen(true)} onDelete={() => setIsDeleteDialogOpen(true)} isContext />
            </ContextMenuContent>

            <DeleteGroupDialog groupName={data.name} isOpen={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)} onSuccess={() => window.dispatchEvent(new CustomEvent('vault-changed'))}/>
            <GroupFormDialog mode="edit" initialData={data} open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen} />

        </ContextMenu>
    )
}

export default GroupCard