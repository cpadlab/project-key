import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

import { backendAPI as backend } from "@/lib/api"
import { HIBPDialog } from "./dialog";

interface HIBPProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
}

export const HIBP = ({ checked, onChange }: HIBPProps) => {

    const handlePwnedChange = async (newChecked: boolean) => {
        onChange(newChecked)
        try {
            const success = await backend.setPwnedAuditEnabled(newChecked)
            if (success) {
                toast.success("Updated HIBP audit")
            } else {
                toast.error("Error saving preference")
            }
        } catch (error) {
            toast.error("System communication error")
        }
    }

    return (
        <div className="space-y-1 rounded-md border p-4 shadow-sm max-w-3xl">
            <div className="flex items-center gap-2">
                <Checkbox id="pwned_audit" checked={checked} onCheckedChange={(val) => handlePwnedChange(val as boolean)} />
                <Label htmlFor="pwned_audit" className="cursor-pointer text-base">Breach Audit (HIBP)</Label>
                <HIBPDialog />
            </div>
            <p className="text-sm text-muted-foreground">Automatically check if your passwords have been leaked online.</p>
        </div>
    )
}