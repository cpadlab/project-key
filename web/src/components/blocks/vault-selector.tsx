import { ChevronDownIcon, PlusIcon, Trash2Icon } from "lucide-react"
import { ButtonGroup } from "../ui/button-group"
import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { useEffect, useState } from "react"

import { backendAPI as backend } from "@/lib/api"

type HistoryItem = {
    raw: string;
    display: string;
}

export const VaultSelector = () => {

    const [history, setHistory] = useState<HistoryItem[]>([])

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const historyData = await backend.getHistory()
                setHistory(historyData)
            } catch (error) {
                console.error("Error al obtener el historial de bóvedas:", error)
            }
        }
        fetchHistory()
    }, [])
    
    return (
        <div className="flex items-center gap-2 absolute left-2 top-2">

            <Button size="sm" variant="default" className="cursor-pointer">
                <PlusIcon />
                <span>New vault</span>
            </Button>

            <ButtonGroup>

                <Button size="sm" variant="outline" className="cursor-pointer">
                    <span>Open</span>                    
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className="cursor-pointer" variant="outline" size="icon-sm" aria-label="More Options">
                            <ChevronDownIcon />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-40">
                        <DropdownMenuGroup>
                            {history.length > 0 ? (
                                history.map((item, index) => (
                                    <DropdownMenuItem key={index} className="cursor-pointer">{item.display}</DropdownMenuItem>
                                ))
                            ) : <DropdownMenuItem className="pointer-events-none" variant="destructive">No history</DropdownMenuItem>}
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem variant="destructive" className="cursor-pointer">
                                <Trash2Icon />
                                <span>Clear history</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

            </ButtonGroup>
        </div>
    )
}
