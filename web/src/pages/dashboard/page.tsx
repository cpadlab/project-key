import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { CreateNewEntryDialog } from "./components/forms/create-new-entry/form"
import { Grid2X2Icon, PlusIcon, TextAlignJustify, ArrowDownZAIcon, ArrowUpAZIcon, ClockArrowUpIcon, ClockArrowDownIcon } from "lucide-react"
import { useState } from "react"
import { ListView } from "./views/list/view"
import { useGroup } from "@/contexts/group-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type ViewMode = "list" | "grid";

const DashboardPage = () => {

    const [view, setView] = useState<ViewMode>("list");
    const { sortOrder, setSortOrder } = useGroup()

    return (
        <div className="p-4 pt-0">
            <div className="flex sticky top-0 py-4 z-10 bg-background items-center gap-2 justify-between">
                <div className="flex items-center gap-2">
                    <SidebarTrigger />
                </div>

                <div className="flex items-center gap-2">

                    <Select value={sortOrder} onValueChange={setSortOrder}>
                        <SelectTrigger size="sm">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent align="center">
                            <SelectItem value="az"><ArrowUpAZIcon />A-Z</SelectItem>
                            <SelectItem value="za"><ArrowDownZAIcon />Z-A</SelectItem>
                            <SelectItem value="newest"><ClockArrowUpIcon />Newest</SelectItem>
                            <SelectItem value="oldest"><ClockArrowDownIcon />Oldest</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button onClick={() => setView(view === "list" ? "grid" : "list")} variant="secondary" size="icon-sm">
                        {view === "list" ? <Grid2X2Icon className="size-4" /> : <TextAlignJustify className="size-4" />}
                    </Button>

                    <CreateNewEntryDialog>
                        <Button size="sm" className="h-8">
                            <PlusIcon className="size-4 mr-1" />
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