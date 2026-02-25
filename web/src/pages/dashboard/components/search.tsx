
import { useState, useEffect } from "react"
import { SearchIcon, KeyIcon, FolderIcon, SettingsIcon, PaletteIcon, ShieldCheckIcon, HardDriveIcon, MonitorCheckIcon, DownloadIcon, UploadIcon, Trash2Icon, FileTextIcon, HistoryIcon} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { ScrollArea } from "@/components/ui/scroll-area"

import { useGroup } from "@/contexts/group-context"
import { backendAPI as backend } from "@/lib/api"
import { useAppNavigate } from "@/hooks/use-app-navigate"

const SETTINGS_COMMANDS = [
    { title: "Close Behavior", path: "/settings/appearance", icon: SettingsIcon, keywords: "close exit minimize" },
    { title: "Theme / Appearance", path: "/settings/appearance", icon: PaletteIcon, keywords: "dark light mode theme" },
    { title: "HIBP / Pwned Audit", path: "/settings/security", icon: ShieldCheckIcon, keywords: "hibp pwned security leak" },
    { title: "Audit Interval", path: "/settings/security", icon: HistoryIcon, keywords: "audit time password routine" },
    { title: "Clipboard Timeout", path: "/settings/security", icon: FileTextIcon, keywords: "copy clear clipboard" },
    { title: "Import Data (CSV)", path: "/settings/data-transfer", icon: UploadIcon, keywords: "import chrome bitwarden keepass" },
    { title: "Export Data (JSON/CSV)", path: "/settings/data-transfer", icon: DownloadIcon, keywords: "export save backup plain" },
    { title: "Backup Limits", path: "/settings/maintenance", icon: HardDriveIcon, keywords: "backup count max maintenance" },
    { title: "Recycle Bin Retention", path: "/settings/maintenance", icon: Trash2Icon, keywords: "trash delete recycle bin days" },
    { title: "Services Interval", path: "/settings/maintenance", icon: MonitorCheckIcon, keywords: "maintenance background services" },
    { title: "Log Level", path: "/settings/advanced", icon: FileTextIcon, keywords: "log level debug info error" },
    { title: "Open Log Folder", path: "/settings/advanced", icon: FolderIcon, keywords: "folder log directory" },
    { title: "Open Backup Folder", path: "/settings/advanced", icon: FolderIcon, keywords: "folder backup directory" },
    { title: "Open History Folder", path: "/settings/advanced", icon: FolderIcon, keywords: "folder history directory" },
]

export const Search = () => {
    
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState("")
    const [entries, setEntries] = useState<any[]>([])
    const { groups, setActiveGroup } = useGroup()
    const { navigate } = useAppNavigate()

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "s" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    useEffect(() => {
        if (!query.trim()) { setEntries([]); return }
        const delay = setTimeout(async () => {
            const results = await backend.searchEntries(query)
            setEntries(results)
        }, 150)
        return () => clearTimeout(delay)
    }, [query])

    const filteredGroups = groups.filter(g => 
        g.name.toLowerCase().includes(query.toLowerCase())
    )

    const filteredSettings = SETTINGS_COMMANDS.filter(s => 
        s.title.toLowerCase().includes(query.toLowerCase()) || 
        s.keywords.includes(query.toLowerCase())
    )

    return (
        <>
            <Button size="sm" variant="outline" className="relative justify-start flex-1" onClick={() => setOpen(true)}>
                <SearchIcon className="h-4 w-4 opacity-50" />
                <span className="opacity-50">Search...</span>
                <Kbd className="absolute right-1.5 top-1/2 -translate-y-1/2">Ctrl + S</Kbd>
            </Button>

            <CommandDialog open={open} onOpenChange={setOpen} shouldFilter={false}>

                <CommandInput placeholder="Type to search..." value={query} onValueChange={setQuery} />

                <CommandList className="max-h-none overflow-hidden">
                    
                    <CommandEmpty>No results found.</CommandEmpty>
                    <ScrollArea className="h-80">
                        
                        {entries.length > 0 && (
                            <CommandGroup heading="Keys">
                                {entries.map((e) => (
                                    <CommandItem key={e.uuid} onSelect={() => { navigate(`/entry/${e.uuid}`); setOpen(false) }}>
                                        <KeyIcon className="mr-2 h-4 w-4" />
                                        <span>{e.title}</span>
                                        <span className="ml-2 text-xs text-muted-foreground">{e.username}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}
                        
                        {filteredGroups.length > 0 && (
                            <CommandGroup heading="Groups">
                                {filteredGroups.map((g) => (
                                    <CommandItem key={g.name} onSelect={() => { setActiveGroup(g.name); navigate("/dashboard"); setOpen(false) }}>
                                        <FolderIcon className="mr-2 h-4 w-4" />
                                        <span>{g.name}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}

                        {filteredSettings.length > 0 && (
                            <CommandGroup heading="Settings & Actions">
                                {filteredSettings.map((s) => (
                                    <CommandItem key={s.title} onSelect={() => { navigate(s.path); setOpen(false) }}>
                                        <s.icon className="mr-2 h-4 w-4 text-primary" />
                                        <span>{s.title}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}

                    </ScrollArea>
                </CommandList>
            </CommandDialog>
        </>
    )
}