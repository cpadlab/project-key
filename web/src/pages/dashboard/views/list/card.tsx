import { useState } from "react"
import { CheckIcon, LinkIcon, LockIcon, SquareArrowOutUpRightIcon, UserIcon } from "lucide-react"
import { DEFAULT_ICONS } from "@/components/blocks/icon-selector"
import { Button } from "@/components/ui/button"
import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from "@/components/ui/context-menu"

import { EntryDropdown } from "../../components/entry/menu/dropdown"
import { EntryMenuItems } from "../../components/entry/menu/menu-item"
import { useGroup } from "@/contexts/group-context"
import { cn } from "@/lib/utils"

interface ListCardProps {
    data: {
        uuid: string
        title: string
        username: string | null
        color: string | null
        icon: number | null
        is_favorite: boolean
        url: string | null
        auto_fill_config: any | null
        password: boolean | null
        tags: string[] | null
        created_at?: string
        updated_at?: string
        totp_seed?: boolean | null
    }
}

export const ListCard = ({ data }: ListCardProps) => {

    const { selectedEntries, toggleEntrySelection } = useGroup()
    
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    const isSelected = selectedEntries.includes(data.uuid);

    const iconEntry = DEFAULT_ICONS.find((item) => item.id === data.icon) || DEFAULT_ICONS.find((item) => item.id === 0)!;
    const IconComponent = iconEntry.icon;
    const bgColor = isSelected ? 'hsl(var(--primary))' : (data.color || 'var(--primary)');

    const handleOpen = () => {
        console.log("Abrir detalle", data.uuid);
    }

    const handleToggleSelect = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleEntrySelection(data.uuid);
    }

    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>
                <div className={cn("group/entry-card py-1.5 px-2 rounded-xl border flex items-center gap-2.5 transition-all w-full", isSelected ? "bg-accent/40 border-primary/50" : "bg-card hover:bg-accent/40")}>
                    
                    <button onClick={handleOpen} className="flex items-center flex-1 gap-2.5 cursor-pointer text-left outline-none">
                        <div onClick={handleToggleSelect} className={cn("flex border-2 p-1.5 shrink-0 items-center justify-center rounded-lg shadow-inner text-white transition-all cursor-pointer", isSelected ? "border-primary scale-95" : "hover:scale-105")} style={{ backgroundColor: bgColor }}>
                            {isSelected ? <CheckIcon className="size-4" /> : <IconComponent className="size-4" />}
                        </div>
                        <div className="flex-1 min-w-0 flex gap-2">
                            <div className="flex items-center gap-2 truncate">
                                <p className="font-semibold text-sm text-foreground truncate capitalize">{data.title.toLowerCase()}</p>
                            </div>                
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                <span className="text-xs truncate">{data.username ? data.username.toLowerCase() : "-"}</span>
                            </div>
                        </div>
                    </button>

                    <div className="flex items-center overflow-hidden w-0 transition-all duration-300 group-hover/entry-card:w-auto gap-0">
                        {data.url && (
                            <Button variant="ghost" size="icon-sm">
                                <LinkIcon className="h-4 w-4" />
                            </Button>
                        )}
                        {data.username && (
                            <Button variant="ghost" size="icon-sm">
                                <UserIcon className="h-4 w-4" />
                            </Button>
                        )}
                        {data.password && (
                            <Button variant="ghost" size="icon-sm">
                                <LockIcon className="h-4 w-4" />
                            </Button>
                        )}
                        {data.auto_fill_config && (
                            <Button variant="secondary" size="icon-sm">
                                <SquareArrowOutUpRightIcon className="h-4 w-4" />
                            </Button>
                        )}
                        <EntryDropdown data={data} onOpen={handleOpen} onEdit={() => setIsUpdateDialogOpen(true)} onDelete={() => setIsDeleteDialogOpen(true)} />
                    </div>

                </div>
            </ContextMenuTrigger>

            <ContextMenuContent className="w-56">
                <EntryMenuItems isSelected={isSelected} onToggleSelect={() => toggleEntrySelection(data.uuid)} data={data} isContext onOpen={handleOpen} onEdit={() => setIsUpdateDialogOpen(true)} onDelete={() => setIsDeleteDialogOpen(true)}/>
            </ContextMenuContent>
            
        </ContextMenu>
    )
}

export default ListCard