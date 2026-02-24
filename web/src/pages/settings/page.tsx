
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

import { settingsNav } from "./components/leftbar"
import { Link } from "react-router-dom"

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

            <div className="grid grid-cols-3 gap-4">
                {settingsNav.map((item, index) => (
                    <Link to={item.href} key={index} className="gap-2 text-sm font-semibold px-6 py-4 bg-card flex items-center justify-center cursor-pointer rounded-sm hover:bg-card/70 transition-all duration-300 border">
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                    </Link>
                ))}
            </div>

        </div>
    )
}

export default SettingsPage