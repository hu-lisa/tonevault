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
                    <TableRow key={song.id}>
                        <TableCell>{song.title}</TableCell>
                        <TableCell>{song.artist}</TableCell>
                        <TableCell>{}</TableCell>
                        <TableCell className="text-right">{song.lastPracticedAt?.toLocaleDateString()}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}