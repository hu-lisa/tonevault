'use client'

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import * as z from 'zod';
import { updateSetting } from "@/app/actions/presets";
import { PresetSetting } from "@/db/schema";

const formSchema = z.object({
    settings: z.string().min(1, "Setting cannot be empty"),
});

export default function EditSettingsDialog({ open, onOpenChange, setting }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    setting: PresetSetting;
}) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            settings: setting.settings,
        },
    });

    async function onSubmit(data: z.infer<typeof formSchema>) {
        const newSettings = {
            presetId: setting.presetId,
            gearItemId: setting.gearItemId,
            settings: data.settings,
        };
        const result = await updateSetting(newSettings);

        if (result?.error) {
            form.setError('root', {
                type: 'manual',
                message: result.error,
            });
            return;
        }
        onOpenChange(false);
        form.reset();
    }

    return (
        <Dialog open={open} onOpenChange={(nextOpen) => {
            onOpenChange(nextOpen);
            if (nextOpen) {
                form.reset();
            }
        }}>
            <form id={`edit-setting-${setting.gearItemId}`} onSubmit={form.handleSubmit(onSubmit)}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Edit Settings</DialogTitle>
                        <DialogDescription>
                            Change this gear item's settings.
                        </DialogDescription>
                    </DialogHeader>

                    <Controller
                        name="settings"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={`edit-setting-notes-${setting.gearItemId}`}>
                                    Settings
                                </FieldLabel>
                                <Textarea
                                    {...field}
                                    value={field.value ?? ""}
                                    id={`edit-setting-notes-${setting.gearItemId}`}
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

                    {form.formState.errors.root && (
                        <FieldError errors={[form.formState.errors.root]} />
                    )}

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" form={`edit-setting-${setting.gearItemId}`}>Update</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}
