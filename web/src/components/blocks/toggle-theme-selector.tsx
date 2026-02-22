import { EllipsisVerticalIcon, MonitorIcon, MoonIcon, SunIcon } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Button } from "../ui/button"

import { useTheme } from "@/contexts/theme-context"

const theme_options = [
    {
        label: "Dark",
        value: "dark",
        icon: MoonIcon
    },
    {
        label: "Light",
        value: "light",
        icon: SunIcon
    },
    {
        label: "System",
        value: "system",
        icon: MonitorIcon
    }
] as const;

export const ToggleThemeSelector = () => {

    const { theme, setTheme } = useTheme();

    return (
        <div className="absolute right-2 top-2">
            <DropdownMenu>
                
                <DropdownMenuTrigger asChild>
                    <Button size="icon-sm" variant="outline">
                        <EllipsisVerticalIcon />
                    </Button>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent align="end">
                    <DropdownMenuGroup>
                        <DropdownMenuLabel>Theme</DropdownMenuLabel>
                        {theme_options.map((option) => (
                            <DropdownMenuItem key={option.value} onClick={() => setTheme(option.value)} className="flex items-center gap-2 cursor-pointer">
                                <option.icon className={`h-4 w-4 ${theme === option.value && "text-primary"}`} />
                                <span className={`${theme === option.value && "text-primary"}`}>{option.label}</span>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuGroup>
                </DropdownMenuContent>

            </DropdownMenu>
        </div>
    )
}
