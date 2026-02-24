import { useEffect, useState } from "react"
import { toast } from "sonner"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

import { backendAPI as backend } from "@/lib/api"
import { BreadcrumbRoute } from "../../components/breadcrumb-route"
import { HIBP } from "./components/hibp/component"
import { AuditInterval } from "./components/audit-interval"
import { CleaningClipboard } from "./components/cleaning-clipboard"

interface SecurityState {
    pwned_audit_enabled: boolean;
    password_audit_interval: number;
    clipboard_clear_interval: number;
}

const SecuritySettings = () => {
    
    const [settings, setSettings] = useState<SecurityState>({
        pwned_audit_enabled: false,
        password_audit_interval: 30,
        clipboard_clear_interval: 20
    })
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await backend.getSecuritySettings()
                setSettings(data)
            } catch (error) {
                console.error("Error:", error)
                toast.error("The security settings could not be loaded..")
            } finally {
                setIsLoading(false)
            }
        }
        fetchSettings()
    }, [])

    return (
        <div className="space-y-4">
            
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <SidebarTrigger className="-ml-2" />
                    <BreadcrumbRoute page="Security" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Security and Auditing</h2>
                <p className="text-sm text-muted-foreground">Password and clipboard analysis settings.</p>
            </div>
            
            <Separator />

            <div className="space-y-4">
                
                {isLoading ? (
                    <div className="space-y-8">
                        <Skeleton className="h-12 w-full max-w-2xl" />
                        <Skeleton className="h-12 w-full max-w-2xl" />
                        <Skeleton className="h-12 w-full max-w-2xl" />
                    </div>
                ) : (
                    <>
                        <HIBP checked={settings.pwned_audit_enabled} onChange={(val) => setSettings(prev => ({ ...prev, pwned_audit_enabled: val }))} />
                        <AuditInterval value={settings.password_audit_interval} onChange={(val) => setSettings(prev => ({ ...prev, password_audit_interval: val }))} />
                        <CleaningClipboard value={settings.clipboard_clear_interval} onChange={(val) => setSettings(prev => ({ ...prev, clipboard_clear_interval: val }))} />
                    </>
                )}

            </div>
        </div>
    )
}

export default SecuritySettings