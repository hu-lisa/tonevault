'use server'

import { db } from "@/db"
import { gearItems, NewGearItem } from "@/db/schema"
import { and, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache";

export async function getGearItems(userId: number) {
    try {
        const items = await db
            .select()
            .from(gearItems)
            .where(eq(gearItems.userId, userId));
        return items;
    } catch (error) {
        throw new Error('Failed to fetch gear items');
    }
}

export async function addGear(gear: NewGearItem) {
    try {
        await db.insert(gearItems).values(gear);
        revalidatePath('/dashboard/gear')
    } catch (error) {
        return { error: 'Something went wrong.' };
    }
}

export async function updateGear(fields: any, gearId: number, userId: number) {
    try {
        await db
            .update(gearItems)
            .set(fields)
            .where(and(eq(gearItems.userId, userId), eq(gearItems.id, gearId)));
        revalidatePath('/dashboard/gear');
    } catch (error) {
        return { error: 'Something went wrong.' };
    }
}

export async function deleteGear(gearId: number, userId: number) {
    try {
        await db.delete(gearItems).where(and(eq(gearItems.userId, userId), eq(gearItems.id, gearId)));
    } catch (error) {
        return { error: 'Something went wrong.' };
    }
}