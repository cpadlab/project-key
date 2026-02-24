import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

import { BreadcrumbRoute } from "../../components/breadcrumb-route"
import { SelectTheme } from "./components/select-theme"
import { OnClose } from "./components/on-close"

const AppearanceSettings = () => {
    return (
        <div className="space-y-4">
            
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <SidebarTrigger className="-ml-2" />
                    <BreadcrumbRoute page="Appearance" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Appearance and Behavior</h2>
                <p className="text-sm text-muted-foreground">Customize how the application looks and reacts.</p>
            </div>
            
            <Separator />

            <div className="space-y-4">
                <OnClose />
                <SelectTheme />
            </div>
            
        </div>
    )
}

export default AppearanceSettings