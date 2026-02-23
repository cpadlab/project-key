import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar"
import { LogOutIcon, PlusIcon, Settings2Icon, ShieldCheckIcon } from "lucide-react"

import { CreateGroupDialog } from "./forms/create-new-group"
import { backendAPI as backend } from '@/lib/api';
import type { GroupModel } from "@/global"
import GroupCard from "./cards/group-card/card"
import { Link } from "react-router-dom"
import { Separator } from "@/components/ui/separator"

const Leftbar = () => {

    const [groups, setGroups] = useState<GroupModel[]>([]);

    const fetchGroups = async () => {
        try {
            console.log("Fetching groups due to vault change...");
            const data = await backend.listGroups();
            setGroups(data);                
        } catch (error) {
            console.error("Error fetching groups:", error);
        }
    };

    useEffect(() => {
        fetchGroups();
        window.addEventListener('vault-changed', fetchGroups);
        return () => {
            window.removeEventListener('vault-changed', fetchGroups);
        };
    }, []);

    const data = [
        {
            icon: ShieldCheckIcon,
            label: "Pass Monitor",
            href: "/monitor",
            separator: false
        },
        {
            icon: Settings2Icon,
            label: "Settings",
            href: "/settings",
            separator: false
        },
        {
            icon: LogOutIcon,
            label: "Close Session",
            href: "/logout",
            separator: true
        },
    ]

    return (
        <Sidebar>

            <SidebarContent>
                <SidebarGroup>
                    <div className="flex items-center gap-2 justify-between">
                        <SidebarGroupLabel>Grups</SidebarGroupLabel>
                        <CreateGroupDialog>
                            <Button size="icon-xs" variant="secondary" className="text-primary">
                                <PlusIcon />
                            </Button>
                        </CreateGroupDialog>
                    </div>
                    {groups && groups.length > 0 && (
                        groups.map((item, index) => (
                            <GroupCard data={item} key={index} />
                        ))
                    )}
                </SidebarGroup>
            </SidebarContent>


            <SidebarFooter>
                <SidebarGroup>
                    <SidebarMenu>
                        {data.map((item, index) => (
                            <>
                                {item.separator && <Separator className="mt-2" />}
                                <Link className={`${item.separator && "pt-2"}`} key={index} to={item.href}>
                                    <SidebarMenuItem>
                                        <Button size="sm" variant="ghost" className="justify-start w-full">
                                            <item.icon className="size-4" />
                                            <span>{item.label}</span>
                                        </Button>
                                    </SidebarMenuItem>
                                </Link>
                            </>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarFooter>

        </Sidebar>
    )
}

export default Leftbar