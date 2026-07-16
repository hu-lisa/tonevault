import { getUserId } from "@/app/actions/auth";
import { getLoadouts } from "@/app/actions/loadouts";
import { getPresets } from "@/app/actions/presets";
import { getSongById } from "@/app/actions/songs";
import CreateForm from "@/components/dashboard/presets/createform";
import { PresetCard } from "@/components/dashboard/presets/presetcard";
import DeleteButton from "@/components/dashboard/songs/deleteform";
import EditForm from "@/components/dashboard/songs/editform";
import PracticeButton from "@/components/dashboard/songs/practicebutton";
import StatusMenu from "@/components/dashboard/songs/statusmenu";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const songId = Number(id);

    const userId = await getUserId();
    const song = await getSongById(songId);
    if (!song) {
        notFound();
    }

    const loadouts = await getLoadouts();
    const presets = await getPresets(songId, null);

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
            <div className="flex flex-row justify-between">
                <div className="flex flex-row space-x-2">
                </div>
                <div className="flex flex-row space-x-2">
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