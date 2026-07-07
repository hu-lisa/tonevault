'use client'

import { NewSong } from "@/db/schema";
import { Controller, useForm } from "react-hook-form";
import { SongFormValues, songFormSchema } from "@/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { addSong } from "@/app/actions/songs";
import { redirect } from "next/navigation";
import { useState } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select";


export default function CreateForm({ userId }: { userId: number }) {
    const [open, setOpen] = useState(false);
    const form = useForm<SongFormValues>({
        resolver: zodResolver(songFormSchema),
        defaultValues: {
            title: "",
            artist: "",
            status: 'currently_learning',
        },
    });

    async function onSubmit(data: SongFormValues) {
        const song: NewSong = { ...data, userId: userId };
        const result = await addSong(song);

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
            <form id="create-song" onSubmit={form.handleSubmit(onSubmit)}>
                <DialogTrigger asChild>
                    <Button variant="outline">Add Song</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Add Song</DialogTitle>
                        <DialogDescription>
                            Add a song to your library.
                        </DialogDescription>
                    </DialogHeader>

                    <FieldGroup>
                        <Controller
                            name="title"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="create-song-title">
                                        Title
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="create-song-title"
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
                            name="artist"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="create-song-artist">
                                        Artist
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="create-song-artist"
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
                            name="status"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="create-song-status">
                                        Status
                                    </FieldLabel>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger id="create-song-status">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent position="popper">
                                            <SelectGroup>
                                                <SelectItem value="currently_learning">Currently Learning</SelectItem>
                                                <SelectItem value="learned">Learned</SelectItem>
                                                <SelectItem value="want_to_learn">Planned</SelectItem>
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
                        <Button type="submit" form="create-song">Add</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}