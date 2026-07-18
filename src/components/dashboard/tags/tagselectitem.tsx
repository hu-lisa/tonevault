'use client'
import { CommandItem } from "@/components/ui/command";
import { UseFieldArrayAppend, UseFieldArrayRemove } from "react-hook-form";

export function TagSelectItem({ fields, append, remove, tag, clear }: {
    fields: ({
        id: number;
        name: string;
        fieldId: string;
    } & {
        disabled?: boolean;
    })[],
    append: UseFieldArrayAppend<{
        songTags: {
            id: number;
            name: string;
        }[];
    }, "songTags">,
    remove: UseFieldArrayRemove,
    tag: {id: number, name: string},
    clear: () => void,
}) {
    
    const currentIndex = fields.findIndex(item => item.id === tag.id);

    function handleClick() {
        if (currentIndex >= 0) {
            remove(currentIndex);
        } else {
            append({ id: tag.id, name: tag.name});
            clear();
        }
    }

    return (
        <CommandItem
            onSelect={() => handleClick()}
            className={currentIndex >= 0 ? "bg-primary text-primary-foreground hover:bg-primary/80" : 'hover:bg-muted'}
        >
            {tag.name}
        </CommandItem>
    )
}