import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import { useTheme } from "@/contexts/theme-context"

export const SelectTheme = () => {

    const { theme, setTheme } = useTheme()

    return (
        <div className="space-y-4">
            
            <div className="space-y-1">
                <Label className="text-base">Interface Theme</Label>
                <p className="text-sm text-muted-foreground">
                    Switch between light, dark, or the system's default mode.
                </p>
            </div>

            <RadioGroup value={theme} onValueChange={(val: "light" | "dark" | "system") => setTheme(val)} className="grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
                
                <label className="[&:has([data-state=checked])>div]:border-primary flex-col cursor-pointer group">
                    <RadioGroupItem value="light" className="sr-only" />
                    <div className="group-hover:border-accent items-center rounded-lg border-2 border-transparent bg-popover p-1 transition-colors">
                        <div className="space-y-2 rounded-lg bg-[#ecedef] p-2">
                            <div className="space-y-2 rounded-md bg-white p-2 shadow-xs">
                                <div className="h-2 w-20 rounded-lg bg-[#ecedef]" />
                                <div className="h-2 w-25 rounded-lg bg-[#ecedef]" />
                            </div>
                            <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-xs">
                                <div className="h-4 w-4 rounded-full bg-[#ecedef] shrink-0" />
                                <div className="h-2 w-25 rounded-lg bg-[#ecedef]" />
                            </div>
                            <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-xs">
                                <div className="h-4 w-4 rounded-full bg-[#ecedef] shrink-0" />
                                <div className="h-2 w-25 rounded-lg bg-[#ecedef]" />
                            </div>
                        </div>
                    </div>
                    <span className="block w-full p-2 text-center text-sm font-medium">Light</span>
                </label>

                <label className="[&:has([data-state=checked])>div]:border-primary flex-col cursor-pointer group">
                    <RadioGroupItem value="dark" className="sr-only" />
                    <div className="group-hover:border-accent items-center rounded-lg border-2 border-transparent bg-popover p-1 transition-colors">
                        <div className="space-y-2 rounded-lg bg-neutral-950 p-2">
                            <div className="space-y-2 rounded-md bg-neutral-800 p-2 shadow-xs">
                                <div className="h-2 w-20 rounded-lg bg-neutral-400" />
                                <div className="h-2 w-25 rounded-lg bg-neutral-400" />
                            </div>
                            <div className="flex items-center space-x-2 rounded-md bg-neutral-800 p-2 shadow-xs">
                                <div className="h-4 w-4 rounded-full bg-neutral-400 shrink-0" />
                                <div className="h-2 w-25 rounded-lg bg-neutral-400" />
                            </div>
                            <div className="flex items-center space-x-2 rounded-md bg-neutral-800 p-2 shadow-xs">
                                <div className="h-4 w-4 rounded-full bg-neutral-400 shrink-0" />
                                <div className="h-2 w-25 rounded-lg bg-neutral-400" />
                            </div>
                        </div>
                    </div>
                    <span className="block w-full p-2 text-center text-sm font-medium">Dark</span>
                </label>

                <label className="[&:has([data-state=checked])>div]:border-primary flex-col cursor-pointer group">
                    <RadioGroupItem value="system" className="sr-only" />
                    <div className="group-hover:border-accent items-center rounded-lg border-2 border-transparent bg-popover p-1 transition-colors">
                        <div className="flex overflow-hidden rounded-lg bg-[#ecedef] h-33">
                            
                            <div className="w-1/2 p-2 space-y-2 border-r border-neutral-200">
                                <div className="space-y-2 rounded-md bg-white p-2 shadow-xs">
                                    <div className="h-2 w-10 rounded-lg bg-[#ecedef]" />
                                    <div className="h-2 w-full rounded-lg bg-[#ecedef]" />
                                </div>
                                <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-xs">
                                    <div className="h-4 w-4 rounded-full bg-[#ecedef] shrink-0" />
                                    <div className="h-2 w-full rounded-lg bg-[#ecedef]" />
                                </div>
                                <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-xs">
                                    <div className="h-4 w-4 rounded-full bg-[#ecedef] shrink-0" />
                                    <div className="h-2 w-full rounded-lg bg-[#ecedef]" />
                                </div>
                            </div>
                            
                            <div className="w-1/2 p-2 space-y-2 bg-neutral-950">
                                <div className="space-y-2 rounded-md bg-neutral-800 p-2 shadow-xs">
                                    <div className="h-2 w-10 rounded-lg bg-neutral-400" />
                                    <div className="h-2 w-full rounded-lg bg-neutral-400" />
                                </div>
                                <div className="flex items-center space-x-2 rounded-md bg-neutral-800 p-2 shadow-xs">
                                    <div className="h-4 w-4 rounded-full bg-neutral-400 shrink-0" />
                                    <div className="h-2 w-full rounded-lg bg-neutral-400" />
                                </div>
                                <div className="flex items-center space-x-2 rounded-md bg-neutral-800 p-2 shadow-xs">
                                    <div className="h-4 w-4 rounded-full bg-neutral-400 shrink-0" />
                                    <div className="h-2 w-full rounded-lg bg-neutral-400" />
                                </div>
                            </div>
                            
                        </div>
                    </div>
                    <span className="block w-full p-2 text-center text-sm font-medium">System</span>
                </label>

            </RadioGroup>

        </div>
    )
}