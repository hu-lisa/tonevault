import { getSettings } from "@/app/actions/presets";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Preset } from "@/db/schema";
import { SettingsCard } from "./settingscard";
import EditPresetForm from "./editpreset";
import { getGearById, getGearItems } from "@/app/actions/gear";
import DeletePresetDialog from "./deletepreset";

export async function PresetCard({ preset }: { preset: Preset }) {
    const settings = await getSettings(preset.id);
    console.log(preset.name);
    const loadoutItems = await getGearItems(preset.loadoutId);
    return (
        <Card className="w-full min-w-0 bg-transparent">
            <CardHeader className="items-center">
                <CardTitle className="text-lg">{preset.name}</CardTitle>
                <CardAction className="flex flex-row space-x-2" >
                    <EditPresetForm preset={preset} settings={settings} loadoutItems={loadoutItems} />
                    <DeletePresetDialog preset={preset} />
                </CardAction>
            </CardHeader>
            <CardContent className="min-w-0">
                <ScrollArea>
                    <div className="flex flex-row items-stretch gap-3 pb-2">
                        {settings.map((setting) => (
                            <SettingsCard key={setting.gearItemId} setting={setting} />
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </CardContent>
        </Card>
    )
}