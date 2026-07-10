import { getEmail } from "@/app/actions/account";
import { getUserId } from "@/app/actions/auth";
import AccountPanel from "@/components/dashboard/account/accountpanel";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";



export default async function Page() {
    const userId = await getUserId();
    const email = await getEmail(userId);
    return (
        <div className="flex flex-col space-y-2">
            <header className="text-2xl">Profile</header>
            <AccountPanel email={email} />
            <Separator />
            <div className="flex flex-row-reverse space-x-2">
                <Button variant="destructive">Delete Account</Button>
                <Button variant="outline">Change Password</Button>
            </div>
        </div>
    )
}