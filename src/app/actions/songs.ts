'use server';

import { db } from "@/db";
import { Song, songs } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";


export async function getSongs(userId: number) {
    try {
        const songsList = await db
            .select()
            .from(songs)
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

export async function getSongById(songId: number, userId: number) {
    try {
        const [song] = await db
            .select()
            .from(songs)
            .where(and(eq(songs.id, songId), eq(songs.userId, userId)))
            .limit(1);
        return song;
    } catch (error) {
        console.log('Failed to fetch song by id: ', error);
        throw new Error(`Failed to fetch song with id ${songId} and user ${userId}`);
    }
}