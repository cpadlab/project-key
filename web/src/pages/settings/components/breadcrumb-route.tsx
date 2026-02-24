import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,} from "@/components/ui/breadcrumb"
import { Link } from "react-router-dom"

export const BreadcrumbRoute = ({ page }: { page: string }) => {
    return (
         <Breadcrumb>
            <BreadcrumbList>
                
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link to="/dashboard">Dashboard</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator />
                
                <BreadcrumbItem>
                    <BreadcrumbPage>Settings</BreadcrumbPage>
                </BreadcrumbItem>
                
                <BreadcrumbSeparator />
                
                <BreadcrumbItem>
                    <BreadcrumbPage>{page}</BreadcrumbPage>
                </BreadcrumbItem>

            </BreadcrumbList>
        </Breadcrumb>
    )
}
