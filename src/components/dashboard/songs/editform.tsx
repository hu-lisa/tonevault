'use client'

import { Song } from "@/db/schema";
import { Controller, useForm } from "react-hook-form";
import { SongFormValues, songFormSchema } from "@/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { updateSong } from "@/app/actions/songs";
import { useState } from "react";


export default function EditForm({ song }: { song: Song }) {
    const [open, setOpen] = useState(false);
    const form = useForm<SongFormValues>({
        resolver: zodResolver(songFormSchema),
        defaultValues: {
            title: song.title,
            artist: song.artist,
            status: song.status,
        },
    });

    async function onSubmit(data: SongFormValues) {
        const result = await updateSong(data, song.id);

        if (result?.error) {
            form.setError('root', {
                type: 'manual',
                message: result.error,
            });
            return;
        }
        setOpen(false);
        form.reset({
            title: song.title,
            artist: song.artist,
            status: song.status,
        });
    }

    return (
        <Dialog open={open} onOpenChange={(nextOpen) => {
            setOpen(nextOpen);
            if (nextOpen) {
                form.reset({
                    title: song.title,
                    artist: song.artist,
                    status: song.status,
                });
            }
        }}>
            <form id="edit-song" onSubmit={form.handleSubmit(onSubmit)}>
                <DialogTrigger asChild>
                    <Button variant="outline">Edit</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Edit Song</DialogTitle>
                        <DialogDescription>
                            Make changes to the title and artist.
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
                    </FieldGroup>

                    {form.formState.errors.root && (
                        <FieldError errors={[form.formState.errors.root]} />
                    )}

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" form="edit-song">Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}