'use server';

import { db } from "@/db";
import { NewSong, Song, songs } from "@/db/schema";
import { eq, and, sql, desc, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";


export async function getSongs(userId: number) {
    try {
        const songsList = await db
            .select()
            .from(songs)
            .orderBy(desc(songs.id))
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

export async function addSong(song: NewSong) {
    try {
        const [dupe] = await db
            .select()
            .from(songs)
            .where(and(eq(songs.title, song.title), eq(songs.artist, song.artist), eq(songs.userId, song.userId)))
            .limit(1);
        if (dupe) {
            return { error: `The song "${song.title}" by ${song.artist} already exists in your library.` }
        }
        await db.insert(songs).values(song);
        revalidatePath('/dashboard/songs');
    } catch (error) {
        console.log('Failed to add song: ', error);
        return { error: 'Something went wrong.'};
    }
}

export async function updateSong(fields: any, id: number, userId: number) {
    try {
        if (fields?.title && fields?.artist) {
            const [dupe] = await db
            .select()
            .from(songs)
            .where(and(eq(songs.title, fields.title), eq(songs.artist, fields.artist), eq(songs.userId, userId), ne(songs.id, id)))
            .limit(1);
            if (dupe) {
                return { error: `The song "${fields.title}" by ${fields.artist} already exists in your library.` }
            }
        }
        await db
            .update(songs)
            .set(fields)
            .where(and(eq(songs.userId, userId), eq(songs.id, id)));
        revalidatePath('/dashboard/songs');
        revalidatePath(`/dashboard/songs/${id}`);
    } catch (error) {
        return { error: 'Something went wrong.' };
    }
}

export async function deleteSong(id: number, userId: number) {
    try {
        await db
            .delete(songs)
            .where(and(eq(songs.userId, userId), eq(songs.id, id)));
    } catch (error) {
        return { error: 'Something went wrong.' };
    }
}