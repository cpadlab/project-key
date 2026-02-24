import { useEffect, useState } from "react"
import { toast } from "sonner"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

import { backendAPI as backend } from "@/lib/api"
import { BreadcrumbRoute } from "../../components/breadcrumb-route"
import { LogLevelSelector } from "./components/log-level-selector"

const AdvancedSettings = () => {

    const [logLevel, setLogLevel] = useState<string>("info")
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {

        const fetchSettings = async () => {
            try {
                const level = await backend.getLogLevel()
                setLogLevel(level)
            } catch (error) {
                console.error("Error:", error)
                toast.error("Advanced settings could not be loaded")
            } finally {
                setIsLoading(false)
            }
        }
        
        fetchSettings()

    }, [])

    return (
        <div className="space-y-4">
            
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <SidebarTrigger />
                    <BreadcrumbRoute page="Advanced" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Advanced</h2>
                <p className="text-sm text-muted-foreground">Technical system configurations and diagnostics.</p>
            </div>

            <Separator />

            <div className="space-y-4">
                {isLoading ? (
                    <Skeleton className="h-16 w-full max-w-3xl" />
                ) : (
                    <LogLevelSelector value={logLevel} onChange={setLogLevel} />
                )}
            </div>
        </div>
    )
}

export default AdvancedSettings