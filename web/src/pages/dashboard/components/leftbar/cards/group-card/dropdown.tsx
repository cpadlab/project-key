import { MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { type GroupModel } from "@/global"
import { GroupMenuItems } from "./menu-items"

interface GroupDropdownProps {
    data: GroupModel;
    onEdit: () => void;
    onDelete: () => void;
}

export const GroupDropdown = ({ data, onEdit, onDelete }: GroupDropdownProps) => {
    return (
        <DropdownMenu>
            
            <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon-xs" className="opacity-0 group-hover/card:opacity-100 transition-opacity">
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="start" className="w-56">
                <GroupMenuItems data={data} onEdit={onEdit} onDelete={onDelete} />
            </DropdownMenuContent>

        </DropdownMenu>
    )
}