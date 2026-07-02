import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Song } from "@/db/schema";

export default function SongCard({ song }: { song: Song }) {
    return (
        <Card key={song.title}>
            <CardHeader>
                <CardTitle>{song.title}</CardTitle>
                <CardDescription>{song.artist}</CardDescription>
            </CardHeader>
            <CardContent>
                <p>{`Last Practiced ${song.lastPracticedAt?.toLocaleDateString()}`}</p>
            </CardContent>
        </Card>
    )
}