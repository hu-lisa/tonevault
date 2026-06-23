'use client'
import { useActionState } from 'react';
import { authenticate } from '@/app/lib/actions/login';
import { useSearchParams } from 'next/navigation';

export default function LoginForm() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
    const [errorMessage, formAction, isPending] = useActionState(
        authenticate,
        undefined,
    )
    return (
        <form action={formAction} noValidate={true}>
            <label htmlFor="credentials-email">
                Email
                <input className="bg-white text-black" type="email" id="credentials-email" name="email" />
            </label>
            <label htmlFor="credentials-password">
                Password
                <input className="bg-white text-black" type="password" id="credentials-password" name="password" />
            </label>
            <div>
                <input type="hidden" name="redirectTo" value={callbackUrl} />
                <button aria-disabled={isPending}>Sign In</button>
            </div>
            <div className="text-red-500">
                {errorMessage && (
                    <p>{errorMessage}</p>
                )}
            </div>
        </form>
    )
}