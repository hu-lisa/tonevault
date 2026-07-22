'use client'

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import * as z from 'zod';
import { deleteUser, validate } from "@/app/actions/account";
import { redirect } from "next/navigation";

const formSchema = z.object({
    password: z.string().min(6, 'Password is at least 6 characters.'),
});

export default function DeleteForm() {
    const [open, setOpen] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: '',
        },
    });

    async function onSubmit(data: z.infer<typeof formSchema>) {
        const result = await validate(data.password);

        if (result?.error) {
            form.setError('root', {
                type: 'manual',
                message: result.error,
            });
            return;
        }

        const erase = await deleteUser();

        if (erase?.error) {
            form.setError('root', {
                type: 'manual',
                message: erase.error,
            });
            return;
        }

        setOpen(false);
        form.reset();
        redirect('/');
    }

    return (
        <Dialog open={open} onOpenChange={(nextOpen) => {
            setOpen(nextOpen);
            if (!nextOpen) {
                form.reset();
            }
        }}>
            <form id="delete-acct" onSubmit={form.handleSubmit(onSubmit)}>
                <DialogTrigger asChild>
                    <Button variant="destructive">Delete Account</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Delete Account</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>

                    <FieldGroup>
                        <Controller
                            name="password"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="delete-pw">
                                        Password
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="delete-pw"
                                        aria-invalid={fieldState.invalid}
                                        autoComplete="off"
                                        type="password"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>

                    {form.formState.errors.root && (
                        <FieldError errors={[form.formState.errors.root]} />
                    )}

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" variant="destructive" form="delete-acct">Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}