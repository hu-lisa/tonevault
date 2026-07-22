import SongCard from "@/components/dashboard/songs/songcard";
import { getSongsWithTags } from "../actions/songs";
import { DataTable } from "@/components/dashboard/tables/datatable";
import { columns } from "@/components/dashboard/tables/columns";
import { SongPagination } from "@/components/dashboard/tables/songpagination";

export default async function Page(props: {
    searchParams?: Promise<{
        page?: string,
        q?: string,
        status?: string,
        filter?: string,
    }>;
}) {
    const searchParams = await props.searchParams;
    const songList = await getSongsWithTags({ searchParams: { ...searchParams, status: 'currently_learning', filter: 'lastPracticedAt' } });

    return (
        <div className="flex flex-col space-y-2">
            <header className="text-2xl">Quick Access</header>
            {songList.data.length > 0 ?
                <div className="grid grid-cols-3 gap-2">
                    {songList.data.slice(0, 3).map((song) => (
                        <SongCard key={song.id} song={song} />
                    ))}
                </div> :
                <p className="text-sm">Your 3 most recently practiced songs that you are currently learning.</p>
            }

            <header className="mt-5 text-2xl">Currently Learning</header>
            <div className="flex flex-col space-y-1">
                {<DataTable columns={columns} data={songList.data} pageCount={songList.pageCount} />}
                <SongPagination pageCount={songList.pageCount} />
            </div>
        </div>
    )
}