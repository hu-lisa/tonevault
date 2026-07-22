import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GearItem } from "@/db/schema";
import EditForm from "./editform";
import DeleteButton from "./deleteform";

export default function GearCard({ gear }: { gear: GearItem }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{gear.name}</CardTitle>
                <CardAction className="flex flex-row gap-2">
                    <EditForm gear={gear} />
                    <DeleteButton gearId={gear.id} />
                </CardAction>
            </CardHeader>
            <CardContent>
                {gear.notes &&
                    <div>
                        <p>{gear.notes}</p>
                    </div>
                }
            </CardContent>
        </Card>
    )
}