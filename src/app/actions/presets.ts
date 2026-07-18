'use server'

import { db } from "@/db";
import { gearItems, NewPresetSetting, Preset, presets, PresetSetting, presetSettings } from "@/db/schema";
import { and, asc, eq, isNull, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getUserId } from "./auth";

export async function addPreset(data: {
    songId: number;
    createdAt: Date;
    name: string;
    updatedAt: Date;
    loadoutId: number | null;
    isPublic: boolean;
}) {
    const userId = await getUserId();
    try {
        const presetId = await db.insert(presets).values({ ...data, userId: userId, createdBy: userId }).returning({ id: presets.id });
        revalidatePath(`/dashboard/songs/${data.songId}`);
        return { id: presetId[0].id };
    } catch {
        return { error: 'Something went wrong' };
    }
}

export async function presetExists(songId: number, loadoutId: number | null, name: string, presetId?: number) {
    const userId = await getUserId();
    try {
        const preset = await db
            .select()
            .from(presets)
            .where(and(
                eq(presets.name, (name === "") ? 'Main' : name),
                loadoutId ? eq(presets.loadoutId, loadoutId) : undefined,
                eq(presets.songId, songId),
                eq(presets.userId, userId),
                presetId ? ne(presets.id, presetId) : undefined,
            ));
        return preset.length > 0;
    } catch (error) {
        throw error;
    }
}

export async function addSettings(settings: NewPresetSetting[]) {
    try {
        await Promise.all(settings.map(async (s) =>
            await db.insert(presetSettings).values(s)
        ));
        return;
    } catch {
        return { error: 'Something went wrong.' };
    }
}

export async function getSettings(presetId: number) {
    const userId = await getUserId();
    try {
        const settings = await db
            .select({
                presetId: presetSettings.presetId,
                gearItemId: presetSettings.gearItemId,
                settings: presetSettings.settings,
                name: gearItems.name,
            })
            .from(presetSettings)
            .innerJoin(gearItems, eq(presetSettings.gearItemId, gearItems.id))
            .where(and(eq(presetSettings.presetId, presetId), eq(gearItems.userId, userId)))
            .orderBy(asc(gearItems.type));
        return settings;
    } catch (error) {
        throw error;
    }
}

export async function getPresets(songId: number, loadoutId: number | null) {
    const userId = await getUserId();
    try {
        const items = await db
            .select()
            .from(presets)
            .where(and(
                eq(presets.userId, userId),
                eq(presets.songId, songId),
                (loadoutId) ? eq(presets.loadoutId, loadoutId) : isNull(presets.loadoutId),
            ));
        return items;
    } catch (error) {
        throw error;
    }
}

export async function deleteSetting(presetId: number, gearId: number) {
    const userId = await getUserId();
    try {
        const [preset] = await db
            .select({ songId: presets.songId })
            .from(presets)
            .where(and(eq(presets.id, presetId), eq(presets.userId, userId)));
        await db
            .delete(presetSettings)
            .where(and(
                eq(presetSettings.presetId, presetId),
                eq(presetSettings.gearItemId, gearId))
            );
        if (preset) {
            revalidatePath(`/dashboard/songs/${preset.songId}`);
        }
    } catch {
        return { error: 'Something went wrong. ' };
    }
}

export async function updateSetting(newSettings: PresetSetting) {
    const userId = await getUserId();
    try {
        const [preset] = await db
            .select({ songId: presets.songId })
            .from(presets)
            .where(and(eq(presets.id, newSettings.presetId), eq(presets.userId, userId)));
        await db
            .update(presetSettings)
            .set({ settings: newSettings.settings })
            .where(and(
                eq(presetSettings.presetId, newSettings.presetId),
                eq(presetSettings.gearItemId, newSettings.gearItemId))
            );
        
        if (preset) {
            console.log('Updated!');
            revalidatePath(`/dashboard/songs/${preset.songId}`);
        }
    } catch (error) {
        return { error: 'Something went wrong.' };
    }
}

export async function deletePreset(preset: Preset) {
    const userId = await getUserId();
    try {
        await db
            .delete(presets)
            .where(and(eq(presets.id, preset.id), eq(presets.userId, userId)));
        revalidatePath(`/dashboard/songs/${preset.songId}`);
    } catch {
        return { error: 'Something went wrong. ' };
    }
}

export async function updatePreset(presetId: number, songId: number, name: string) {
    const userId = await getUserId();
    try {
        await db
            .update(presets)
            .set({ name: name })
            .where(and(eq(presets.id, presetId), eq(presets.userId, userId)));
        revalidatePath(`/dashboard/songs/${songId}`);
    } catch {
        return { error: 'Something went wrong.' };
    }
}