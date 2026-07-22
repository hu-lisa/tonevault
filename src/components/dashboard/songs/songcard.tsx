import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Song } from "@/db/schema";
import Link from "next/link";

export default function SongCard({ song }: { song: Song }) {
    return (
        <Link href={`/dashboard/songs/${song.id}`} className="hover:opacity-80">
            <Card key={song.title} className="h-44">
                <CardHeader>
                    <CardTitle className="truncate">{song.title}</CardTitle>
                    <CardDescription className="truncate">{song.artist}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">{`Last Practiced: ${(song.lastPracticedAt) ? song.lastPracticedAt.toLocaleDateString() : 'Not Logged'}`}</p>
                </CardContent>
            </Card>
        </Link>
    )
}