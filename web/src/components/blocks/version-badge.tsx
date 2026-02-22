import { useEffect, useState } from "react"
import { ShieldIcon } from "lucide-react"
import { Badge } from "../ui/badge"

import { backendAPI as backend } from "@/lib/api"

export const VersionBadge = () => {

    const [appName, setAppName] = useState("Project Key")
    const [appVersion, setAppVersion] = useState("0.0.0")

    useEffect(() => {
        const fetchAppData = async () => {
            try {
                setAppName(await backend.getAppName())
                setAppVersion(await backend.getAppVersion())
            } catch (error) {
                console.error("Error obtaining data from pywebview:", error)
            }
        }
        fetchAppData()
    }, [])

    return (
        <div className="absolute bottom-2 right-2 z-10 pointer-events-none">
            <Badge variant="secondary">
                <ShieldIcon />
                <span>{appName} - v{appVersion}</span>
            </Badge>
        </div>
    )
}
