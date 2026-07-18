'use client'
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandItem, CommandGroup, CommandInput, CommandList } from '@/components/ui/command';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Field, FieldLabel, FieldError, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tag } from '@/db/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRef, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';
import { Separator } from '@/components/ui/separator';
import { updateTags } from '@/app/actions/tags';
import { TagSelectItem } from './tagselectitem';

const formSchema = z.object({
    songTags: z.array(z.object({
        id: z.number(),
        name: z.string().min(1, "Tag must have a name").max(50, "Tag name is too long"),
    })).min(1, "Must select at least one tag"),
});

export default function AddTagsForm({ songId, tagLib }: { 
    songId: number, 
    tagLib: { id: number, name: string }[] 
}) {
    const [open, setOpen] = useState(false);
    const [tags, setTags] = useState<{ id: number, name: string }[]>(tagLib);
    const [query, setQuery] = useState("");



    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            songTags: []
        },
    });

    const { fields, append, remove, replace } = useFieldArray({
        control: form.control,
        name: 'songTags',
        keyName: 'fieldId',
    });

    const newId = useRef(-1);
    function handleAddTag(search: string) {
        const newTag = { id: --newId.current, name: search };
        setTags([...tags, newTag]);
        append({ id: newId.current, name: search });
        setQuery("");
    }


    //handles form submit
    async function onSubmit(data: z.infer<typeof formSchema>) {
        const result = await updateTags(songId, data.songTags);
        if (result?.error) {
            form.setError('root', {
                type: 'manual',
                message: result.error,
            })
            return;
        }
        setOpen(false);
        form.reset();
    }

    return (
        <Dialog open={open} onOpenChange={(nextOpen) => {
            setOpen(nextOpen);
            if (nextOpen) {
                form.reset({
                    songTags: [],
                });
                setTags(tagLib);
            }
        }}>
            <form id="add-tags" onSubmit={form.handleSubmit(onSubmit)}>
                <DialogTrigger asChild>
                    <Button variant="outline">Add Tags</Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Add Tags</DialogTitle>
                        <DialogDescription>
                            Add additional tags to the song
                        </DialogDescription>
                    </DialogHeader>

                    <Controller
                        name="songTags"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} >
                                <Separator />
                                <Command>
                                    <FieldLabel
                                        className="mb-2 data-[invalid=true]:text-destructive"
                                        data-invalid={fieldState.invalid}
                                    >
                                        Select Tags
                                    </FieldLabel>
                                    <CommandInput
                                        value={query}
                                        onValueChange={setQuery}
                                        placeholder="Add or search for tags..."
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && query !== "" && !tags.some((tag) => tag.name.toLowerCase() === query.toLowerCase())) {
                                                e.preventDefault();
                                                handleAddTag(query);
                                            }
                                        }}
                                    />
                                    <CommandList>
                                        <CommandEmpty>
                                            No new tags to select. Start typing to add!
                                        </CommandEmpty>

                                        <CommandGroup heading="Tags">
                                            {tags.map((item) => (
                                                <TagSelectItem
                                                    key={item.id}
                                                    fields={fields}
                                                    append={append}
                                                    remove={remove}
                                                    tag={item}
                                                    clear={() => form.clearErrors('songTags')}
                                                />
                                            ))}
                                        </CommandGroup>

                                        {query !== "" && !tags.some((tag) => tag.name.toLowerCase() === query.toLowerCase()) && (
                                            <CommandGroup>
                                                <CommandItem className='hover:bg-muted' value={`create-${query}`} onSelect={() => handleAddTag(query)}>
                                                    {`Add "${query}" to your tags library`}
                                                </CommandItem>
                                            </CommandGroup>
                                        )}
                                    </CommandList>

                                </Command>
                                {fieldState.error && (
                                    <FieldError className="mt-2" errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" form="add-tags">Add Selected</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}