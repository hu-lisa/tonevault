'use client'
import { useActionState } from 'react';
import { redirect, useSearchParams } from 'next/navigation';
import { signup } from '@/app/actions/signup';
import * as z from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';

const signUpSchema = z.object({
    email: z.email("Please enter a valid email address."),
    password: z.string().min(6, "Password must be longer than 6 characters."),
});

export default function SignUpForm() {
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(data: z.infer<typeof signUpSchema>) {
        const result = await signup(data);
        if (result?.errors) {
            form.setError('root', {
                type: 'manual',
                message: result.errors,
            });
            return;
        }
        form.reset();
    }

    return (
        <div className="items-center">
            <form onSubmit={form.handleSubmit(onSubmit)} noValidate={true}>
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Create an Account</CardTitle>
                        <CardDescription>
                            Enter your email and create a password (minimum 6 characters)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FieldGroup>
                            <Controller
                                name="email"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid = {fieldState.invalid}>
                                        <FieldLabel htmlFor="signup-email">
                                            Email
                                        </FieldLabel>
                                        <Input 
                                            {...field}
                                            id="signup-email"
                                            aria-invalid={fieldState.invalid}
                                            autoComplete="off"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="password"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid = {fieldState.invalid}>
                                        <FieldLabel htmlFor="signup-password">
                                            Password
                                        </FieldLabel>
                                        <Input 
                                            {...field}
                                            id="signup-password"
                                            aria-invalid={fieldState.invalid}
                                            autoComplete="off"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                        {form.formState.errors.root && (
                            <FieldError className="mt-2" errors={[form.formState.errors.root]} />
                        )}
                    </CardContent>
                    <CardFooter className="flex-col gap-2">
                        <Button className="w-full" type="submit">Create Account</Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    )
}