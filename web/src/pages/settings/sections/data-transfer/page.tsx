import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

import { BreadcrumbRoute } from "../../components/breadcrumb-route"
import { ExportCard } from "./components/export"

const DataTransferSettings = () => {

    return (
        <div className="space-y-4">
            
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <SidebarTrigger />
                    <BreadcrumbRoute page="Data Transfer" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Data transfer</h2>
                <p className="text-sm text-muted-foreground">Technical system configurations and diagnostics.</p>
            </div>

            <Separator />

            <div className="space-y-4">
                <ExportCard />
            </div>
        </div>
    )
}

export default DataTransferSettings