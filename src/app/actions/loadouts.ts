'use server'

import { db } from "@/db"
import { loadouts } from "@/db/schema"
import { eq } from "drizzle-orm"
import { getUserId } from "./auth";

export async function getLoadouts() {
    const userId = await getUserId();
    try {
        const items = await db.select().from(loadouts).where(eq(loadouts.userId, userId));
        return items;
    } catch (error) {
        throw error;
    }
}