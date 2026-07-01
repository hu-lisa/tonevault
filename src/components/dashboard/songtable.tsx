import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

type Temp = {
    title: string,
    artist: string,
    tags: string[],
    practiced: string,
};

export default function SongTable({ songs }: { songs: any[] }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Song</TableHead>
                    <TableHead>Artist</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead className="text-right">Last Practiced</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {songs.map((song) => (
                    <TableRow key={song.title}>
                        <TableCell>{song.title}</TableCell>
                        <TableCell>{song.artist}</TableCell>
                        <TableCell>{(song.tags) ? song.tags[0] : ""}</TableCell>
                        <TableCell className="text-right">{song.practiced}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}