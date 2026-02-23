import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader } from "@/components/ui/sidebar"
import { PlusIcon } from "lucide-react"

import { CreateGroupDialog } from "./forms/create-new-group"
import { backendAPI as backend } from '@/lib/api';
import type { GroupModel } from "@/global"
import GroupCard from "./cards/group-card/card"

const Leftbar = () => {

    const [groups, setGroups] = useState<GroupModel[]>([]);

    useEffect(() => {

        const fetchGroups = async () => {
            try {
                const data = await backend.listGroups();
                setGroups(data);                
            } catch (error) {
                console.error("Error fetching groups:", error);
            }
        };

        fetchGroups();

    }, []);

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

            <SidebarFooter />

        </Sidebar>
    )
}

export default Leftbar