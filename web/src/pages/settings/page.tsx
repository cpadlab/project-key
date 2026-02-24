
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

import { settingsNav } from "./components/leftbar"
import { Link } from "react-router-dom"
import { VersionBadge } from "@/components/blocks/version-badge"

const SettingsPage = () => {
    return (
        <div className="space-y-4">
            
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <SidebarTrigger />
                    <h2 className="text-2xl font-bold">Settings</h2>
                </div>
                
            </div>
            
            <Separator />

            <div className="grid sm:grid-cols-3 gap-4">
                {settingsNav.map((item, index) => (
                    <Link to={item.href} key={index} className="gap-4 text-sm font-semibold px-6 py-4 bg-card flex items-center cursor-pointer rounded-sm hover:bg-card/70 transition-all duration-300 border">
                        <div className="rounded-full bg-primary/10 p-2 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                            <item.icon className="size-4" />
                        </div>
                        <span>{item.title}</span>
                    </Link>
                ))}
            </div>

            <VersionBadge />

        </div>
    )
}

export default SettingsPage