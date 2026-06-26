'use client'
import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';
import { signup } from '@/app/lib/actions/signup';

export default function SignUpForm() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
    const [errorMessage, formAction, isPending] = useActionState(
        signup,
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
                <button aria-disabled={isPending}>Create Account</button>
            </div>
            <div className="text-red-500">
                {errorMessage?.errors?.email && (
                    <p>{errorMessage.errors.email[0]}</p>
                )}
                {errorMessage?.errors?.password && (
                    <p>{errorMessage.errors.password[0]}</p>
                )}
            </div>
        </form>
    )
}