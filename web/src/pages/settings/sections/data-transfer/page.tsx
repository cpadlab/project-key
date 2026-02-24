import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

import { BreadcrumbRoute } from "../../components/breadcrumb-route"
import { ExportCard } from "./components/export"
import { ImportCard } from "./components/import/card"

const DataTransferSettings = () => {

    return (
        <div className="space-y-4">
            
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <SidebarTrigger />
                    <BreadcrumbRoute page="Data Transfer" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Data transfer</h2>
                <p className="text-sm text-muted-foreground">Import entries from other password managers or export your vault data to portable formats.</p>
            </div>

            <Separator />

            <div className="space-y-4">
                <ImportCard />
                <div className="flex items-center gap-4">
                    <Separator className="flex-1" />
                    <span className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Danger Zone</span>
                    <Separator className="flex-1" />
                </div>
                <ExportCard />
            </div>
        </div>
    )
}

export default DataTransferSettings