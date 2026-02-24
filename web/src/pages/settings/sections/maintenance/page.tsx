import { useEffect, useState } from "react"
import { toast } from "sonner"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

import { backendAPI as backend } from "@/lib/api"
import { BreadcrumbRoute } from "../../components/breadcrumb-route"
import { RecycleBinRetention } from "./componentes/recycle-bin-retention"
import { BackupMaxCount } from "./componentes/backup-max-count"
import { ServicesInterval } from "./componentes/services-interval"

const MaintenanceSettings = () => {

    const [settings, setSettings] = useState({
        recycle_bin_retention_days: 15,
        backup_max_count: 5,
        other_services_interval: 60
    })
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await backend.getMaintenanceSettings()
                setSettings(data)
            } catch (error) {
                console.error("Error:", error)
                toast.error("Could not load maintenance settings")
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
                    <BreadcrumbRoute page="Maintenance" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Data and Maintenance</h2>
                <p className="text-sm text-muted-foreground">Manage recycle bin, backups, and background task frequency.</p>
            </div>
            
            <Separator />

            <div className="space-y-4">
                {isLoading ? (
                    <>
                        <Skeleton className="h-16 w-full max-w-3xl" />
                        <Skeleton className="h-16 w-full max-w-3xl" />
                        <Skeleton className="h-16 w-full max-w-3xl" />
                    </>
                ) : (
                    <>
                        <RecycleBinRetention value={settings.recycle_bin_retention_days} onChange={(val) => setSettings(p => ({ ...p, recycle_bin_retention_days: val }))} />
                        <BackupMaxCount value={settings.backup_max_count} onChange={(val) => setSettings(p => ({ ...p, backup_max_count: val }))} />
                        <ServicesInterval value={settings.other_services_interval} onChange={(val) => setSettings(p => ({ ...p, other_services_interval: val }))} />
                    </>
                )}
            </div>
        </div>
    )
}

export default MaintenanceSettings