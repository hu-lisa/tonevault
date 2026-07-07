'use client'
import { deleteSong } from "@/app/actions/songs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function DeleteButton({ songId, userId }: { songId: number, userId: number }) {
    const [open, setOpen] = useState(false);
    const [deleteError, setDeleteError] = useState<{ message: string } | null>(null);

    async function handleDelete() {
        const result = await deleteSong(songId, userId);
        if (result?.error) {
            setDeleteError({ message: result.error });
            return;
        }
        setOpen(false);
        setDeleteError(null);
        redirect('/dashboard/songs');
    }
    return (
        <AlertDialog open={open} onOpenChange={(nextOpen) => {
            setOpen(nextOpen);
            if(!nextOpen) {
                setDeleteError(null);
            }
        }}>
            <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the song and its presets.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={(e) => {
                        e.preventDefault();
                        handleDelete();
                    }}>
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
            {deleteError && <FieldError errors={[deleteError]} />}
        </AlertDialog>
    )
}