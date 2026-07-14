'use server'
import { auth, getUserId } from "@/app/actions/auth";
import { getSongs } from "@/app/actions/songs";
import CreateForm from "@/components/dashboard/songs/createform";
import SongTable from "@/components/dashboard/songs/songtable";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Song, songs } from "@/db/schema";
import { redirect } from "next/navigation";

const songTabs = [
    {value: 'all', display: 'All Songs'},
    {value: 'currently_learning', display: 'Currently Learning'},
    {value: 'learned', display: 'Learned'},
    {value: 'want_to_learn', display: 'Planned'},
];

export default async function Page()  {
    const userId = await getUserId();
    const songList = await getSongs(userId);
    return (
        <div className="flex flex-col space-y-1">
            <div className="flex flex-row justify-between">
                <header>Songs</header>
                <CreateForm userId={userId} />
            </div>
            <div>
                <Tabs defaultValue="all">
                    <div className="flex flex-row space-x-2">
                        <Field className="w-150">
                            <Input id="search" autoComplete="off" placeholder="Search for a song" />
                        </Field>
                        <TabsList className="ml-auto">
                            {songTabs.map((tab) => (
                                <TabsTrigger key={tab.value} value={tab.value}>{tab.display}</TabsTrigger>
                            ))}
                        </TabsList>
                    </div>
                    {songTabs.map((tab) => (
                        <TabsContent key={tab.value} value={tab.value}>
                            <SongTable songs={songList.filter((song: Song) => (
                                (tab.value === 'all') ? song : song.status === tab.value
                            ))}/>
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </div>
    )
}