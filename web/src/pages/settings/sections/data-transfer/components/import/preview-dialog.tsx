import { ImportDataTable } from "./table/table"
import { columns } from "./table/columns"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { CheckCircle2Icon, AlertCircleIcon } from "lucide-react"

import { backendAPI as backend } from "@/lib/api"

export function ImportPreviewDialog({ open, onOpenChange, data, targetGroup }: any) {
    
    const handleConfirmImport = async () => {
        const loadingId = toast.loading(`Importing ${data.length} entries to ${targetGroup}...`)
        try {
            const results = await backend.runImport(data, targetGroup)
            
            if (results.success > 0) {
                toast.success(`Done! ${results.success} entries added.`, { 
                    id: loadingId,
                    description: results.failed > 0 ? `${results.failed} failed to import.` : undefined 
                })
                window.dispatchEvent(new CustomEvent('vault-changed'))
                onOpenChange(false)
            } else {
                toast.error("Import failed. No entries were added.", { id: loadingId })
            }
        } catch (error) {
            toast.error("Critical error during import execution", { id: loadingId })
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-225 max-h-[85vh] flex flex-col p-0 overflow-hidden">
                
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="text-xl">Review Imported Data</DialogTitle>
                    <DialogDescription>We found <strong>{data.length} entries</strong>. Please verify the mapping below before adding them to the <strong>{targetGroup}</strong> group.</DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-6 py-2">
                    <ImportDataTable columns={columns} data={data} />
                </div>

                <div className="p-6 flex items-center justify-between bg-muted/40 border-t">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground max-w-100">
                        <AlertCircleIcon className="size-4 text-amber-500 shrink-0" />
                        <span>Entries with existing titles and usernames will be automatically tagged to avoid data loss.</span>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="ghost" onClick={() => onOpenChange(false)}>
                            <span>Cancel</span>
                        </Button>
                        <Button onClick={handleConfirmImport} className="px-8">
                            <CheckCircle2Icon className="size-4" /> 
                            <span>Import All Entries</span>
                        </Button>
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    )
}