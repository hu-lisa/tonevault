import LoginForm from '@/components/login-form';
import { Suspense } from 'react';

export default function LoginPage() {
    return (
        <main>
            <div>
                <Suspense>
                    <LoginForm />
                </Suspense>
            </div>
        </main>
    )
}