'use client'
import { useActionState, useCallback } from 'react';
import { authenticate } from '@/app/lib/actions';
import { useSearchParams } from 'next/navigation';

export default function LoginForm() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
    const [errorMessage, formAction, isPending] = useActionState(
        authenticate,
        undefined,
    )
    return (
        <form action={formAction}>
            <label htmlFor="credentials-email">
                Email
                <input type="email" id="credentials-email" name="email" />
            </label>
            <label htmlFor="credentials-password">
                Password
                <input type="password" id="credentials-password" name="password" />
            </label>
            <input type="submit" value="Sign In" />
            <div>
                {errorMessage && (
                    <p>{errorMessage}</p>
                )}
            </div>
        </form>
    )
}