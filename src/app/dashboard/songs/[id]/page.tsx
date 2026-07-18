import { getUserId } from "@/app/actions/auth";
import { getLoadouts } from "@/app/actions/loadouts";
import { getPresets } from "@/app/actions/presets";
import { getSongById } from "@/app/actions/songs";
import { getTags, getUnusedTags } from "@/app/actions/tags";
import CreateForm from "@/components/dashboard/presets/createform";
import { PresetCard } from "@/components/dashboard/presets/presetcard";
import DeleteButton from "@/components/dashboard/songs/deleteform";
import EditForm from "@/components/dashboard/songs/editform";
import PracticeButton from "@/components/dashboard/songs/practicebutton";
import StatusMenu from "@/components/dashboard/songs/statusmenu";
import AddTagsForm from "@/components/dashboard/tags/addtagsform";
import { TagChip } from "@/components/dashboard/tags/tagchip";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const songId = Number(id);

    const song = await getSongById(songId);
    if (!song) {
        notFound();
    }

    const [loadouts, presets, tags, unused] = await Promise.all([
        getLoadouts(),
        getPresets(songId, null),
        getTags(songId),
        getUnusedTags(songId),
    ]);

    return (
        <div className="flex flex-col space-y-2">
            <Link href='/dashboard/songs' className="hover:underline">{'<- All Songs'}</Link>
            <div className="flex flex-row items-center justify-between">
                <div className="flex flex-row items-center space-x-2">
                    <header className="text-3xl">{song.title}</header>
                    <StatusMenu song={song} />
                </div>
                <div className="flex flex-row space-x-2">
                    <EditForm song={song} />
                    <DeleteButton songId={songId} />
                </div>
            </div>
            <div className="flex flex-row items-center justify-between">
                <div className="flex flex-row items-center space-x-2">
                    <p>{song.artist}</p>
                </div>
                <div className="flex flex-row space-x-2">
                    {`Last Practiced: ${(song.lastPracticedAt) ? song.lastPracticedAt.toLocaleDateString() : 'Never'}`}
                </div>
            </div>
            <div className="flex flex-row items-center gap-2">
                <ScrollArea className="w-fit max-w-1/2 min-w-0 whitespace-nowrap">
                    <div className="flex flex-row items-stretch gap-3 py-2">
                        {tags.map((tag) => (
                            <TagChip key={tag.id} tag={tag} songId={songId} />
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
                <Separator orientation="vertical" className="h-6 data-vertical:self-center" />
                <div className="flex flex-row space-x-2">
                    <AddTagsForm songId={songId} tagLib={unused} />
                </div>
                <div className="flex flex-row space-x-2 ml-auto">
                    <PracticeButton songId={songId} />
                </div>
            </div>
            <Separator />
            <div className="flex flex-col space-y-2">
                <div className="flex flex-row items-center justify-between space-x-2">
                    <header className="text-2xl">Presets</header>
                    <CreateForm songId={songId} loadouts={[{ id: null, name: 'Main' }, ...loadouts]}/>
                </div>
                {presets.map((p) => (
                    <PresetCard key={p.id} preset={p} />
                ))}
            </div>
        </div>
    )
}