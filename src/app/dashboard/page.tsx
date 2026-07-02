import SongTable from "@/components/dashboard/songs/songtable";
import SongCard from "@/components/dashboard/songs/songcard";
import { redirect } from "next/navigation";
import { auth } from "../actions/auth";
import { getCurrentSongs } from "../actions/songs";

export default async function Page()  {
    const session = await auth();
    if (!session) {
        redirect('/');
    }
    const userId = Number(session.user.id);

    const songs = await getCurrentSongs(userId);

    return (
        <div className="flex flex-col space-y-2">
            <header>Quick Access</header>
            <div className="grid grid-cols-3 space-x-2 space-y-2">
                {songs.slice(0, 3).map((song) => (
                    <SongCard key={song.id} song={song} />
                ))}
            </div>
            <header className="mt-5">Currently Learning</header>
            <div>
                <SongTable songs={songs} />
            </div>
        </div>
    )
}