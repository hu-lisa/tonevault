import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GearItem } from "@/db/schema";
import EditForm from "./editform";
import DeleteButton from "./deleteform";

export default function GearCard({ gear }: { gear: GearItem }) {
    return (
        <Card className="h-44">
            <CardHeader>
                <CardTitle className="truncate">{gear.name}</CardTitle>
                <CardAction className="flex flex-row gap-2">
                    <EditForm gear={gear} />
                    <DeleteButton gearId={gear.id} />
                </CardAction>
            </CardHeader>
            {gear.notes &&
                <CardContent>
                    <p className="whitespace-pre-line text-sm text-muted-foreground line-clamp-4">
                        {gear.notes}
                    </p>
                </CardContent>
            }
        </Card>
    )
}