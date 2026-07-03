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
        <Select defaultValue={song.status}>
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