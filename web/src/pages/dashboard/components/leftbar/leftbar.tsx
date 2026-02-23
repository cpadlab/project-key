import { Button } from "@/components/ui/button"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader } from "@/components/ui/sidebar"
import { PlusIcon } from "lucide-react"

import { CreateGroupDialog } from "./forms/create-new-group"

const Leftbar = () => {
    return (
        <Sidebar>
            
            <SidebarHeader>
                <div className="flex items-center gap-2 justify-between">
                    <SidebarGroupLabel>Grups</SidebarGroupLabel>
                    <CreateGroupDialog>
                        <Button size="icon-xs" variant="secondary" className="text-primary">
                            <PlusIcon />
                        </Button>
                    </CreateGroupDialog>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup />
                <SidebarGroup />
            </SidebarContent>

            <SidebarFooter />

        </Sidebar>
    )
}

export default Leftbar