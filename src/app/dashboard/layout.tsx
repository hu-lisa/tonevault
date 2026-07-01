import SideNav from '@/components/dashboard/sidenav';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
 
export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider defaultOpen={true}>
            <SideNav />
            <main className="flex-1 p-6 md:p-12">
                {children}
            </main>
        </SidebarProvider>
    )
}
