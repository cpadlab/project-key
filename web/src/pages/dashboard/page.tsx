import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { CreateNewEntryDialog } from "./components/forms/create-new-entry/form"
import { PlusIcon } from "lucide-react"

const DashboardPage = () => {
    return (
        <div className="p-4">
            
            <div className="flex items-center gap-2 justify-between">
                <SidebarTrigger />
                <CreateNewEntryDialog>
                    <Button size="sm">
                        <PlusIcon className="size-4" />
                        <span>Create New Entry</span>
                    </Button>
                </CreateNewEntryDialog>
            </div>

        </div>
    )
}

export default DashboardPage