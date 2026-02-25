import { type GroupModel } from "@/global"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu"
import { MoreVertical, Pencil, Trash2, Calendar, Clock } from "lucide-react"
import { useState } from "react";

import { DeleteGroupDialog } from "./delete-dialog";
import { GroupFormDialog } from "../../forms/group-form-dialog";

interface GroupDropdownProps {
    data: GroupModel;
}

export const GroupDropdown = ({ data }: GroupDropdownProps) => {

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

    const formatDate = (date?: string | Date) => {
        if (!date) return "N/A";
        const d = new Date(date);
        return d.toLocaleDateString(undefined, { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <>

            <DropdownMenu>
                
                <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon-xs" className="opacity-0 group-hover/card:opacity-100 transition-opacity">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem className="gap-2 cursor-pointer" onSelect={() => setIsUpdateDialogOpen(true)}>
                        <Pencil className="h-4 w-4" />
                        <span>Modify</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" className="gap-2 cursor-pointer" onSelect={() => setIsDeleteDialogOpen(true)}>
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuLabel className="text-xs font-normal text-muted-foreground uppercase tracking-wider">History</DropdownMenuLabel>
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
                    
                </DropdownMenuContent>
            </DropdownMenu>

            <DeleteGroupDialog onSuccess={() => {window.dispatchEvent(new CustomEvent('vault-changed'));}} groupName={data.name} isOpen={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)} />
            <GroupFormDialog mode="edit" initialData={data} open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen} />

        </>
    );
};