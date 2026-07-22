import { getEmail } from "@/app/actions/account";
import AccountPanel from "@/components/dashboard/account/accountpanel";
import DeleteForm from "@/components/dashboard/account/deleteform";
import PasswordForm from "@/components/dashboard/account/passwordform";
import { Separator } from "@/components/ui/separator";



export default async function Page() {
    const email = await getEmail();
    return (
        <div className="flex flex-col space-y-2">
            <header className="text-2xl">Profile</header>
            <AccountPanel email={email} />
            <Separator />
            <div className="flex flex-row-reverse gap-2">
                <DeleteForm />
                <PasswordForm />
            </div>
        </div>
    )
}