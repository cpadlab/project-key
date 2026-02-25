import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import { SearchIcon } from "lucide-react"

export const Search = () => {
    return (
        <div className="flex-1 flex items-center">
            <Button variant="outline" className="relative w-full" size="sm">
                <SearchIcon className="opacity-50 size-4" />
                <div className="flex-1 flex">
                    <span className="opacity-50">Search...</span>
                </div>
                <Kbd className="absolute right-1.5 top-1/2 -translate-y-1/2">Ctrl + S</Kbd>
            </Button>
        </div>
    )
}
