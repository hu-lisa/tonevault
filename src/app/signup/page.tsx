import SignupForm from '@/components/auth/signup-form';
import { Suspense } from 'react';

export default function LoginPage() {
    return (
        <main>
            <div>
                <Suspense>
                    <SignupForm />
                </Suspense>
            </div>
        </main>
    )
}