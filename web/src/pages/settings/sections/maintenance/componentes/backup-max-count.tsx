import { Label } from "@/components/ui/label"
import { NumberInput } from "@/components/ui/number-input"
import { toast } from "sonner"

import { backendAPI as backend } from "@/lib/api"

interface BackupMaxCountProps {
    value: number;
    onChange: (val: number) => void;
}

export const BackupMaxCount = ({ value, onChange }: BackupMaxCountProps) => {

    const handleSave = async () => {

        const safeVal = Math.max(1, Math.min(20, value));
        if (safeVal !== value) onChange(safeVal);

        try {
            const success = await backend.setBackupMaxCount(safeVal);
            if (success) toast.success("Backup limit updated");
            else toast.error("Error saving preference");
        } catch (error) {
            toast.error("System communication error");
        }
    }

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between max-w-3xl">
            <div className="space-y-1">
                <Label className="text-base" htmlFor="backup_count">Backup Limit</Label>
                <p className="text-sm text-muted-foreground">Maximum number of automatic backups to keep. (Range: 1-20)</p>
            </div>
            <div className="w-full sm:w-32 shrink-0">
                <NumberInput id="backup_count" min={1} max={20} value={value} onChange={(val) => onChange(val || 1)} onBlur={handleSave} />
            </div>
        </div>
    )
}