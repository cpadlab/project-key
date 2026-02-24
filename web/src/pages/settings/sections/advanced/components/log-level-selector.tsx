import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { TerminalIcon, BugIcon, InfoIcon, AlertTriangleIcon, AlertCircleIcon, ShieldAlertIcon } from "lucide-react"

import { backendAPI as backend } from "@/lib/api"

interface LogLevelSelectorProps {
    value: string;
    onChange: (val: string) => void;
}

export const LogLevelSelector = ({ value, onChange }: LogLevelSelectorProps) => {

    const levels = [
        { value: "debug", label: "Debug", icon: BugIcon, color: "text-blue-500" },
        { value: "info", label: "Info", icon: InfoIcon, color: "text-green-500" },
        { value: "warning", label: "Warning", icon: AlertTriangleIcon, color: "text-yellow-500" },
        { value: "error", label: "Error", icon: AlertCircleIcon, color: "text-orange-500" },
        { value: "critical", label: "Critical", icon: ShieldAlertIcon, color: "text-red-500" },
    ]

    const handleSave = async (newLevel: string) => {
        onChange(newLevel);
        try {
            const success = await backend.setLogLevel(newLevel);
            if (success) {
                toast.success(`Log level changed to ${newLevel}`);
            } else {
                toast.error("Error saving settings");
            }
        } catch (error) {
            toast.error("System communication error");
        }
    }

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between max-w-3xl">
            <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <TerminalIcon className="size-4 text-muted-foreground" />
                    <Label className="text-base" htmlFor="log_level">Log Level</Label>
                </div>
                <p className="text-sm text-muted-foreground">Level of detail to be saved in the log files.</p>
            </div>

            <div className="w-full sm:w-48 shrink-0">
                <Select value={value} onValueChange={handleSave}>
                    <SelectTrigger id="log_level">
                        <SelectValue placeholder="Selecciona un nivel" />
                    </SelectTrigger>
                    <SelectContent>
                        {levels.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                                <div className="flex items-center gap-2">
                                    <level.icon className={`size-4 ${level.color}`} />
                                    <span>{level.label}</span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

        </div>
    )
}