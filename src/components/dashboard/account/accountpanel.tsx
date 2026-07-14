'use client'

import { logOut } from "@/app/actions/login"
import { Button } from "@/components/ui/button"

export default function AccountPanel({ email }: { email: string }) {
    return (
        <div className="flex flex-row justify-between items-center">
            <p>{`Email: ${email}`}</p>
            <Button variant="outline" onClick={() => logOut()}>Log Out</Button>
        </div>
    )
}