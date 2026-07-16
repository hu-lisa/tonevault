'use client'

import { updateSong } from "@/app/actions/songs"
import { Button } from "@/components/ui/button"
import { revalidatePath } from "next/cache";

export default function PracticeButton({ songId }: {songId: number }) {
    async function handlePractice() {
        await updateSong({ lastPracticedAt: new Date() }, songId);
    }

    return (
        <Button variant="outline" onClick={() => handlePractice()}>
            Practice
        </Button>
    )
}