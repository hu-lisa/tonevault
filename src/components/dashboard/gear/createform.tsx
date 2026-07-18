'use client'

import { gearFormSchema, GearFormValues, NewGearItem, NewSong } from "@/db/schema";
import { Controller, useForm } from "react-hook-form";
import { SongFormValues, songFormSchema } from "@/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { addSong } from "@/app/actions/songs";
import { useState } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select";
import { addGear } from "@/app/actions/gear";
import { Textarea } from "@/components/ui/textarea";


export default function CreateForm() {
    const [open, setOpen] = useState(false);
    const form = useForm<GearFormValues>({
        resolver: zodResolver(gearFormSchema),
        defaultValues: {
            name: "",
            notes: "",
            type: undefined,
        },
    });

    async function onSubmit(data: GearFormValues) {
        const result = await addGear(data, null);

        if (result?.error) {
            form.setError('root', {
                type: 'manual',
                message: result.error,
            });
            return;
        }
        setOpen(false);
        form.reset();
    }

    return (
        <Dialog open={open} onOpenChange={(nextOpen) => {
            setOpen(nextOpen);
            if (!nextOpen) {
                form.reset();
            }
        }}>
            <form id="create-gear" onSubmit={form.handleSubmit(onSubmit)}>
                <DialogTrigger asChild>
                    <Button variant="outline">Add Gear</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Add Gear Item</DialogTitle>
                        <DialogDescription>
                            Add a guitar, amp, or pedal to your library.
                        </DialogDescription>
                    </DialogHeader>

                    <FieldGroup>
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="create-gear-name">
                                        Name
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="create-gear-name"
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
                            name="notes"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="create-gear-notes">
                                        Notes
                                    </FieldLabel>
                                    <Textarea 
                                        {...field}
                                        value={field.value ?? ""}
                                        id="create-gear-notes" 
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Knobs, switches, etc..."
                                        autoComplete="off"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="type"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="create-gear-type">
                                        Type
                                    </FieldLabel>
                                    <Select value={field.value ?? undefined} onValueChange={field.onChange}>
                                        <SelectTrigger id="create-gear-type">
                                            <SelectValue placeholder="Select a gear type"/>
                                        </SelectTrigger>
                                        <SelectContent position="popper">
                                            <SelectGroup>
                                                <SelectItem value="guitar">Guitar</SelectItem>
                                                <SelectItem value="amp">Amp</SelectItem>
                                                <SelectItem value="pedal">Pedal</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
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
                        <Button type="submit" form="create-gear">Add</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}