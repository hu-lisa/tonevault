'use client'

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { useState } from "react";
import { Trash } from "lucide-react"
import { deletePreset } from "@/app/actions/presets";
import { Preset } from "@/db/schema";

export default function DeletePresetDialog({ preset }: { preset: Preset }) {
    const [open, setOpen] = useState(false);
    const [deleteError, setDeleteError] = useState<{ message: string } | null>(null);

    async function handleDelete() {
        const result = await deletePreset(preset)
        if (result?.error) {
            setDeleteError({ message: result.error });
            return;
        }
        setOpen(false);
        setDeleteError(null);
    }
    return (
        <AlertDialog open={open} onOpenChange={(nextOpen) => {
            setOpen(nextOpen);
            if(!nextOpen) {
                setDeleteError(null);
            }
        }}>
            <AlertDialogTrigger asChild>
                <Button variant="destructive">
                    <Trash />
                    Delete
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will delete the preset and all its settings.
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