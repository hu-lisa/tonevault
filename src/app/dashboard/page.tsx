import SongTable from "@/components/dashboard/songtable";
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from "@/components/ui/card";

const songs = [
    {title: 'Song 1', artist: 'Artist 1', tags: ['tag 1', 'tag 2', 'tag 3',], practiced: '6/30/26'},
    {title: 'Song 2', artist: 'Artist 2', tags: ['tag 1', 'tag 2',], practiced: '6/27/26'},
    {title: 'Song 3', artist: 'Artist 3', tags: ['tag 2', 'tag 3',], practiced: '6/30/26'},
    {title: 'Song 4', artist: 'Artist 4', tags: ['tag 3',], practiced: '6/30/26'},
    {title: 'Song 5', artist: 'Artist 5', tags: [], practiced: '6/30/26'},
];
const recents = [
    {title: 'Song 1', artist: 'Artist 1', tags: ['tag 1', 'tag 2', 'tag 3',], practiced: '6/30/26'},
    {title: 'Song 2', artist: 'Artist 2', tags: ['tag 1', 'tag 2',], practiced: '6/27/26'},
    {title: 'Song 3', artist: 'Artist 3', tags: ['tag 2', 'tag 3',], practiced: '6/30/26'},
];

export default function Page()  {
    return (
        <div className="flex flex-col space-y-1">
            <header>Recently Practiced</header>
            <div className="grid grid-cols-3 space-x-2 space-y-2">
                {recents.map((song) => (
                    <Card key={song.title}>
                        <CardHeader>
                            <CardTitle>{song.title}</CardTitle>
                            <CardDescription>{song.artist}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>{`Last Practiced ${song.practiced}`}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <header>Currently Learning</header>
            <div>
                <SongTable songs={songs} />
            </div>
        </div>
    )
}