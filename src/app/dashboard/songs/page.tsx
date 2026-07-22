'use server'
import { getSongsWithTags } from "@/app/actions/songs";
import CreateForm from "@/components/dashboard/songs/createform";
import SongTable from "@/components/dashboard/songs/songtable";
import { columns } from "@/components/dashboard/tables/columns";
import { DataTable } from "@/components/dashboard/tables/datatable";
import { SongFilters } from "@/components/dashboard/tables/songfilters";
import { SongPagination } from "@/components/dashboard/tables/songpagination";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Song } from "@/db/schema";

export default async function Page(props: {
    searchParams?: Promise<{
        page?: string,
        q?: string,
        status?: string,
        filter?: string,
    }>;
})  {
    const searchParams = await props.searchParams;
    const songList = await getSongsWithTags({ searchParams });


    return (
        <div className="flex flex-col space-y-1">
            <div className="flex flex-row items-center justify-between">
                <header className="text-2xl">Songs</header>
                <CreateForm />
            </div>
            <div className="flex flex-col space-y-1">
                <SongFilters />
                {<DataTable columns={columns} data={songList.data} pageCount={songList.pageCount} />}
                <SongPagination pageCount={songList.pageCount}/>
            </div>
        </div>
    )
}