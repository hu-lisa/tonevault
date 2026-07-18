'use client'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { FieldError } from "@/components/ui/field";
import { useState } from "react";
import { deleteSetting } from "@/app/actions/presets";

export default function DeleteSettingsDialog({ open, onOpenChange, gearId, presetId }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    gearId: number;
    presetId: number;
}) {
    const [deleteError, setDeleteError] = useState<{ message: string } | null>(null);

    async function handleDelete() {
        const result = await deleteSetting(presetId, gearId);
        if (result?.error) {
            setDeleteError({ message: result.error });
            return;
        }
        onOpenChange(false);
        setDeleteError(null);
    }
    return (
        <AlertDialog open={open} onOpenChange={(nextOpen) => {
            onOpenChange(nextOpen);
            if(!nextOpen) {
                setDeleteError(null);
            }
        }}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will delete the gear and its settings from your preset.
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
                {deleteError && <FieldError errors={[deleteError]} />}
            </AlertDialogContent>
        </AlertDialog>
    )
}
