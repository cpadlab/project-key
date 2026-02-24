import { toast } from "sonner"
import { FileTextIcon, FolderArchiveIcon, HistoryIcon, SettingsIcon, ExternalLinkIcon } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"

import { backendAPI as backend } from "@/lib/api"
import { BreadcrumbRoute } from "../components/breadcrumb-route"

const SystemSettings = () => {

    const systemActions = [
        {
            id: "logs",
            title: "Logs Folder",
            description: "Access application activity logs and error reports.",
            icon: FileTextIcon,
            action: backend.openLogDir
        },
        {
            id: "backups",
            title: "Backup Directory",
            description: "View and manage your automatically generated vault backups.",
            icon: FolderArchiveIcon,
            action: backend.openBackupDir
        },
        {
            id: "history",
            title: "Operation History",
            description: "Location of the internal database for password history.",
            icon: HistoryIcon,
            action: backend.openHistoryDir
        },
        {
            id: "config",
            title: "Configuration File",
            description: "Directory containing the .ini settings file.",
            icon: SettingsIcon,
            action: backend.openConfigDir
        }
    ]

    const handleAction = async (title: string, actionFn: () => Promise<boolean>) => {
        try {
            const success = await actionFn()
            if (success) {
                toast.success(`Opening ${title}...`)
            } else {
                toast.error(`Could not open the location. Folder might not exist yet.`)
            }
        } catch (error) {
            console.error("System Action Error:", error)
            toast.error("An error occurred while trying to access the file system.")
        }
    }

    return (
        <div className="space-y-4">
            
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <SidebarTrigger />
                    <BreadcrumbRoute page="System" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">System</h2>
                <p className="text-sm text-muted-foreground">Quick access to internal application folders and files.</p>
            </div>
            
            
            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {systemActions.map((item) => (
                    <Card key={item.id} className="group hover:border-primary/50 transition-colors shadow-sm">
                        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                            <div className="rounded-lg bg-primary/10 p-2.5 text-primary group-hover:bg-primary/20 transition-colors">
                                <item.icon className="size-5" />
                            </div>
                            <div className="flex-1">
                                <CardTitle className="text-base font-semibold">{item.title}</CardTitle>
                                <CardDescription className="text-xs line-clamp-1">{item.description}</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Button variant="secondary" size="sm" onClick={() => handleAction(item.title, item.action)}>
                                <ExternalLinkIcon className="size-3" />
                                <span>Open in Explorer</span>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4 text-xs text-muted-foreground max-w-2xl">
                <p className="flex flex-col gap-2">
                    <span className="font-bold text-yellow-600 dark:text-yellow-400">Note:</span>
                    <span>Modification or deletion of files within these directories can cause instability or data loss. Use with caution.</span>
                </p>
            </div>

        </div>
    )
}

export default SystemSettings