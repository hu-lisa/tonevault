import { getTags } from "@/app/actions/tags";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Song } from "@/db/schema";
import Link from "next/link";

export default function SongTable({ songs }: { songs: Song[] }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-80">Song</TableHead>
                    <TableHead className="w-65">Artist</TableHead>
                    <TableHead className="w-48">Tags</TableHead>
                    <TableHead className="text-right">Last Practiced</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {songs.map(async (song) => {
                    const tags = await getTags(song.id);
                    return (
                        <TableRow key={song.id} className="relative h-6 hover:bg-muted/50">
                            <TableCell>
                                <Link href={`/dashboard/songs/${song.id}`} className="after:absolute after:inset-0 after:z-10">
                                    {song.title}
                                </Link>
                            </TableCell>
                            <TableCell>{song.artist}</TableCell>
                            <TableCell>
                                <ScrollArea className="w-full min-w-0 whitespace-nowrap">
                                    <div className="flex h-6 flex-row items-center gap-3">
                                        {tags.map((tag) => (
                                            <Badge key={tag.id}>{tag.name}</Badge>
                                        ))}
                                    </div>
                                    <ScrollBar orientation="horizontal" />
                                </ScrollArea>
                            </TableCell>
                            <TableCell className="text-right">
                                {(song.lastPracticedAt) ? song.lastPracticedAt.toLocaleDateString() : 'Not Logged'}
                            </TableCell>
                            {/*if adding clickable things, make sure to disable propagation and make the z index higher than 10*/}
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    )
}