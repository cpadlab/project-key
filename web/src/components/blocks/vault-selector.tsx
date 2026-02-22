import { ChevronDownIcon, PlusIcon, Trash2Icon } from "lucide-react"
import { ButtonGroup } from "../ui/button-group"
import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"

export const VaultSelector = () => {
    return (
        <div className="flex items-center gap-2 absolute left-2 top-2">

            <Button size="sm" variant="default" className="cursor-pointer">
                <PlusIcon />
                <span>New vault</span>
            </Button>

            <ButtonGroup>

                <Button size="sm" variant="outline" className="cursor-pointer">
                    <span>Open</span>                    
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className="cursor-pointer" variant="outline" size="icon-sm" aria-label="More Options">
                            <ChevronDownIcon />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-40">
                        <DropdownMenuGroup>
                            <DropdownMenuItem className="cursor-pointer">/home/...vbault.kdbx</DropdownMenuItem> {/* get_history */}
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem variant="destructive" className="cursor-pointer">
                                <Trash2Icon />
                                <span>Clear history</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

            </ButtonGroup>
        </div>
    )
}
