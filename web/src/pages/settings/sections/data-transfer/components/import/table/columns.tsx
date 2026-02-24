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
            <div className="flex items-center gap-2 min-w-0">
                <ShieldCheckIcon className="size-3.5 text-primary opacity-70 shrink-0" />
                <p className="font-semibold truncate text-sm">
                    {row.getValue("title")}
                </p>
            </div>
        ),
    },
    {
        accessorKey: "username",
        header: "Username",
        cell: ({ row }) => (
            <div className="flex items-center gap-2 text-muted-foreground min-w-0">
                <UserIcon className="size-3.5 shrink-0" />
                <p className="truncate text-sm">
                    {row.getValue("username") || <span className="italic opacity-50">Empty</span>}
                </p>
            </div>
        ),
    },
    {
        accessorKey: "url",
        header: "URL / Website",
        cell: ({ row }) => (
            <div className="flex items-center gap-2 min-w-0 max-w-62.5">
                <GlobeIcon className="size-3.5 opacity-50 shrink-0" />
                <p className="text-xs font-mono truncate text-muted-foreground">
                    {(row.getValue("url") as string)?.replace(/^https?:\/\//, '') || "—"}
                </p>
            </div>
        ),
    }
]