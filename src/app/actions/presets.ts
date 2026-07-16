'use server'

import { db } from "@/db";
import { gearItems, NewPreset, NewPresetSetting, presets, PresetSetting, presetSettings } from "@/db/schema";
import { and, asc, eq, isNull } from "drizzle-orm";

export async function addPreset(data: NewPreset) {
    try {
        const presetId = await db.insert(presets).values(data).returning({ id: presets.id });
        return { id: presetId[0].id };
    } catch {
        return { error: 'Something went wrong' };
    }
}

export async function presetExists(userId: number, songId: number, loadoutId: number | null, name: string) {
    try {
        if (loadoutId) {
            const preset = await db
            .select()
            .from(presets)
            .where(and(
                eq(presets.name, (name === "") ? 'Main' : name),
                eq(presets.loadoutId, loadoutId),
                eq(presets.songId, songId),
                eq(presets.userId, userId),
            ));
            return preset.length > 0;
        } else {
            const preset = await db
                .select()
                .from(presets)
                .where(and(
                    eq(presets.name, (name === "") ? 'Main' : name),
                    isNull(presets.loadoutId),
                    eq(presets.songId, songId),
                    eq(presets.userId, userId),
                ));
                console.log((preset.length > 0) ? 'exists' : 'doesnt exist');
            return preset.length > 0;
        }
    } catch (error) {
        throw error;
    }
}

export async function addSettings(settings: NewPresetSetting[]) {
    try {
        settings.map(async (s) => 
            await db.insert(presetSettings).values(s)
        );
        return;
    } catch {
        return { error: 'Something went wrong.' };
    }
}

export async function getSettings(presetId: number) {
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
            .where(eq(presetSettings.presetId, presetId))
            .orderBy(asc(gearItems.type));
        return settings;
    } catch (error) {
        throw error;
    }
}

export async function getPresets(userId: number, songId: number, loadoutId: number | null) {
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
    try {
        await db
            .delete(presetSettings)
            .where(and(
                eq(presetSettings.presetId, presetId), 
                eq(presetSettings.gearItemId, gearId))
            );
    } catch (error) {
        throw error;
    }
}

export async function editSetting(newSettings: PresetSetting) {
    try {
        await db
            .update(presetSettings)
            .set({ settings: newSettings.settings })
            .where(and(
                eq(presetSettings.presetId, newSettings.presetId), 
                eq(presetSettings.gearItemId, newSettings.gearItemId))
            );
    } catch (error) {
        throw error;
    }
}