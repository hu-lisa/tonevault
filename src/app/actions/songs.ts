'use server';

import { db } from "@/db";
import { songs } from "@/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";


export async function getSongs(userId: number) {
    try {
        const songsList = await db
            .select()
            .from(songs)
            .orderBy(sql`${songs.lastPracticedAt} desc nulls last`)
            .where(eq(songs.userId, userId));
        return songsList;
    } catch (error) {
        console.log('Failed to fetch songs: ', error);
        throw new Error("Failed to fetch songs.");
    }
}

export async function getCurrentSongs(userId: number) {
    try {
        const currentSongs = await db
            .select()
            .from(songs)
            .orderBy(sql`${songs.lastPracticedAt} desc nulls last`)
            .where(and(
                eq(songs.userId, userId), 
                eq(songs.status, 'currently_learning')
            )
        );
        return currentSongs;
    } catch (error) {
        console.log('Failed to fetch current songs: ', error);
        throw new Error("Failed to fetch current songs.");
    }
}