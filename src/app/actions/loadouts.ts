'use server'

import { db } from "@/db"
import { loadouts } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function getLoadouts(userId: number) {
    try {
        const items = await db.select().from(loadouts).where(eq(loadouts.userId, userId));
        return items;
    } catch (error) {
        throw error;
    }
}