import { ChevronDownIcon, PlusIcon, Trash2Icon } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { ButtonGroup } from "../ui/button-group"
import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { backendAPI as backend } from "@/lib/api"
import { CreateNewVaultDialog } from "@/components/blocks/forms/create-new-vault"

type HistoryItem = {
    raw: string;
    display: string;
}

export const VaultSelector = () => {

    const navigate = useNavigate();
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

    const handleClearHistory = async () => {
        try {
            const success = await backend.clearHistory()
            if (success) {
                setHistory([])
                toast.success("History cleared successfully") 
            } else {
                toast.error("Failed to clear history") 
            }
        } catch (error) {
            console.error("Error:", error)
            toast.error("An error occurred while clearing history") 
        }
    }

    const handleSelectVault = async (path: string) => {
        try {
            const success = await backend.setFilePath(path);
            if (success) {
                navigate("/login");
            } else {
                toast.error("Could not select the vault file");
            }
        } catch (error) {
            console.error("Selection error:", error);
            toast.error("An unexpected error occurred");
        }
    }
    
    return (
        <div className="flex items-center gap-2 absolute left-2 top-2">

            <CreateNewVaultDialog>
                <Button size="sm" variant="default" className="cursor-pointer">
                    <PlusIcon />
                    <span>New vault</span>
                </Button>
            </CreateNewVaultDialog>

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
                                    <DropdownMenuItem onClick={() => handleSelectVault(item.raw)} key={index} className="cursor-pointer">{item.display}</DropdownMenuItem>
                                ))
                            ) : <DropdownMenuItem className="pointer-events-none" variant="destructive">No history</DropdownMenuItem>}
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={handleClearHistory} variant="destructive" className="cursor-pointer">
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
