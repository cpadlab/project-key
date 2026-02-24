import { useState, useEffect } from "react"
import { DownloadIcon, FileJsonIcon, FileSpreadsheetIcon, ShieldAlertIcon, ArrowRightIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { backendAPI as backend } from "@/lib/api"
import type { GroupModel } from "@/global"

export const ExportCard = () => {

    const [format, setFormat] = useState<"csv" | "json">("csv")
    const [scope, setScope] = useState<string>("all")
    const [groups, setGroups] = useState<GroupModel[]>([])
    const [isExporting, setIsExporting] = useState(false)

    useEffect(() => {
        backend.listGroups().then(setGroups).catch(console.error)
    }, [])

    const handleExport = async () => {
        setIsExporting(true)
        const loadingId = toast.loading("Preparing export file...")
        
        try {
            const groupParam = scope === "all" ? undefined : scope
            const success = await backend.exportData(format, groupParam)
            
            if (success) {
                toast.success("Vault exported successfully!", { id: loadingId })
            } else {
                toast.error("Export failed or was cancelled.", { id: loadingId })
            }
        } catch (error) {
            toast.error("An error occurred during export.", { id: loadingId })
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <div className="gap-4">

            <div className="flex items-center gap-2">
                <div className="p-2 rounded-md bg-primary/10 text-primary">
                    <DownloadIcon className="size-5" />
                </div>
                <div className="text-sm">
                    <p><strong>Export Data</strong></p>
                    <p>Extract your credentials into an unencrypted file.</p>
                </div>
            </div>
            
            <div className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Target Format</Label>
                        <Select value={format} onValueChange={(v: any) => setFormat(v)}>
                            <SelectTrigger className="h-11">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="csv">
                                    <div className="flex items-center gap-2">
                                        <FileSpreadsheetIcon className="size-4 text-green-600" />
                                        <span>CSV Spreadsheet</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="json">
                                    <div className="flex items-center gap-2">
                                        <FileJsonIcon className="size-4 text-yellow-600" />
                                        <span>JSON Format</span>
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Data Scope</Label>
                        <Select value={scope} onValueChange={setScope}>
                            <SelectTrigger className="h-11">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Full Vault (All Groups)</SelectItem>
                                <Separator className="my-1" />
                                {groups.map(g => (
                                    <SelectItem key={g.name} value={g.name}>
                                        Group: {g.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex gap-4 p-4 rounded-xl border border-destructive/30 bg-destructive/5 items-start">
                    <div className="p-2 bg-destructive/10 rounded-full text-destructive shrink-0">
                        <ShieldAlertIcon className="size-5" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-bold text-destructive">Security Warning</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">The resulting file will contain all passwords in <strong>plain text</strong>. Anyone with access to this file can compromise your accounts. Please delete it immediately after use.</p>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button size="lg" className="w-full md:w-auto gap-2" onClick={handleExport} disabled={isExporting}>
                        {isExporting ? "Processing..." : "Generate Export"}
                        <ArrowRightIcon className="size-4" />
                    </Button>
                </div>

            </div>
        </div>
    )
}