'use client'
import { deleteGear } from "@/app/actions/gear";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { redirect } from "next/navigation";
import { useState } from "react";
import { Trash } from "lucide-react"

export default function DeleteButton({ gearId }: { gearId: number }) {
    const [open, setOpen] = useState(false);
    const [deleteError, setDeleteError] = useState<{ message: string } | null>(null);

    async function handleDelete() {
        const result = await deleteGear(gearId);
        if (result?.error) {
            setDeleteError({ message: result.error });
            return;
        }
        setOpen(false);
        setDeleteError(null);
        redirect('/dashboard/gear');
    }
    return (
        <AlertDialog open={open} onOpenChange={(nextOpen) => {
            setOpen(nextOpen);
            if(!nextOpen) {
                setDeleteError(null);
            }
        }}>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon">
                    <Trash />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete the gear item from your library and presets.
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