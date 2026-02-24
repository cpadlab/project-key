import { Label } from "@/components/ui/label"
import { NumberInput } from "@/components/ui/number-input"
import { toast } from "sonner"
import { backendAPI as backend } from "@/lib/api"

interface CleaningClipboardProps {
    value: number;
    onChange: (val: number) => void;
}

export const CleaningClipboard = ({ value, onChange }: CleaningClipboardProps) => {

    const handleClipboardIntervalSave = async () => {
        
        const safeVal = Math.max(5, value);
        
        if (safeVal !== value) {
            onChange(safeVal);
        }

        try {
            const success = await backend.setClipboardClearInterval(safeVal);
            if (success) {
                toast.success("Updated clipboard clear interval");
            } else {
                toast.error("Error saving preference");
            }
        } catch (error) {
            toast.error("System communication error");
        }
        
    }

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between max-w-3xl">
            <div className="space-y-1">
                <Label className="text-base" htmlFor="clipboard_interval">Clipboard Clearing (seconds)</Label>
                <p className="text-sm text-muted-foreground">Wait time before automatically clearing a copied password. (Minimum: 5s)</p>
            </div>
            <div className="w-full sm:w-32 shrink-0">
                <NumberInput id="clipboard_interval" min={5} value={value} onChange={(val) => onChange(val || 5)} onBlur={handleClipboardIntervalSave} />
            </div>
        </div>
    )
}