import { LinkIcon, LockIcon, SquareArrowOutUpRightIcon, StarIcon, UserIcon } from "lucide-react"
import { DEFAULT_ICONS } from "@/components/blocks/icon-selector"
import { Button } from "@/components/ui/button"

interface ListCardProps {
    data: {
        uuid: string
        title: string
        username: string | null
        color: string | null
        icon: number | null
        is_favorite: boolean
        url: string | null,
        auto_fill_config: any | null,
        password: boolean | null
    }
}

export const ListCard = ({ data }: ListCardProps) => {

    const iconEntry = DEFAULT_ICONS.find((item) => item.id === data.icon) || DEFAULT_ICONS.find((item) => item.id === 0)!;
    const IconComponent = iconEntry.icon;
    const bgColor = data.color || 'var(--primary)';

    return (
        <div className="group/entry-card bg-card hover:bg-accent/40 py-2 px-2 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer w-full">
            
            <button className="flex items-center flex-1 gap-2.5">
                <div  className="flex p-2.5 shrink-0 items-center justify-center rounded-lg shadow-inner text-white" style={{ backgroundColor: bgColor }}>
                    <IconComponent className="size-4.5" />
                </div>

                <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-foreground truncate capitalize">
                            {data.title.toLocaleLowerCase()}
                        </span>
                    </div>                
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                        <span className="text-xs truncate">{data.username ? data.username.toLocaleLowerCase() : "-"}</span>
                    </div>
                </div>
            </button>

            <div className="flex items-center overflow-hidden w-0 transition-all duration-300 group-hover/entry-card:w-auto gap-0">
                {data.url && (
                    <Button variant="ghost" size="icon-sm">
                        <LinkIcon />
                    </Button>
                )}
                {data.username && (
                    <Button variant="ghost" size="icon-sm">
                        <UserIcon />
                    </Button>
                )}
                {data.password && (
                    <Button variant="ghost" size="icon-sm">
                        <LockIcon />
                    </Button>
                )}
                {data.auto_fill_config && (
                    <Button variant="secondary" size="icon-sm">
                        <SquareArrowOutUpRightIcon />
                    </Button>
                )}
            </div>

        </div>
    )
}