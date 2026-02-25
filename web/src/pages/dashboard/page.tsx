import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { CreateNewEntryDialog } from "./components/forms/create-new-entry/form"
import { Grid2X2Icon, PlusIcon, TextAlignJustify } from "lucide-react"
import { useState } from "react"
import { ListView } from "./views/list/view"
import { OrderSelect } from "./components/order-select"
import { Search } from "./components/search"

type ViewMode = "list" | "grid";

const DashboardPage = () => {

    const [view, setView] = useState<ViewMode>("list");

    return (
        <div className="p-4 pt-0">

            <div className="flex sticky top-0 py-4 z-10 bg-background items-center gap-2 justify-between">
                <div className="flex items-center gap-2">
                    <SidebarTrigger />
                </div>
                <Search />
                <div className="flex items-center gap-2">
                    <OrderSelect />
                    <Button onClick={() => setView(view === "list" ? "grid" : "list")} variant="secondary" size="icon-sm">
                        {view === "list" ? <Grid2X2Icon className="size-4" /> : <TextAlignJustify className="size-4" />}
                    </Button>
                    <CreateNewEntryDialog>
                        <Button size="sm">
                            <PlusIcon className="size-4" />
                            <span>Create New Entry</span>
                        </Button>
                    </CreateNewEntryDialog>
                </div>
            </div>

            {view === "list" && <ListView />}

        </div>
    )
}

export default DashboardPage