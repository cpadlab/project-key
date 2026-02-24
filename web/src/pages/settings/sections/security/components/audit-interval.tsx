import { Label } from "@/components/ui/label"
import { NumberInput } from "@/components/ui/number-input"
import { toast } from "sonner"
import { backendAPI as backend } from "@/lib/api"

interface AuditIntervalProps {
    value: number;
    onChange: (val: number) => void;
}

export const AuditInterval = ({ value, onChange }: AuditIntervalProps) => {

    const handlePasswordIntervalSave = async () => {

        const safeVal = Math.max(10, value);

        if (safeVal !== value) {
            onChange(safeVal);
        }

        try {
            const success = await backend.setPasswordAuditInterval(safeVal);
            if (success) {
                toast.success("Updated password audit interval")
            } else {
                toast.error("Error saving preference")
            }
        } catch (error) {
            toast.error("System communication error")
        }
        
    }

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between max-w-3xl">
            <div className="space-y-1">
                <Label className="text-base" htmlFor="password_interval">Password Audit Interval (seconds)</Label>
                <p className="text-sm text-muted-foreground">How often weak or duplicate passwords are scanned. (Minimum: 10s)</p>
            </div>
            <div className="w-full sm:w-32 shrink-0">
                <NumberInput id="password_interval" min={10} value={value} onChange={(val) => onChange(val || 10)} onBlur={handlePasswordIntervalSave} />
            </div>
        </div>
    )
}