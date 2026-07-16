import { getGearById } from "@/app/actions/gear";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PresetSetting } from "@/db/schema";
import { EllipsisVertical } from 'lucide-react';

export function SettingsCard({ setting }: { setting: any }) {
    return (
        <Card className="w-64 shrink-0 gap-2 shadow-none ring-0">
            <CardHeader className="flex flex-row items-center gap-2 space-y-0 justify-between">
                <CardTitle className="truncate">{setting.name}</CardTitle>
                <CardAction>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="outline">
                                <EllipsisVertical />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuGroup>
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardAction>
            </CardHeader>
            <CardContent>
                <p className="whitespace-pre-line text-sm text-muted-foreground line-clamp-4">
                    {setting.settings}
                </p>
            </CardContent>
        </Card>
    )
}