'use server'

import { db } from "@/db"
import { gearItems, loadoutItems } from "@/db/schema"
import { and, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache";
import { getUserId } from "./auth";

export async function getGearItems(loadoutId: number | null) {
    const userId = await getUserId();
    try {
        if (loadoutId) {
            const items = await db
                .select({
                    id: gearItems.id,
                    userId: gearItems.userId,
                    type: gearItems.type,
                    name: gearItems.name,
                    notes: gearItems.notes,
                    createdAt: gearItems.createdAt,
                    updatedAt: gearItems.updatedAt,
                })
                .from(loadoutItems)
                .innerJoin(gearItems, eq(loadoutItems.gearItemId, gearItems.id))
                .where(and(eq(loadoutItems.loadoutId, loadoutId), eq(gearItems.userId, userId)));
            return items;
        } else {
            const items = await db
                .select()
                .from(gearItems)
                .where(eq(gearItems.userId, userId));
            return items;
        }
    } catch {
        throw new Error('Failed to fetch gear items');
    }
}

export async function addGear(newGear: any, loadoutId: number | null) {
    const userId = await getUserId();
    try {
        const gear = await db.insert(gearItems).values({ ...newGear, userId: userId }).returning({ id: gearItems.id });
        if (loadoutId) {
            await db.insert(loadoutItems).values({ loadoutId: loadoutId, gearItemId: gear[0].id });
        }
        revalidatePath('/dashboard/gear');
    } catch (error) {
        return { error: 'Something went wrong.' };
    }
}

export async function updateGear(fields: any, gearId: number) {
    const userId = await getUserId();
    try {
        await db
            .update(gearItems)
            .set({ name: fields.name, type: fields.type, notes: fields.notes })
            .where(and(eq(gearItems.userId, userId), eq(gearItems.id, gearId)));
        revalidatePath('/dashboard/gear');
    } catch (error) {
        return { error: 'Something went wrong.' };
    }
}

export async function deleteGear(gearId: number) {
    const userId = await getUserId();
    try {
        await db.delete(gearItems).where(and(eq(gearItems.userId, userId), eq(gearItems.id, gearId)));
    } catch (error) {
        return { error: 'Something went wrong.' };
    }
}

export async function getGearById(gearId: number) {
    const userId = await getUserId();
    try {
        const results = await db
            .select()
            .from(gearItems)
            .where(and(eq(gearItems.userId, userId), eq(gearItems.id, gearId)));
        return results[0];
    } catch (error) {
        throw error;
    }
}