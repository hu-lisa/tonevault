'use client'
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EllipsisVertical, PencilIcon, Trash } from 'lucide-react';
import { useState } from "react";
import EditSettingsDialog from "./editsettings";
import DeleteSettingsDialog from "./deletesettings";

export function SettingsCard({ setting }: { setting: { presetId: number; gearItemId: number; settings: string; name: string; } }) {
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

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
                                <DropdownMenuItem onSelect={(e) => {
                                    e.preventDefault();
                                    setEditOpen(true);
                                }}>
                                    <PencilIcon />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="text-destructive"
                                    onSelect={(e) => {
                                        e.preventDefault();
                                        setDeleteOpen(true);
                                    }}
                                >
                                    <Trash />
                                    Delete
                                </DropdownMenuItem>
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
            <EditSettingsDialog
                open={editOpen}
                onOpenChange={setEditOpen}
                setting={setting}
            />
            <DeleteSettingsDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                gearId={setting.gearItemId}
                presetId={setting.presetId}
            />
        </Card>
    )
}