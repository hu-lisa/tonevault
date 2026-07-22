import SideNav from '@/components/dashboard/sidenav';
import { SidebarProvider } from '@/components/ui/sidebar';
 
export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider defaultOpen={true}>
            <SideNav />
            <main className="flex-1 p-6 md:p-12 min-w-0">
                {children}
            </main>
        </SidebarProvider>
    )
}
