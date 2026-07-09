'use client'

import { updateSong } from "@/app/actions/songs"
import { Button } from "@/components/ui/button"
import { revalidatePath } from "next/cache";

export default function PracticeButton({ songId, userId }: {songId: number, userId: number }) {
    async function handlePractice() {
        await updateSong({ lastPracticedAt: new Date() }, songId, userId);
    }

    return (
        <Button variant="outline" onClick={() => handlePractice()}>
            Practice
        </Button>
    )
}