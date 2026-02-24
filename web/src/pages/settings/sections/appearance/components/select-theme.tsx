import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react"

import { useTheme } from "@/contexts/theme-context"


export const SelectTheme = () => {

    const { theme, setTheme } = useTheme()

    const data = [
        {
            icon: SunIcon,
            label: "Light",
            value: "light"
        },
        {
            icon: MoonIcon,
            label: "Dark",
            value: "dark"
        },
        {
            icon: MonitorIcon,
            label: "System",
            value: "system"
        }
    ]

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            
            <div className="space-y-1">
                <Label className="text-base">Interface Theme</Label>
                <p className="text-sm text-muted-foreground">Switch between light, dark, or the system's default mode.</p>
            </div>

            <div className="w-full sm:w-48 shrink-0">
                <Select value={theme} onValueChange={(val: "light" | "dark" | "system") => setTheme(val)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona un tema" />
                    </SelectTrigger>
                    <SelectContent>
                        {data.map((item, index) => (
                            <SelectItem key={index} value={item.value}>
                                <div className="flex items-center gap-2">
                                    <item.icon className="size-4" />
                                    <span>{item.label}</span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

        </div>
    )
}
