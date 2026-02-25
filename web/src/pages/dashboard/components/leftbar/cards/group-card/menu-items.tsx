
import { Pencil, Trash2, Calendar, Clock } from "lucide-react"
import { DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu"
import { ContextMenuItem, ContextMenuSeparator, ContextMenuLabel } from "@/components/ui/context-menu"

import { type GroupModel } from "@/global"

interface GroupMenuItemsProps {
    data: GroupModel;
    onEdit: () => void;
    onDelete: () => void;
    isContext?: boolean;
}

export const GroupMenuItems = ({ data, onEdit, onDelete, isContext = false }: GroupMenuItemsProps) => {
    
    const Item = isContext ? ContextMenuItem : DropdownMenuItem
    const Separator = isContext ? ContextMenuSeparator : DropdownMenuSeparator
    const Label = isContext ? ContextMenuLabel : DropdownMenuLabel

    const formatDate = (date?: string | Date) => {
        if (!date) return "N/A"
        return new Date(date).toLocaleDateString(undefined, { 
            day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
        })
    }

    return (
        <>
            <Label>Actions</Label>
            <Item className="gap-2 cursor-pointer" onSelect={onEdit}>
                <Pencil className="h-4 w-4" />
                <span>Modify</span>
            </Item>
            <Item variant="destructive" className="gap-2 cursor-pointer" onSelect={onDelete}>
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
            </Item>
            
            <Separator />
            
            <Label className="text-xs font-normal text-muted-foreground uppercase tracking-wider">History</Label>
            <div className="px-2 py-1.5 flex flex-col gap-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Created: {formatDate(data.created_at)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Updated: {formatDate(data.updated_at)}</span>
                </div>
            </div>
        </>
    )
}