import { Label } from "@/components/ui/label"
import { NumberInput } from "@/components/ui/number-input"
import { toast } from "sonner"

import { backendAPI as backend } from "@/lib/api"

interface RecycleBinRetentionProps {
    value: number;
    onChange: (val: number) => void;
}

export const RecycleBinRetention = ({ value, onChange }: RecycleBinRetentionProps) => {

    const handleSave = async () => {

        const safeVal = Math.max(1, value);
        if (safeVal !== value) onChange(safeVal);

        try {
            const success = await backend.setRecycleBinRetentionDays(safeVal);
            if (success) toast.success("Recycle bin retention updated");
            else toast.error("Error saving preference");
        } catch (error) {
            toast.error("System communication error");
        }
    }

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between max-w-3xl">
            <div className="space-y-1">
                <Label className="text-base" htmlFor="recycle_days">Recycle Bin Retention (days)</Label>
                <p className="text-sm text-muted-foreground">Number of days deleted items are kept before being permanently purged.</p>
            </div>
            <div className="w-full sm:w-32 shrink-0">
                <NumberInput id="recycle_days" min={1} value={value} onChange={(val) => onChange(val || 1)} onBlur={handleSave} />
            </div>
        </div>
    )
}