'use client'

import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { SongWithTags } from '@/db/schema';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<SongWithTags>[] = [
    {
        accessorKey: "title",
        header: "Song",
        size: 240,
    },
    {
        accessorKey: "artist",
        header: "Artist",
        size: 180,
    },
    {
        accessorKey: "tags",
        header: "Tags",
        cell: ({ row }) => {
            const tags = row.original.tags;
            return (
                <ScrollArea className="w-full min-w-0 whitespace-nowrap">
                    <div className="flex h-6 flex-row items-center gap-3">
                        {tags.map((tag) => (
                            <Badge key={tag.id}>{tag.name}</Badge>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            )
        },
        size: 320,
    },
    {
        accessorKey: "lastPracticedAt",
        header: () => <div className="text-right">Last Practiced</div>,
        cell: ({ row }) => {
            const timestamp = row.getValue<Date | null>("lastPracticedAt");
            const day = timestamp ? timestamp.toLocaleDateString() : "Not Logged";
            return <div className="text-right">{day}</div>
        },
    },
]