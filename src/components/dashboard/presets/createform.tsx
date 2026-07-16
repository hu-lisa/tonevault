'use client'
import { getGearItems } from '@/app/actions/gear';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Field, FieldLabel, FieldError, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GearItem, gearItems, Loadout, NewPreset, NewPresetSetting, presetFormSchema } from '@/db/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRef, useState, useTransition } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';
import { GearSelectItem } from './gearselectitem';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { addPreset, addSettings, presetExists } from '@/app/actions/presets';
import { getUserId } from '@/app/actions/auth';

export default function CreateForm({ songId, loadouts }: { songId: number, loadouts: { id: number | null, name: string }[] }) {
    const [page, setPage] = useState({ open: false, step: 1 });
    const [gear, setGear] = useState<GearItem[]>([]);
    const [isPending, startTransition] = useTransition();


    //FLOW: user selects loadout -> loads all gear -> user selects gear -> updates presetSettings[] -> next page allows settings logging

    //RHF form
    const form = useForm<z.infer<typeof presetFormSchema>>({
        resolver: zodResolver(presetFormSchema),
        defaultValues: {
            name: "",
            loadoutId: null,
            presetSettings: [],
        },
    });

    //Controls the presetSettings array
    const { fields, append, remove, replace } = useFieldArray({
        control: form.control,
        name: 'presetSettings',
    });

    //handles data fetching on loadout change
    const requestId = useRef(0);
    function handleLoadoutChange(loadoutId: number | null) {
        const id = ++requestId.current;
        startTransition(async () => {
            const items = await getGearItems(loadoutId);
            if (id === requestId.current) {
                setGear(items);
            }
        });
        replace([]);
    }

    //handles form submit
    async function onSubmit(data: z.infer<typeof presetFormSchema>) {
        const preset = { 
            songId: songId, 
            createdAt: new Date(),
            name: data.name === "" ? "Main" : data.name,
            updatedAt: new Date(),
            loadoutId: data.loadoutId,
            isPublic: false,
        };
        const addedPreset = await addPreset(preset);
        if (addedPreset.error) {
            form.setError('root', {
                type: 'manual',
                message: addedPreset.error,
            });
            return;
        }

        const settings: NewPresetSetting[] = data.presetSettings.map((s) => ({
            ...s,
            presetId: addedPreset.id!!,
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
            if (!nextOpen) {
                form.reset();
                setPage({ open: false, step: 1 });
                setGear([]);
            } else {
                handleLoadoutChange(null);
            }
        }}>
            <form id="create-preset" onSubmit={form.handleSubmit(onSubmit)}>
                <DialogTrigger asChild>
                    <Button variant="outline">Add Preset</Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Add Preset</DialogTitle>
                        {page.step === 1 &&
                            <DialogDescription>
                                Select the gear you will be using
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
                                        <FieldLabel htmlFor="create-preset-name">
                                            Name
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="create-song-title"
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
                                name="loadoutId"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="create-preset-loadout">
                                            Loadout
                                        </FieldLabel>
                                        <Select
                                            value={field.value === null ? 'main' : String(field.value)}
                                            onValueChange={(value) => {
                                                field.onChange(value === 'main' ? null : Number(value));
                                                handleLoadoutChange(value === 'main' ? null : Number(value));
                                            }}
                                        >
                                            <SelectTrigger id="create-preset-loadout">
                                                <SelectValue placeholder="Select a loadout" />
                                            </SelectTrigger>
                                            <SelectContent position="popper">
                                                <SelectGroup>
                                                    {loadouts.map((loadout) => (
                                                        <SelectItem key={loadout.id ?? 'main'} value={loadout.id === null ? 'main' : String(loadout.id)}>{loadout.name}</SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
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
                                                Select Gear
                                            </FieldLabel>
                                            <CommandInput placeholder="Search for gear..." />
                                            <CommandList>
                                                <CommandEmpty>No results found.</CommandEmpty>
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
                            {fields.map((item, index) => {
                                const gearItem = gear.find(g => g.id === item.gearItemId)
                                return (
                                    <Controller
                                        name={`presetSettings.${index}.settings`}
                                        key={item.id}
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel className="mt-2" htmlFor={`presetSettings.${index}.settings`}>
                                                    {gearItem?.name ?? 'Unknown Gear'}
                                                </FieldLabel>
                                                <Textarea
                                                    {...field}
                                                    id={`presetSettings.${index}.settings`}
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
                            <Button className="mr-auto" onClick={() => setPage({ open: true, step: 1 })}>Back</Button>
                        }
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        {page.step === 2 &&
                            <Button type="submit" form="create-preset">Add</Button>
                        }
                        {page.step === 1 &&
                            <Button type="button" onClick={async () => {
                                const { name, loadoutId, presetSettings } = form.getValues();
                                const valid = presetSettings.length > 0;
                                console.log('valid?');
                                if (!valid) {
                                    console.log('Not valid');
                                    form.setError('presetSettings', {
                                        type: 'manual',
                                        message: "Must select at least one gear item",
                                    });
                                    return;
                                }
                                const exists = await presetExists(songId, loadoutId, name);
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