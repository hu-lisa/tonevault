import SideNav from '@/components/dashboard/sidenav';
import { SidebarProvider } from '@/components/ui/sidebar';
 
export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
            <div className="w-full flex-none md:w-64">
                <SidebarProvider defaultOpen={true}>
                    <SideNav />
                </SidebarProvider>
            </div>
            <div className="grow p-6 md:overflow-y-auto md:p-12">{children}</div>
        </div>
    )
}
