import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { LogOutIcon, PlusIcon, Settings2Icon, ShieldCheckIcon } from "lucide-react"

import { CreateGroupDialog } from "./forms/create-new-group"
import { backendAPI as backend } from '@/lib/api';
import type { FooterGroup, GroupModel } from "@/global"
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

    const data: FooterGroup[] = [
        {
            items: [
                {
                    icon: ShieldCheckIcon,
                    label: "Pass Monitor",
                    href: "/monitor",
                },
                {
                    icon: Settings2Icon,
                    label: "Settings",
                    href: "/settings/appearance",
                },
            ]
        },
        {
            items: [
                {
                    icon: LogOutIcon,
                    label: "Close Session",
                    href: "/logout",
                    className: "text-destructive hover:text-destructive hover:bg-destructive/10"
                },
            ]
        }
    ]

    return (
        <Sidebar>

            <SidebarContent>
                <SidebarGroup>
                    <div className="flex items-center gap-2 justify-between">
                        <SidebarGroupLabel>Groups</SidebarGroupLabel>
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
                <Separator />
                {data.map((group, idx_group) => (
                    <>
                        <SidebarMenu key={idx_group}>
                            {group.items.map((item, idx_item) => (
                                <SidebarMenuItem key={idx_item}>
                                    <SidebarMenuButton className={item.className} asChild tooltip="Pass Monitor">
                                        <Link to={item.href}>
                                            <item.icon />
                                            <span>{item.label}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                        {idx_group < data.length - 1 && <Separator />}
                    </>
                ))}
            </SidebarFooter>

        </Sidebar>
    )
}

export default Leftbar