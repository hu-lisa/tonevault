import Link from "next/link";
import { Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarFooter } from "../ui/sidebar";

export default function SideNav() {
    return (
        <Sidebar variant="inset">
        <SidebarHeader>Menu</SidebarHeader>
        <SidebarContent>
            <SidebarGroup>
                <SidebarMenu>
                    <SidebarMenuButton asChild isActive>
                        <Link href='/dashboard'>Home</Link>
                    </SidebarMenuButton>
                </SidebarMenu>
                <SidebarMenu>
                    <SidebarMenuButton asChild isActive>
                        <Link href='/dashboard/songs'>Songs</Link>
                    </SidebarMenuButton>
                </SidebarMenu>
                <SidebarMenu>
                    <SidebarMenuButton asChild isActive>
                        <Link href='/dashboard/gear'>Gear</Link>
                    </SidebarMenuButton>
                </SidebarMenu>
            </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
            <SidebarMenu>
                <SidebarMenuButton asChild isActive>
                    <Link href='/dashboard/account'>Account</Link>
                </SidebarMenuButton>
            </SidebarMenu>
        </SidebarFooter>
    </Sidebar>
    )
}