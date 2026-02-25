import { MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { EntryMenuItems } from "./menu-item"

interface EntryDropdownProps {
    data: any;
    onEdit?: () => void;
    onOpen?: () => void;
    onDelete?: () => void;
}

export const EntryDropdown = ({ data, onEdit, onOpen, onDelete }: EntryDropdownProps) => {
    return (
        <div className="relative">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm" className="opacity-0 group-hover/entry-card:opacity-100 transition-opacity">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent align="end" className="w-56">
                    <EntryMenuItems data={data} onEdit={onEdit} onDelete={onDelete} onOpen={onOpen} />
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}