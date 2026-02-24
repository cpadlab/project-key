import { Label } from "@/components/ui/label"
import { NumberInput } from "@/components/ui/number-input"
import { toast } from "sonner"

import { backendAPI as backend } from "@/lib/api"

interface ServicesIntervalProps {
    value: number;
    onChange: (val: number) => void;
}

export const ServicesInterval = ({ value, onChange }: ServicesIntervalProps) => {

    const handleSave = async () => {

        const safeVal = Math.max(30, value);
        if (safeVal !== value) onChange(safeVal);

        try {
            const success = await backend.setOtherServicesInterval(safeVal);
            if (success) toast.success("Background services interval updated");
            else toast.error("Error saving preference");
        } catch (error) {
            toast.error("System communication error");
        }
    }

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between max-w-3xl">
            <div className="space-y-1">
                <Label className="text-base" htmlFor="services_interval">Background Services (seconds)</Label>
                <p className="text-sm text-muted-foreground">How often background tasks like cleanup and sync are executed. (Min: 30s)</p>
            </div>
            <div className="w-full sm:w-32 shrink-0">
                <NumberInput id="services_interval" min={30} value={value} onChange={(val) => onChange(val || 30)} onBlur={handleSave} />
            </div>
        </div>
    )
}