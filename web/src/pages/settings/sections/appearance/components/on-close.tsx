import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

import { backendAPI as backend } from "@/lib/api"
import { Kbd } from "@/components/ui/kbd"
import { CircleQuestionMarkIcon, CircleXIcon, Minimize2Icon } from "lucide-react"

export const OnClose = () => {

    const [closeBehavior, setCloseBehavior] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {

        const fetchSettings = async () => {
            try {
                const behavior = await backend.getCloseBehavior()
                setCloseBehavior(behavior)
            } catch (error) {
                console.error("Error:", error)
                toast.error("The system configuration could not be loaded..")
            } finally {
                setIsLoading(false)
            }
        }

        fetchSettings()

    }, [])

    const handleCloseBehaviorChange = async (value: string) => {
        setCloseBehavior(value)
        try {
            const success = await backend.setCloseBehavior(value as 'ask' | 'minimize' | 'exit')
            if (success) {
                toast.success("Updated closing preference")
            } else {
                toast.error("Error saving preference")
            }
        } catch (error) {
            console.error("Error:", error)
            toast.error("System communication error")
        }
    }

    const data = [
        {
            label: "Always ask",
            value: "ask",
            icon: CircleQuestionMarkIcon
        },
        {
            label: "Minimize to tray",
            value: "minimize",
            icon: Minimize2Icon
        },
        {
            label: "Close application",
            value: "exit",
            icon: CircleXIcon
        }
    ]

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            
            <div className="space-y-1">
                <Label className="text-base">Closing behavior</Label>
                <p className="text-sm text-muted-foreground">What should the application do when you click the <Kbd>X</Kbd> on the window?</p>
            </div>
            
            <div className="w-full sm:w-48 shrink-0">
                {isLoading ? (
                    <Skeleton className="h-10 w-full rounded-md" />
                ) : (
                    <Select value={closeBehavior || "ask"} onValueChange={handleCloseBehaviorChange}>
                        
                        <SelectTrigger>
                            <SelectValue placeholder="Select action" />
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
                )}
            </div>

        </div>
    )
}
