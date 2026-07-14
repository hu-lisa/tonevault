import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GearItem } from "@/db/schema";
import EditForm from "./editform";
import DeleteButton from "./deleteform";

export default function GearCard({ gear, userId }: { gear: GearItem, userId: number }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{gear.name}</CardTitle>
                <CardAction className="flex flex-row">
                    <EditForm gear={gear} userId={userId} />
                    <DeleteButton gearId={gear.id} userId={userId} />
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