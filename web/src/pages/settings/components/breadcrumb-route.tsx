import { AppLink } from "@/components/blocks/app-link"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,} from "@/components/ui/breadcrumb"

export const BreadcrumbRoute = ({ page }: { page: string }) => {
    return (
         <Breadcrumb>
            <BreadcrumbList>
                
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <AppLink to="/dashboard">Dashboard</AppLink>
                    </BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator />
                
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <AppLink to="/settings">Settings</AppLink>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                
                <BreadcrumbSeparator />
                
                <BreadcrumbItem>
                    <BreadcrumbPage>{page}</BreadcrumbPage>
                </BreadcrumbItem>

            </BreadcrumbList>
        </Breadcrumb>
    )
}
