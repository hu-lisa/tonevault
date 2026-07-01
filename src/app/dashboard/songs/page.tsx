import SongTable from "@/components/dashboard/songtable";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const songs = [
    {title: 'Song 1', artist: 'Artist 1', tags: ['tag 1', 'tag 2', 'tag 3',], practiced: '6/30/26'},
    {title: 'Song 2', artist: 'Artist 2', tags: ['tag 1', 'tag 2',], practiced: '6/27/26'},
    {title: 'Song 3', artist: 'Artist 3', tags: ['tag 2', 'tag 3',], practiced: '6/30/26'},
    {title: 'Song 4', artist: 'Artist 4', tags: ['tag 3',], practiced: '6/30/26'},
];
const current = [
    {title: 'Current 1', artist: 'Artist 1', tags: ['tag 1', 'tag 2', 'tag 3',], practiced: '6/30/26'},
    {title: 'Current 2', artist: 'Artist 2', tags: ['tag 1', 'tag 2',], practiced: '6/27/26'},
];
const learned = [
    {title: 'Learned 1', artist: 'Artist 1', tags: ['tag 1', 'tag 2', 'tag 3',], practiced: '6/30/26'},
    {title: 'Learned 2', artist: 'Artist 2', tags: ['tag 1', 'tag 2',], practiced: '6/27/26'},
];
const planned = [
    {title: 'Planned 1', artist: 'Artist 1', tags: ['tag 1', 'tag 2', 'tag 3',], practiced: '6/30/26'},
    {title: 'Planned 2', artist: 'Artist 2', tags: ['tag 1', 'tag 2',], practiced: '6/27/26'},
];

const songTabs = [
    {tab: 'all', arr: songs},
    {tab: 'current', arr: current},
    {tab: 'learned', arr: learned},
    {tab: 'planned', arr: planned},
];

export default function Page()  {
    return (
        <div className="flex flex-col space-y-1">
            <div className="flex flex-row">
                <header>Songs</header>
                <Button variant="outline" className="ml-auto">Add Song</Button>
            </div>
            <div>
                <Tabs defaultValue="all">
                    <div className="flex flex-row space-x-2">
                        <Field className="w-150">
                            <Input id="search" autoComplete="off" placeholder="Search for a song" />
                        </Field>
                        <TabsList className="ml-auto">
                            <TabsTrigger value="all">All Songs</TabsTrigger>
                            <TabsTrigger value="current">Currently Learning</TabsTrigger>
                            <TabsTrigger value="learned">Learned</TabsTrigger>
                            <TabsTrigger value="planned">Planned</TabsTrigger>
                        </TabsList>
                    </div>

                    {songTabs.map((songTab) => (
                        <TabsContent value={songTab.tab} key={songTab.tab}>
                            <SongTable songs={songTab.arr} />
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </div>
    )
}