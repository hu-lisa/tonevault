'use server';

import { db } from "@/db";
import { songs } from "@/db/schema";
import { eq, and, sql, desc, ne, ilike } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getUserId } from "./auth";


export async function getSongs() {
    const userId = await getUserId();
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

const SONG_STATUSES = ['want_to_learn', 'currently_learning', 'learned'] as const;

export async function getSongsWithTags({ searchParams }: {
    searchParams: { 
        page?: string, 
        q?: string, 
        status?: string, 
        filter?: string,
    } | undefined,
}) {
    const userId = await getUserId();
    const page = Number(searchParams?.page ?? "1");
    const q = searchParams?.q ?? "";
    const status = searchParams?.status ?? 'all';
    const pageSize = 15;

    try {
        const [songsList, totalCount] = await Promise.all([
            db.query.songs.findMany({
                where: and(
                    eq(songs.userId, userId),
                    q ? ilike(songs.title, `%${q}%`) : undefined,
                    (status !== 'all') ? eq(songs.status, status as typeof SONG_STATUSES[number]) : undefined,
                ),
                orderBy: (songs, {desc, sql}) => [
                    ...searchParams?.filter === 'lastPracticedAt' 
                        ? [sql`${songs.lastPracticedAt} desc nulls last`] 
                        : [],
                    desc(songs.id),
                ],
                with: {
                    songTags: {
                        with: { tag: true },
                    },
                },
                limit: pageSize,
                offset: (Number(page) - 1) * pageSize,
            }),
            db.$count(songs, and(
                eq(songs.userId, userId),
                q ? ilike(songs.title, `%${q}%`) : undefined,
                (status !== 'all') ? eq(songs.status, status as typeof SONG_STATUSES[number]) : undefined,
            )),
        ]);
        return {
            data: songsList.map(({ songTags, ...song }) => ({
                ...song,
                tags: songTags.map((st) => st.tag),
            })),
            pageCount: Math.ceil(totalCount / pageSize),
        };
    } catch (error) {
        console.log('Failed to fetch songs: ', error);
        throw new Error("Failed to fetch songs.");
    }
}

export async function getCurrentSongs() {
    const userId = await getUserId();
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

export async function getSongById(songId: number) {
    const userId = await getUserId();
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

export async function addSong(song: any) {
    const userId = await getUserId();
    try {
        const [dupe] = await db
            .select()
            .from(songs)
            .where(and(eq(songs.title, song.title), eq(songs.artist, song.artist), eq(songs.userId, userId)))
            .limit(1);
        if (dupe) {
            return { error: `The song "${song.title}" by ${song.artist} already exists in your library.` }
        }
        await db.insert(songs).values({ ...song, userId: userId });
        revalidatePath('/dashboard/songs');
    } catch (error) {
        console.log('Failed to add song: ', error);
        return { error: 'Something went wrong.' };
    }
}

export async function updateSong(
    fields: any, 
    id: number
) {
    const userId = await getUserId();
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
            .set({ 
                title: fields.title, 
                artist: fields.artist, 
                status: fields.status, 
                sourceLink: fields.sourceLink, 
                lastPracticedAt: fields.lastPracticedAt,
            })
            .where(and(eq(songs.userId, userId), eq(songs.id, id)));
        revalidatePath('/dashboard/songs');
        revalidatePath(`/dashboard/songs/${id}`);
    } catch (error) {
        return { error: 'Something went wrong.' };
    }
}

export async function deleteSong(id: number) {
    const userId = await getUserId();
    try {
        await db
            .delete(songs)
            .where(and(eq(songs.userId, userId), eq(songs.id, id)));
    } catch (error) {
        return { error: 'Something went wrong.' };
    }
}