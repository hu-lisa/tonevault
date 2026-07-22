'use client'
import { Badge } from "@/components/ui/badge";
import { Tag } from "@/db/schema";
import { deleteTagFromSong } from "@/app/actions/tags";
import { XIcon } from "lucide-react";

export function TagChip({ tag, songId }: { tag: Tag; songId: number }) {

    return (
        <Badge>
            {tag.name}
            <button
                type="button"
                data-icon="inline-end"
                aria-label={`Remove ${tag.name}`}
                onClick={async () => await deleteTagFromSong(tag, songId) }
                className="rounded-full hover:opacity-70"
            >
                <XIcon size={16} />
            </button>
        </Badge>
    )
}