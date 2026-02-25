import { Fragment } from "react"
import { useLocation } from "react-router-dom"
import { PaletteIcon, ShieldCheckIcon, HardDriveIcon, Settings2Icon, MonitorCheckIcon, LogOutIcon, LayoutDashboardIcon, ArrowLeftRightIcon } from "lucide-react"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import type { FooterGroup } from "@/global"
import { AppLink } from "@/components/blocks/app-link"

export const settingsNav = [
    { title: "Appearance", href: "/settings/appearance", icon: PaletteIcon },
    { title: "Security", href: "/settings/security", icon: ShieldCheckIcon },
    { title: "Data Transfer", href: "/settings/data-transfer", icon: ArrowLeftRightIcon },
    { title: "Maintenance", href: "/settings/maintenance", icon: HardDriveIcon },
    { title: "Advanced", href: "/settings/advanced", icon: Settings2Icon },
    { title: "System", href: "/settings/system", icon: MonitorCheckIcon },
]

const data: FooterGroup[] = [
    {
        items: [
            {
                icon: LayoutDashboardIcon,
                label: "Dashboard",
                href: "/dashboard",
            },
            {
                icon: ShieldCheckIcon,
                label: "Pass Monitor",
                href: "/monitor",
            },
        ]
    },
    {
        items: [
            {
                icon: LogOutIcon,
                label: "Close Session",
                href: "/logout",
                className: "text-destructive hover:text-destructive hover:bg-destructive/10"
            },
        ]
    }
]

export const SettingsSidebar = () => {
    const location = useLocation()

    return (
        <Sidebar>

            <SidebarContent>
                <SidebarGroup>
                    
                    <SidebarGroupLabel className="text-sm font-semibold text-foreground">Settings</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {settingsNav.map((item) => {
                                const isActive = location.pathname.includes(item.href)
                                return (
                                    <SidebarMenuItem key={item.href}><SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                                        <AppLink to={item.href}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </AppLink>
                                    </SidebarMenuButton></SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>

                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <Separator />
                {data.map((group, idx_group) => (
                    <Fragment key={idx_group}>
                        <SidebarMenu>
                            {group.items.map((item, idx_item) => (
                                <SidebarMenuItem key={idx_item}><SidebarMenuButton className={item.className} asChild tooltip={item.label}>
                                    <AppLink to={item.href}>
                                        <item.icon />
                                        <span>{item.label}</span>
                                    </AppLink>
                                </SidebarMenuButton></SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                        {idx_group < data.length - 1 && <Separator />}
                    </Fragment>
                ))}
            </SidebarFooter>
            
        </Sidebar>
    )
}