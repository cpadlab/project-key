import { type ColumnDef } from "@tanstack/react-table"
import { GlobeIcon, UserIcon, ShieldCheckIcon } from "lucide-react"

export type ImportEntry = {
    title: string
    username: string | null
    url: string | null
    password: any
}

export const columns: ColumnDef<ImportEntry>[] = [
    {
        accessorKey: "title",
        header: "Entry Title",
        cell: ({ row }) => (
            <div className="font-semibold flex items-center gap-2">
                <ShieldCheckIcon className="size-3.5 text-primary opacity-70" />
                {row.getValue("title")}
            </div>
        ),
    },
    {
        accessorKey: "username",
        header: "Username",
        cell: ({ row }) => (
            <div className="flex items-center gap-2 text-muted-foreground">
                <UserIcon className="size-3.5" />
                {row.getValue("username") || <span className="italic opacity-50">Empty</span>}
            </div>
        ),
    },
    {
        accessorKey: "url",
        header: "URL / Website",
        cell: ({ row }) => (
            <div className="flex items-center gap-2 max-w-50 truncate">
                <GlobeIcon className="size-3.5 opacity-50" />
                <span className="text-xs font-mono">{row.getValue("url") || "—"}</span>
            </div>
        ),
    }
]