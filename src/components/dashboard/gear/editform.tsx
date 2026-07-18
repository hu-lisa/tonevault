'use client'

import { gearFormSchema, GearFormValues, GearItem, NewGearItem, NewSong } from "@/db/schema";
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
import { addGear, updateGear } from "@/app/actions/gear";
import { Textarea } from "@/components/ui/textarea";
import { PencilIcon } from "lucide-react";


export default function EditForm({ gear }: { gear: GearItem }) {
    const [open, setOpen] = useState(false);
    const form = useForm<GearFormValues>({
        resolver: zodResolver(gearFormSchema),
        defaultValues: {
            name: gear.name,
            notes: gear.notes,
            type: gear.type,
        },
    });

    async function onSubmit(data: GearFormValues) {
        const result = await updateGear(data, gear.id);

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
            <form id={`edit-gear-${gear.id}`} onSubmit={form.handleSubmit(onSubmit)}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                        <PencilIcon />
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Edit Gear Item</DialogTitle>
                        <DialogDescription>
                            Change a gear item's name, notes, or type.
                        </DialogDescription>
                    </DialogHeader>

                    <FieldGroup>
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={`edit-gear-name-${gear.id}`}>
                                        Name
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id={`edit-gear-name-${gear.id}`}
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
                                    <FieldLabel htmlFor={`edit-gear-notes-${gear.id}`}>
                                        Notes
                                    </FieldLabel>
                                    <Textarea
                                        {...field}
                                        value={field.value ?? ""}
                                        id={`edit-gear-notes-${gear.id}`}
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
                                    <FieldLabel htmlFor={`edit-gear-type-${gear.id}`}>
                                        Type
                                    </FieldLabel>
                                    <Select value={field.value ?? undefined} onValueChange={field.onChange}>
                                        <SelectTrigger id={`edit-gear-type-${gear.id}`}>
                                            <SelectValue/>
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
                        <Button type="submit" form={`edit-gear-${gear.id}`}>Update</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}