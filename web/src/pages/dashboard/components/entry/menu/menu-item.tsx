import {  Calendar, Clock, EyeIcon, ExternalLinkIcon, StarOffIcon, StarIcon, PencilIcon, FolderOutputIcon, LockIcon, UserIcon, Trash2Icon, KeyRoundIcon, LinkIcon, Square, SquareIcon } from "lucide-react"
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { ContextMenuItem, ContextMenuSeparator } from "@/components/ui/context-menu"
import { Kbd } from "@/components/ui/kbd"

interface EntryData {
    uuid: string;
    title: string;
    username: string | null;
    password: boolean | null;
    url: string | null;
    totp_seed?: boolean | null;
    is_favorite: boolean;
    created_at?: string;
    updated_at?: string;
    [key: string]: any;
}

interface EntryMenuItemsProps {
    data: EntryData;
    onEdit?: () => void;
    onOpen?: () => void;
    onDelete?: () => void;
    onToggleFavorite?: () => void;
    onMove?: () => void;
    onCopyUsername?: () => void;
    onCopyPassword?: () => void;
    onCopyUrl?: () => void;
    onCopyTotp?: () => void;
    isContext?: boolean;
}

export const EntryMenuItems = ({ 
    data, 
    onEdit = () => {}, 
    onDelete = () => {}, 
    onOpen = () => {}, 
    onToggleFavorite = () => {},
    onMove = () => {},
    onCopyUsername = () => {},
    onCopyPassword = () => {},
    onCopyUrl = () => {},
    onCopyTotp = () => {},
    isContext = false 
}: EntryMenuItemsProps) => {
    
    const Item = isContext ? ContextMenuItem : DropdownMenuItem
    const Separator = isContext ? ContextMenuSeparator : DropdownMenuSeparator

    const formatDate = (date?: string | Date) => {
        if (!date) return "N/A"
        return new Date(date).toLocaleDateString(undefined, { 
            day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
        })
    }

    return (
        <>
            <p className="text-muted-foreground px-1.5 py-1 text-xs font-medium">Actions</p>

            <Item className="gap-2 cursor-pointer" onSelect={onOpen}>
                <div className="flex items-center gap-2 flex-1">
                    <SquareIcon className="h-4 w-4" />
                    <span>Select</span>
                </div>
            </Item>

            <Item className="gap-2 cursor-pointer" onSelect={onOpen}>
                <div className="flex items-center gap-2 flex-1">
                    <EyeIcon className="h-4 w-4" />
                    <span>View</span>
                </div>
            </Item>
            
            <Item className="gap-2 cursor-pointer" onSelect={onOpen}>
                <div className="flex items-center gap-2 flex-1">
                    <ExternalLinkIcon className="h-4 w-4" />
                    <span>Open</span>
                </div>
                <Kbd>Ctrl+E</Kbd> 
            </Item>
            
            <Item className="gap-2 cursor-pointer" onSelect={onEdit}>
                <div className="flex items-center gap-2 flex-1">
                    <PencilIcon className="h-4 w-4" />
                    <span>Edit</span>
                </div>
                <Kbd>Ctrl+M</Kbd>
            </Item>

            <Item className="gap-2 cursor-pointer" onSelect={onToggleFavorite}>
                <div className="flex items-center gap-2 flex-1">
                    {data.is_favorite ? <StarOffIcon className="h-4 w-4" /> : <StarIcon className="h-4 w-4" />}
                    <span>{data.is_favorite ? "Remove from favorites" : "Add to favorites"}</span>
                </div>
            </Item>

            <Item className="gap-2 cursor-pointer" onSelect={onMove}>
                <div className="flex items-center gap-2 flex-1">
                    <FolderOutputIcon className="h-4 w-4" />
                    <span>Move to group...</span>
                </div>
            </Item>

            <Separator />
            
            <p className="text-muted-foreground px-1.5 py-1 text-xs font-medium">Clipboard</p>
            
            {data.username && (
                <Item className="gap-2 cursor-pointer" onSelect={onCopyUsername}>
                    <UserIcon className="h-4 w-4" />
                    <span>Copy User</span>
                </Item>
            )}
            
            {data.password && (
                <Item className="gap-2 cursor-pointer" onSelect={onCopyPassword}>
                    <LockIcon className="h-4 w-4" />
                    <span>Copy Password</span>
                </Item>
            )}
            
            {data.url && (
                <Item className="gap-2 cursor-pointer" onSelect={onCopyUrl}>
                    <LinkIcon className="h-4 w-4" />
                    <span>Copy URL</span>
                </Item>
            )}

            {data.totp_seed && (
                <Item className="gap-2 cursor-pointer" onSelect={onCopyTotp}>
                    <KeyRoundIcon className="h-4 w-4" />
                    <span>Copy TOTP Code</span>
                </Item>
            )}

            <Separator />

            <Item variant="destructive" className="gap-2 cursor-pointer text-destructive focus:text-destructive" onSelect={onDelete}>
                <div className="flex items-center gap-2 flex-1">
                    <Trash2Icon className="text-destructive h-4 w-4" />
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