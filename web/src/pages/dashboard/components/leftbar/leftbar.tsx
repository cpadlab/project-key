import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { LogOutIcon, PlusIcon, Settings2Icon, ShieldCheckIcon, ChevronRight, PaletteIcon, HardDriveIcon, MonitorCheckIcon, SettingsIcon} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,SidebarMenuSub,SidebarMenuSubItem, SidebarMenuSubButton } from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"

import { CreateGroupDialog } from "./forms/create-new-group"
import { backendAPI as backend } from '@/lib/api'
import type { GroupModel } from "@/global"
import GroupCard from "./cards/group-card/card"

const settingsSubItems = [
    { title: "Appearance", href: "/settings/appearance", icon: PaletteIcon },
    { title: "Security", href: "/settings/security", icon: ShieldCheckIcon },
    { title: "Maintenance", href: "/settings/maintenance", icon: HardDriveIcon },
    { title: "Advanced", href: "/settings/advanced", icon: SettingsIcon },
    { title: "System", href: "/settings/system", icon: MonitorCheckIcon },
]

const Leftbar = () => {

    const [groups, setGroups] = useState<GroupModel[]>([]);
    const location = useLocation();

    const fetchGroups = async () => {
        try {
            const data = await backend.listGroups();
            setGroups(data);                
        } catch (error) {
            console.error("Error fetching groups:", error);
        }
    };

    useEffect(() => {
        fetchGroups();
        window.addEventListener('vault-changed', fetchGroups);
        return () => window.removeEventListener('vault-changed', fetchGroups);
    }, []);

    return (
        <Sidebar>

            <SidebarContent>
                <SidebarGroup>
                    <div className="flex items-center gap-2 justify-between mb-2">
                        <SidebarGroupLabel>Groups</SidebarGroupLabel>
                        <CreateGroupDialog>
                            <Button size="icon-xs" variant="secondary" className="text-primary">
                                <PlusIcon />
                            </Button>
                        </CreateGroupDialog>
                    </div>
                    {groups && groups.length > 0 && (
                        <div className="space-y-1">
                            {groups.map((item, index) => (
                                <GroupCard data={item} key={index} />
                            ))}
                        </div>
                    )}
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>

                <Separator />
                <SidebarMenu>
                    
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Pass Monitor" isActive={location.pathname === "/monitor"}>
                            <Link to="/monitor">
                                <ShieldCheckIcon />
                                <span>Pass Monitor</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    <Collapsible asChild className="group/collapsible" defaultOpen={location.pathname.startsWith("/settings")}>
                        <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton tooltip="Settings">
                                    <Settings2Icon />
                                    <span>Settings</span>
                                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <SidebarMenuSub>
                                    {settingsSubItems.map((sub) => (
                                        <SidebarMenuSubItem key={sub.href}>
                                            <SidebarMenuSubButton asChild isActive={location.pathname === sub.href}>
                                                <Link to={sub.href}>
                                                    <sub.icon className="size-4" />
                                                    <span>{sub.title}</span>
                                                </Link>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    ))}
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </SidebarMenuItem>
                    </Collapsible>

                </SidebarMenu>

                <Separator />

                <SidebarMenu><SidebarMenuItem><SidebarMenuButton asChild tooltip="Close Session" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                    <Link to="/logout">
                        <LogOutIcon />
                        <span>Close Session</span>
                    </Link>
                </SidebarMenuButton></SidebarMenuItem></SidebarMenu>

            </SidebarFooter>

        </Sidebar>
    )
}

export default Leftbar