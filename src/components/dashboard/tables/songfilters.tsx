'use client';

import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useDebouncedCallback } from 'use-debounce'

const songTabs = [
    {value: 'all', display: 'All Songs'},
    {value: 'currently_learning', display: 'Currently Learning'},
    {value: 'learned', display: 'Learned'},
    {value: 'want_to_learn', display: 'Planned'},
];

export function SongFilters() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const activeTab = searchParams.get('status') ?? 'all';
    const router = useRouter();

    function setTabUrl(value: string) {
        const params = new URLSearchParams(searchParams);
        params.set('status', value);
        router.replace(`${pathname}?${params}`);
    }
    
    const handleSearch = useDebouncedCallback((term) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', '1');
        term ? params.set('q', term) : params.delete('q');
        router.replace(`${pathname}?${params}`);
    })

    return (
        <Tabs 
            defaultValue="all" 
            value={activeTab} 
            onValueChange={setTabUrl}
        >
            <div className="flex flex-row space-x-2">
                <Field className="w-150">
                    <Input 
                        id="search" 
                        autoComplete="off"
                        placeholder="Search for a song" 
                        onChange={(e) => {
                            handleSearch(e.target.value);
                        }}
                    />
                </Field>
                <TabsList className="ml-auto">
                    {songTabs.map((tab) => (
                        <TabsTrigger key={tab.value} value={tab.value}>
                            {tab.display}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </div>
        </Tabs>
    )
}