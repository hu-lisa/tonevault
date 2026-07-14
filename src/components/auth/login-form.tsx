'use client'
import { useActionState } from 'react';
import { authenticate } from '@/app/actions/login';
import { useSearchParams } from 'next/navigation';
import { Field, FieldError, FieldGroup } from '../ui/field';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';

export default function LoginForm() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
    const [errorMessage, formAction, isPending] = useActionState(
        authenticate,
        undefined,
    )
    return (
        <div className="flex h-screen items-center justify-center">
            <form action={formAction} noValidate={true}>
                <Card>

                    <CardHeader>
                        <CardTitle>Login to your account</CardTitle>
                        <CardDescription>
                            Enter your email below to login to your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" name="password" />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex-col gap-2">
                        <input type="hidden" name="redirectTo" value={callbackUrl} />
                        <Button aria-disabled={isPending} type="submit" className="w-full">
                            Login
                        </Button>
                        {errorMessage && <FieldError errors={[{ message: errorMessage }]} />}
                    </CardFooter>
                </Card>
            </form>
        </div>
    )
}