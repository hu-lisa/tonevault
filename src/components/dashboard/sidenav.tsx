'use client'
import Link from "next/link";
import { Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarFooter, SidebarMenuItem } from "../ui/sidebar";
import { usePathname } from "next/navigation";

const links = [
    {href: '/dashboard', label: 'Home'},
    {href: '/dashboard/songs', label: 'Songs'},
    {href: '/dashboard/gear', label: 'Gear'},
];

export default function SideNav() {
    const pathname = usePathname();

    return (
        <Sidebar collapsible="none" className="h-screen">
        <SidebarHeader>Menu</SidebarHeader>
        <SidebarContent>
            <SidebarGroup>
                <SidebarMenu>
                    {links.map((link) => (
                        <SidebarMenuItem key={link.href}>
                            <SidebarMenuButton asChild isActive={pathname === link.href}>
                                <Link href={link.href}>
                                    <span>{link.label}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
            <SidebarMenu>
                <SidebarMenuButton asChild isActive={pathname === '/dashboard/account'}>
                    <Link href='/dashboard/account'>Account</Link>
                </SidebarMenuButton>
            </SidebarMenu>
        </SidebarFooter>
    </Sidebar>
    )
}