'use client'
import { logOut } from "@/app/actions/login";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";


export default function Page() {
    return (
        <div className="flex flex-col space-y-2">
            <header className="text-2xl">Profile</header>
            <div className="flex flex-row justify-between items-center">
                <p>Email: xyz@gmail.com</p>
                <Button variant="outline" onClick={() => logOut()}>Log Out</Button>
            </div>
            <Separator />
            <div className="flex flex-row-reverse space-x-2">
                <Button variant="destructive">Delete Account</Button>
                <Button variant="outline">Change Password</Button>
            </div>
        </div>
    )
}