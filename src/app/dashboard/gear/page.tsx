import { getUserId } from "@/app/actions/auth";
import { getGearItems } from "@/app/actions/gear";
import CreateForm from "@/components/dashboard/gear/createform";
import GearCard from "@/components/dashboard/gear/gearcard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const types = [
    { value: 'guitar', display: 'Guitars' },
    { value: 'amp', display: 'Amps' },
    { value: 'pedal', display: 'Pedals' },
];

export default async function Page() {
    const items = await getGearItems(null);

    return (
        <div className="flex flex-col space-y-2">
            <div className="flex flex-row items-center justify-between">
                <header className='text-2xl'>Gear</header>
                <CreateForm/>
            </div>
            <div>
                <Tabs defaultValue="guitar">
                    <TabsList>
                        {types.map((type) => (
                            <TabsTrigger key={type.value} value={type.value}>{type.display}</TabsTrigger>
                        ))}
                    </TabsList>
                    
                    {items.length > 0 ? types.map((type) => (
                        <TabsContent key={type.value} value={type.value}>
                            <div className="grid grid-cols-3 gap-2">
                                {items.filter(item => (item.type === type.value)).map((gear) => (
                                    <GearCard gear={gear} key={gear.id} />
                                ))}
                            </div>
                        </TabsContent>
                    )) : <p className="text-sm text-center">No gear items yet. Add one using the button in the top right!</p>}
                </Tabs>
            </div>
        </div>
    )
}