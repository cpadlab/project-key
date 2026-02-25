
import { Pencil, Trash2, Calendar, Clock, ExternalLinkIcon } from "lucide-react"
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { ContextMenuItem, ContextMenuSeparator } from "@/components/ui/context-menu"

import { type GroupModel } from "@/global"
import { Kbd } from "@/components/ui/kbd";
import { useEffect } from "react";

interface GroupMenuItemsProps {
    data: GroupModel;
    onEdit: () => void;
    onOpen: () => void;
    onDelete: () => void;
    isContext?: boolean;
}

export const GroupMenuItems = ({ data, onEdit, onDelete, onOpen, isContext = false }: GroupMenuItemsProps) => {
    
    const Item = isContext ? ContextMenuItem : DropdownMenuItem
    const Separator = isContext ? ContextMenuSeparator : DropdownMenuSeparator

    const formatDate = (date?: string | Date) => {
        if (!date) return "N/A"
        return new Date(date).toLocaleDateString(undefined, { 
            day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
        })
    }

    useEffect(() => {

        const handleKeyDown = (e: KeyboardEvent) => {
            
            if (e.key === "Delete") {
                e.preventDefault();
                onDelete();
            }

            if (e.key.toLowerCase() === "m" && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                onEdit();
            }

            if (e.key.toLowerCase() === "e" && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                onOpen();
            }

        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);

    }, [onEdit, onDelete]);

    return (
        <>
            <p className="text-muted-foreground px-1.5 py-1 text-xs font-medium">Actions</p>
            <Item className="gap-2 cursor-pointer" onSelect={onOpen}>
                <div className="flex items-center gap-2 flex-1">
                    <ExternalLinkIcon className="h-4 w-4" />
                    <span>Open</span>
                </div>
                <Kbd>Ctrl + E</Kbd> 
            </Item>
            <Item className="gap-2 cursor-pointer" onSelect={onEdit}>
                <div className="flex items-center gap-2 flex-1">
                    <Pencil className="h-4 w-4" />
                    <span>Modify</span>
                </div>
                <Kbd>Ctrl + M</Kbd>
            </Item>

            <Separator />
            
            <Item variant="destructive" className="gap-2 cursor-pointer" onSelect={onDelete}>
                <div className="flex items-center gap-2 flex-1">
                    <Trash2 className="h-4 w-4 text-destructive" />
                    <span>Delete</span>
                </div>
                <Kbd>Del</Kbd>
            </Item>
            
            <Separator />
            
            <p className="text-muted-foreground px-1.5 py-1 text-xs font-medium">History</p>
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