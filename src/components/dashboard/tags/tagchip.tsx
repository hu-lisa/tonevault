'use client'
import { useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Tag } from "@/db/schema";
import { deleteTagFromSong } from "@/app/actions/tags";
import { XIcon } from "lucide-react";

export function TagChip({ tag, songId }: { tag: Tag; songId: number }) {
    const [isPending, startTransition] = useTransition();

    return (
        <Badge>
            {tag.name}
            <button
                type="button"
                data-icon="inline-end"
                aria-label={`Remove ${tag.name}`}
                disabled={isPending}
                onClick={() => startTransition(() => { deleteTagFromSong(tag, songId); })}
                className="rounded-full hover:opacity-70"
            >
                <XIcon size={16} />
            </button>
        </Badge>
    )
}