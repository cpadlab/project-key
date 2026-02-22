import { ShieldIcon } from "lucide-react"
import { Badge } from "../ui/badge"

export const VersionBadge = () => {
    return (
        <div className="absolute bottom-2 right-2 z-10 pointer-events-none">
            <Badge variant="secondary">
                <ShieldIcon />
                <span>Project Key - v0.0.1</span>
            </Badge>
        </div>
    )
}
