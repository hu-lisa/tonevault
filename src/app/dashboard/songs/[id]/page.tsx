import { getUserId } from "@/app/actions/auth";
import { getSongById } from "@/app/actions/songs";
import StatusMenu from "@/components/dashboard/songs/statusmenu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const songId = Number(id);

    const userId =  await getUserId();
    const song = await getSongById(songId, userId);
    if (!song) {
        notFound();
    }

    return (
        <div className="flex flex-col space-y-2">
            <Link href='/dashboard/songs' className="hover:underline">{'<- All Songs'}</Link>
            <div className="flex flex-row items-center justify-between">
                <div className="flex flex-row items-center space-x-2">
                    <header className="text-3xl">{song.title}</header>
                    <StatusMenu song={song} />
                </div>
                <div className="flex flex-row space-x-2">
                    <Button variant="outline">Edit</Button>
                    <Button variant="destructive">Delete</Button>
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
                    <Button variant="outline">Practice</Button>
                </div>
            </div>
            <Separator />
            <div className="flex flex-row items-center justify-between space-x-2">
                <header className="text-2xl">Presets</header>
                <Button variant="outline">Add Preset</Button>
            </div>
        </div>
    )
}