'use client'
import { CommandItem } from "@/components/ui/command";
import { GearItem } from "@/db/schema";
import { UseFieldArrayAppend, UseFieldArrayRemove } from "react-hook-form";

export function GearSelectItem({ fields, append, remove, gear, clear }: {
    fields: ({
        gearItemId: number;
        settings: string;
    } & Record<"id", string> & {
        disabled?: boolean;
    })[],
    append: UseFieldArrayAppend<{
        name: string;
        loadoutId: number | null;
        presetSettings: {
            gearItemId: number;
            settings: string;
        }[];
    }, "presetSettings">,
    remove: UseFieldArrayRemove,
    gear: GearItem,
    clear: () => void,
}) {
    
    const currentIndex = fields.findIndex(item => item.gearItemId === gear.id);

    function handleClick() {
        if (currentIndex >= 0) {
            remove(currentIndex);
        } else {
            append({ gearItemId: gear.id, settings: ''});
            clear();
        }
    }

    return (
        <CommandItem
            onSelect={() => handleClick()}
            className={currentIndex >= 0 ? "bg-primary text-primary-foreground hover:bg-primary/80" : 'hover:bg-muted'}
        >
            {gear.name}
        </CommandItem>
    )
}