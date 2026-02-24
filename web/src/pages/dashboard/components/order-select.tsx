import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpAZIcon, ArrowDownZAIcon, ClockArrowUpIcon, ClockArrowDownIcon } from "lucide-react"
import { useGroup } from "@/contexts/group-context"

export const OrderSelect = () => {

    const { sortOrder, setSortOrder } = useGroup()

    return (
        <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger size="sm" className="w-35">
                <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent align="center">
                <SelectItem value="az">
                    <div className="flex items-center gap-2">
                        <ArrowUpAZIcon className="size-4" />
                        <span>A-Z</span>
                    </div>
                </SelectItem>
                <SelectItem value="za">
                    <div className="flex items-center gap-2">
                        <ArrowDownZAIcon className="size-4" />
                        <span>Z-A</span>
                    </div>
                </SelectItem>
                <SelectItem value="newest">
                    <div className="flex items-center gap-2">
                        <ClockArrowUpIcon className="size-4" />
                        <span>Newest</span>
                    </div>
                </SelectItem>
                <SelectItem value="oldest">
                    <div className="flex items-center gap-2">
                        <ClockArrowDownIcon className="size-4" />
                        <span>Oldest</span>
                    </div>
                </SelectItem>
            </SelectContent>
        </Select>
    )
}