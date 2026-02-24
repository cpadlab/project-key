import { useState, useEffect } from "react"
import { UploadIcon, Settings2Icon, TableIcon } from "lucide-react"
import { toast } from "sonner"
import { backendAPI as backend } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

import { ImportPreviewDialog } from "./preview-dialog"

const PRESETS = [
    { id: "chrome", name: "Google Chrome" },
    { id: "firefox", name: "Mozilla Firefox" },
    { id: "bitwarden", name: "Bitwarden" },
    { id: "keepass", name: "KeePass (CSV)" },
    { id: "others", name: "Others (Manual Mapping)" }, //
]

export const ImportCard = () => {

    const [filePath, setFilePath] = useState<string | null>(null)
    const [preset, setPreset] = useState<string>("chrome")
    const [targetGroup, setTargetGroup] = useState<string>("Personal")
    const [groups, setGroups] = useState<any[]>([])
    const [csvColumns, setCsvColumns] = useState<string[]>([])
    const [mapping, setMapping] = useState<Record<string, string>>({
        title: "", username: "", password: "", url: "", notes: ""
    })
    const [previewEntries, setPreviewEntries] = useState<any[]>([])
    const [isPreviewOpen, setIsPreviewOpen] = useState(false)

    useEffect(() => {
        backend.listGroups().then(setGroups)
    }, [])

    useEffect(() => {
        if (preset === "others" && filePath) {
            backend.getCsvColumns(filePath).then(setCsvColumns)
        }
    }, [preset, filePath])

    const handleSelectFile = async () => {
        const path = await backend.selectImportFile()
        if (path) setFilePath(path)
    }

    useEffect(() => {
        
        const loadColumns = async () => {
            if (preset === "others" && filePath) {
                try {
                    const cols = await backend.getCsvColumns(filePath);                    
                    if (cols && cols.length > 0) {
                        setCsvColumns(cols);
                    } else {
                        toast.error("No columns were detected in the file..");
                    }
                } catch (err) {
                    console.error("Error:", err);
                    toast.error("Communication error with the backend");
                }
            }
        };

        loadColumns();

    }, [preset, filePath]);

    const handleAnalyze = async () => {
        if (!filePath) return toast.error("Select a file")
        const loadingId = toast.loading("Analyzing data...")
        try {
            const data = await backend.previewCsvImport(filePath, preset === "others" ? "" : preset, preset === "others" ? mapping : {})
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

            <div className="flex items-center gap-2">
                <div className="p-2 rounded-md bg-blue-500/10 text-blue-500">
                    <UploadIcon className="size-5" />
                </div>
                <div>
                    <p className="text-sm"><strong>Import Data</strong></p>
                    <p className="text-sm">Populate your vault from external CSV files.</p>
                </div>
            </div>

            <div className="space-y-4">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Source File</Label>
                        <Button variant="outline" className="w-full truncate justify-start font-normal" onClick={handleSelectFile}>
                            <TableIcon className="size-4 opacity-50" />
                            <p className="truncate">{filePath ? filePath.split(/[\\/]/).pop() : "Browse CSV..."}</p>
                        </Button>
                    </div>
                    <div className="space-y-2">
                        <Label>Manager Preset</Label>
                        <Select value={preset} onValueChange={setPreset}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {PRESETS.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {preset === "others" && filePath && (
                    <div className="p-4 rounded-xl border bg-muted/30 space-y-4 animate-in slide-in-from-top-2">
                        <div className="flex items-center gap-2 text-sm font-semibold">
                            <Settings2Icon className="size-4" /> 
                            <span>Manual Column Mapping</span>
                        </div>
                        {csvColumns.length === 0 ? (
                            <div className="text-xs text-muted-foreground animate-pulse italic">Loading columns from CSV...</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {["title", "password", "username", "url", "notes"].map((field) => (
                                    <div key={field} className="space-y-1">
                                        <Label className="text-[10px] uppercase opacity-60">
                                            {field} {field === 'title' || field === 'password' ? '*' : ''}
                                        </Label>
                                        <Select value={mapping[field]} onValueChange={(val) => setMapping(prev => ({...prev, [field]: val}))}>
                                            <SelectTrigger className="h-8 text-xs">
                                                <SelectValue placeholder="Seleccionar columna..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {csvColumns.map((col) => (
                                                    <SelectItem key={`${field}-${col}`} value={col}>
                                                        {col}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <div className="space-y-2">
                    <Label>Destination Group</Label>
                    <Select value={targetGroup} onValueChange={setTargetGroup}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {groups.map(g => <SelectItem key={g.name} value={g.name}>{g.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>

                <Button className="w-full" disabled={!filePath} onClick={handleAnalyze}>
                    <span>Analyze CSV Data</span>
                </Button>

                <ImportPreviewDialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen} data={previewEntries} targetGroup={targetGroup} />

            </div>
        </div>
    )
}