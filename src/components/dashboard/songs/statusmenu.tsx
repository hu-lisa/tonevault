'use client'
import { updateSong } from "@/app/actions/songs";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Song } from "@/db/schema";

export default function StatusMenu({ song }: { song: Song }) {
    return (
        <Select defaultValue={song.status} onValueChange={(value) => {
            updateSong({status: value}, song.id, song.userId);
        }}>
            <SelectTrigger>
                <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper">
                <SelectGroup>
                    <SelectItem value="currently_learning">Currently Learning</SelectItem>
                    <SelectItem value="learned">Learned</SelectItem>
                    <SelectItem value="want_to_learn">Planned</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}