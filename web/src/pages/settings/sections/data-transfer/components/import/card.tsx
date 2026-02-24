import { useState, useEffect } from "react"
import { UploadIcon, Settings2Icon, TableIcon, ShieldCheckIcon, KeyIcon, UserIcon, GlobeIcon, StickyNoteIcon } from "lucide-react"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

import { ImportPreviewDialog } from "./preview-dialog"
import { backendAPI as backend } from "@/lib/api"

const PRESETS = [
    { id: "chrome", name: "Google Chrome" },
    { id: "firefox", name: "Mozilla Firefox" },
    { id: "bitwarden", name: "Bitwarden" },
    { id: "keepass", name: "KeePass (CSV)" },
    { id: "others", name: "Others (Manual Mapping)" },
]

const FIELD_ICONS: Record<string, any> = {
    title: ShieldCheckIcon,
    password: KeyIcon,
    username: UserIcon,
    url: GlobeIcon,
    notes: StickyNoteIcon,
}

export const ImportCard = () => {

    const [filePath, setFilePath] = useState<string | null>(null)
    const [preset, setPreset] = useState<string>("chrome")
    const [targetGroup, setTargetGroup] = useState<string>("Personal")
    const [groups, setGroups] = useState<any[]>([])
    const [csvColumns, setCsvColumns] = useState<string[]>([])
    const [mapping, setMapping] = useState<Record<string, string[]>>({
        title: ["name", "none"], 
        username: ["username", "email"], 
        password: ["password", "none"], 
        url: ["url", "none"], 
        notes: ["note", "none"]
    })
    const [previewEntries, setPreviewEntries] = useState<any[]>([])
    const [isPreviewOpen, setIsPreviewOpen] = useState(false)

    useEffect(() => {
        backend.listGroups().then(setGroups)
    }, [])

    useEffect(() => {
        const loadColumns = async () => {
            if (preset === "others" && filePath) {
                try {
                    const cols = await backend.getCsvColumns(filePath);                    
                    if (cols && cols.length > 0) {
                        setCsvColumns(cols);
                    } else {
                        toast.error("No columns detected in the file.");
                    }
                } catch (err) {
                    toast.error("Communication error with the backend");
                }
            }
        };
        loadColumns();
    }, [preset, filePath]);

    const handleSelectFile = async () => {
        const path = await backend.selectImportFile()
        if (path) setFilePath(path)
    }

    const handleAnalyze = async () => {
        if (!filePath) return toast.error("Select a file")
        const loadingId = toast.loading("Analyzing data...")
        try {
            const cleanMapping = Object.keys(mapping).reduce((acc, key) => {
                acc[key] = mapping[key].map(val => val === "none" ? "" : val);
                return acc;
            }, {} as Record<string, string[]>);
            const data = await backend.previewCsvImport(filePath, preset === "others" ? "" : preset, preset === "others" ? cleanMapping : {})           
            if (data.length === 0) {
                toast.error("No entries found. Check your mapping.", { id: loadingId })
            } else {
                setPreviewEntries(data)
                setIsPreviewOpen(true)
                toast.dismiss(loadingId)
            }
        } catch (error) {
            toast.error("Error parsing CSV", { id: loadingId })
        }
    }

    return (
        <div className="space-y-4">
            
            <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 shadow-sm border border-blue-500/20">
                    <UploadIcon className="size-5" />
                </div>
                <div>
                    <h3 className="text-sm font-bold">Import Data</h3>
                    <p className="text-xs text-muted-foreground font-medium">Populate your vault from external CSV files.</p>
                </div>
            </div>

            <div className="space-y-4">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    <div className="space-y-2">
                        <Label className="text-[11px] font-bold uppercase tracking-wider opacity-70">Source File</Label>
                        <Button variant="outline" className="w-full h-10 truncate justify-start font-normal border-dashed hover:border-primary/50 transition-colors" onClick={handleSelectFile}>
                            <TableIcon className="size-4 mr-2 opacity-50" />
                            <span className="truncate">{filePath ? filePath.split(/[\\/]/).pop() : "Browse CSV file..."}</span>
                        </Button>
                    </div>
                    
                    <div className="space-y-2">
                        <Label className="text-[11px] font-bold uppercase tracking-wider opacity-70">Manager Preset</Label>
                        <Select value={preset} onValueChange={setPreset}>
                            <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {PRESETS.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>

                </div>

                {preset === "others" && filePath && (
                    <div className="p-5 rounded-2xl border bg-muted/20 space-y-4 animate-in fade-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm font-bold">
                                <Settings2Icon className="size-4 text-primary" /> 
                                <span>Manual Column Mapping</span>
                            </div>
                            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase">Dual Mapping Enabled</span>
                        </div>
                        {csvColumns.length === 0 ? (
                            <div className="py-10 text-center text-xs text-muted-foreground animate-pulse italic">
                                Scanning CSV structure...
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {Object.keys(FIELD_ICONS).map((field) => {
                                    const Icon = FIELD_ICONS[field];
                                    return (
                                        <div key={field} className="group space-y-2 p-3 rounded-xl bg-background border hover:border-primary/30 transition-all shadow-sm">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Icon className="size-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                                                <Label className="text-[10px] uppercase font-black tracking-tight">{field}</Label>
                                            </div>
                                            <div className="flex gap-1.5 mt-2">
                                                <Select value={mapping[field][0]} onValueChange={(val) => setMapping(prev => ({...prev, [field]: [val, prev[field][1]] }))}>
                                                    <SelectTrigger className="flex-1 font-medium border-muted shadow-none">
                                                        <SelectValue placeholder="Primary Column" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {csvColumns.map(col => <SelectItem key={col} value={col}>{col}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                                <div className="flex items-center gap-2 pl-2">
                                                    <Select value={mapping[field][1]} onValueChange={(val) => setMapping(prev => ({...prev, [field]: [prev[field][0], val] }))}>
                                                        <SelectTrigger className="opacity-60 italic bg-muted/30 border-none shadow-none focus:ring-0">
                                                            <SelectValue placeholder="Backup column (optional)" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="none">None</SelectItem>
                                                            {csvColumns.map(col => <SelectItem key={col} value={col}>{col}</SelectItem>)}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                )}

                <div className="space-y-2">
                    <Label className="text-[11px] font-bold uppercase tracking-wider opacity-70">Destination Group</Label>
                    <Select value={targetGroup} onValueChange={setTargetGroup}>
                        <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {groups.map(g => <SelectItem key={g.name} value={g.name}>{g.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>

                <Button className="w-full h-11 font-bold shadow-lg shadow-orange-500/10" disabled={!filePath} onClick={handleAnalyze}>
                    <span>Analyze & Preview Data</span>
                </Button>

                <ImportPreviewDialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen} data={previewEntries} targetGroup={targetGroup} />

            </div>
        </div>
    )
}