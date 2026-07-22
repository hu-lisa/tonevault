'use client'
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandList } from '@/components/ui/command';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Field, FieldLabel, FieldError, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { GearItem, NewPresetSetting, Preset, PresetSetting } from '@/db/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';
import { GearSelectItem } from './gearselectitem';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { addSettings, presetExists, updatePreset } from '@/app/actions/presets';
import { PencilIcon } from 'lucide-react';

const presetFormSchema = z.object({
    name: z.string(),
    loadoutId: z.number().nullable(),
    presetSettings: z.array(z.object({
      gearItemId: z.number(),
      settings: z.string().min(1, "Setting cannot be empty"),
    })),
});

export default function EditPresetForm({ preset, settings, loadoutItems }: { 
    preset: Preset,
    settings: PresetSetting[],
    loadoutItems: GearItem[],
}) {
    const [page, setPage] = useState({ open: false, step: 1 });

    const gear = loadoutItems.filter(g => !settings.some(s => s.gearItemId === g.id));

    const form = useForm<z.infer<typeof presetFormSchema>>({
        resolver: zodResolver(presetFormSchema),
        defaultValues: {
            name: preset.name ?? 'Main',
            loadoutId: preset.loadoutId,
            presetSettings: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'presetSettings',
    });

    async function onSubmit(data: z.infer<typeof presetFormSchema>) {
        const addedPreset = await updatePreset(preset.id, preset.songId, data.name === "" ? "Main" : data.name);
        if (addedPreset?.error) {
            form.setError('root', {
                type: 'manual',
                message: addedPreset.error,
            });
            return;
        }
        const settings: NewPresetSetting[] = data.presetSettings.map((s) => ({
            ...s,
            presetId: preset.id,
        }));
        const result = await addSettings(settings);
        if (result?.error) {
            form.setError('root', {
                type: 'manual',
                message: result.error,
            })
            return;
        }
        setPage({ open: false, step: 1 });
        form.reset();
    }

    return (
        <Dialog open={page.open} onOpenChange={(nextOpen) => {
            setPage({ open: nextOpen, step: 1 });
            if (nextOpen) {
                form.reset({
                    name: preset.name ?? 'Main',
                    loadoutId: preset.loadoutId,
                    presetSettings: [],
                });
            }
        }}>
            <form id={`edit-preset-${preset.id}`} onSubmit={form.handleSubmit(onSubmit)}>
                <DialogTrigger asChild>
                    <Button variant="outline">
                        <PencilIcon />
                        Edit
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Preset</DialogTitle>
                        {page.step === 1 &&
                            <DialogDescription>
                                Change name and add additional gear from the loadout
                            </DialogDescription>
                        }
                        {page.step === 2 &&
                            <DialogDescription>
                                Fill in settings for each gear item
                            </DialogDescription>
                        }
                    </DialogHeader>

                    {page.step === 1 &&
                        <FieldGroup>
                            <Controller
                                name="name"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={`edit-preset-name-${preset.id}`}>
                                            Name
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id={`edit-preset-name-${preset.id}`}
                                            aria-invalid={fieldState.invalid}
                                            autoComplete="off"
                                            placeholder='"Main" if left blank'
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="presetSettings"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} >
                                        <Separator />
                                        <Command>
                                            <FieldLabel 
                                                className="mb-2 data-[invalid=true]:text-destructive"
                                                data-invalid={fieldState.invalid}
                                            >
                                                Select Additional Gear
                                            </FieldLabel>
                                            <CommandInput placeholder="Search for gear..." />
                                            <CommandList>
                                                {gear.length === 0 && (
                                                    <CommandEmpty>All gear in the loadout has been used.</CommandEmpty>
                                                )}
                                                {gear.length !== 0 && (
                                                    <CommandEmpty>No results found.</CommandEmpty>
                                                )}
                                                <CommandGroup heading="Guitars">
                                                    {gear.filter((g) => g.type === 'guitar').map((item) => (
                                                        <GearSelectItem
                                                            key={item.id}
                                                            fields={fields}
                                                            append={append}
                                                            remove={remove}
                                                            gear={item}
                                                            clear={() => form.clearErrors('presetSettings')}
                                                        />
                                                    ))}
                                                </CommandGroup>
                                                <CommandGroup heading="Amps">
                                                    {gear.filter((g) => g.type === 'amp').map((item) => (
                                                        <GearSelectItem
                                                            key={item.id}
                                                            fields={fields}
                                                            append={append}
                                                            remove={remove}
                                                            gear={item}
                                                            clear={() => form.clearErrors('presetSettings')}
                                                        />
                                                    ))}
                                                </CommandGroup>
                                                <CommandGroup heading="Pedals">
                                                    {gear.filter((g) => g.type === 'pedal').map((item) => (
                                                        <GearSelectItem
                                                            key={item.id}
                                                            fields={fields}
                                                            append={append}
                                                            remove={remove}
                                                            gear={item}
                                                            clear={() => form.clearErrors('presetSettings')}
                                                        />
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                            
                                        </Command>
                                        {fieldState.error && (
                                                <FieldError className="mt-2" errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                    }

                    {page.step === 2 &&
                        <ScrollArea className="h-72">
                            {fields.length === 0 && (
                                <p>No additional gear selected.</p>
                            )}
                            {fields.map((item, index) => {
                                const gearItem = gear.find(g => g.id === item.gearItemId)
                                return (
                                    <Controller
                                        name={`presetSettings.${index}.settings`}
                                        key={item.id}
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel className="mt-2" htmlFor={`edit-preset-${preset.id}-presetSettings.${index}.settings`}>
                                                    {gearItem?.name ?? 'Unknown Gear'}
                                                </FieldLabel>
                                                <Textarea
                                                    {...field}
                                                    id={`edit-preset-${preset.id}-presetSettings.${index}.settings`}
                                                    aria-invalid={fieldState.invalid}
                                                    autoComplete="off"
                                                    value={field.value ?? ""}
                                                >
                                                </Textarea>
                                                {fieldState.error && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                        )}
                                    />
                                )
                            })}
                        </ScrollArea>
                    }

                    <DialogFooter>
                        {page.step === 2 &&
                            <Button variant="outline" className="mr-auto" onClick={() => setPage({ open: true, step: 1 })}>Back</Button>
                        }
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        {page.step === 2 &&
                            <Button type="submit" form="edit-preset">Update</Button>
                        }
                        {page.step === 1 &&
                            <Button type="button" onClick={async () => {
                                const { name, loadoutId} = form.getValues();
                                const exists = await presetExists(preset.songId, loadoutId, name, preset.id);
                                if (exists) {
                                    form.setError('name', {
                                        type: 'manual',
                                        message: "A preset with this name already exists in your selected loadout",
                                    });
                                    return;
                                }
                                setPage({ open: true, step: 2 });
                            }}>
                                Next
                            </Button>
                        }
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}