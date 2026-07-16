import { getSettings } from "@/app/actions/presets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Preset } from "@/db/schema";
import { SettingsCard } from "./settingscard";

export async function PresetCard({ preset }: { preset: Preset }) {
    const settings = await getSettings(preset.id);
    console.log(preset.name);
    return (
        <Card className="w-full min-w-0 bg-transparent">
            <CardHeader>
                <CardTitle className="text-lg">{preset.name}</CardTitle>
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