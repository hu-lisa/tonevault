import {
    Table,
    TableBody,
    TableCaption,
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
                    <TableHead>Tags</TableHead>
                    <TableHead className="text-right">Last Practiced</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {songs.map((song) => (
                    <TableRow key={song.id} className="relative hover:bg-muted/50">
                        <TableCell>
                            <Link href={`/dashboard/songs/${song.id}`} className="after:absolute after:inset-0 after:z-10">
                                {song.title}
                            </Link>
                        </TableCell>
                        <TableCell>{song.artist}</TableCell>
                        <TableCell>{}</TableCell>
                        <TableCell className="text-right">
                            {(song.lastPracticedAt) ? song.lastPracticedAt.toLocaleDateString() : 'Never'}
                        </TableCell>
                        {/*if adding clickable things, make sure to disable propagation and make the z index higher than 10*/}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}