import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";


export default function Page() {
    return (
        <div className="flex flex-col">
            <header>Profile</header>
            <span>Email: xyz@gmail.com</span>
            <Separator />
            <div className="flex flex-row">
                <Button variant="outline">Change Password</Button>
                <Button variant="destructive">Delete Account</Button>
            </div>
        </div>
    )
}