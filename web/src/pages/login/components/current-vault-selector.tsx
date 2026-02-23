import { useEffect, useState } from "react"
import { DatabaseIcon, FolderOpenIcon, ChevronDownIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { backendAPI } from "@/lib/api"
import { useVaultSelection } from "@/hooks/use-vault-selection"

interface HistoryItem {
    raw: string;
    display: string;
}

export const CurrentVaultSelector = () => {
    
    const [history, setHistory] = useState<HistoryItem[]>([])
    const [activeVault, setActiveVault] = useState<HistoryItem | null>(null)

    const loadHistory = async () => {
        const data = await backendAPI.getHistory()
        setHistory(data)
        if (data && data.length > 0) {
            setActiveVault(data[0]) 
        }
    }

    const { handleSelectVault, openFileSelector } = useVaultSelection(loadHistory)

    useEffect(() => {
        loadHistory()
    }, [])

    const onSelectHistoryItem = async (rawPath: string, isCurrent: boolean) => {
        if (!isCurrent) {
            await handleSelectVault(rawPath)
            loadHistory()
        }
    }

    if (!activeVault) return null

    const filename = activeVault.raw.split('\\').pop()?.split('/').pop() || activeVault.display

    return (
        <div className="flex flex-col items-center mb-2">
            <DropdownMenu>

                <DropdownMenuTrigger className="focus:outline-none">
                    <Badge className="px-3 py-1.5 flex items-center gap-2" variant="secondary">
                        <DatabaseIcon className="text-orange-500" />
                        <span className="truncate">{filename}</span>
                        <ChevronDownIcon className="text-muted-foreground ml-1" />
                    </Badge>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent align="center" className="w-72">
                    
                    <DropdownMenuLabel>Recent Vaults</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    {history.map((item, index) => {
                        const isCurrent = index === 0;
                        return (
                            <DropdownMenuItem key={item.raw} className="flex flex-col items-start cursor-pointer py-2" disabled={isCurrent} onClick={() => onSelectHistoryItem(item.raw, isCurrent)}>
                                <span className="font-medium text-sm">
                                    {item.raw.split('\\').pop()?.split('/').pop()}
                                    {isCurrent && <span className="ml-2 text-[10px] bg-orange-500/20 text-orange-500 px-1.5 py-0.5 rounded">Active</span>}
                                </span>
                                <span className="text-xs text-muted-foreground">{item.display}</span>
                            </DropdownMenuItem>
                        )
                    })}
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem className="cursor-pointer text-orange-500 focus:text-orange-600 focus:bg-orange-500/10" onClick={openFileSelector}>
                        <FolderOpenIcon className="w-4 h-4 text-orange-500 focus:text-orange-600" />
                        <span>Browse another vault...</span>
                    </DropdownMenuItem>

                </DropdownMenuContent>

            </DropdownMenu>
        </div>
    )
}