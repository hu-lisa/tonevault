'use server'

import { NewTag, songs, songTags, Tag, tags } from "@/db/schema";
import { getUserId } from "./auth";
import { db } from "@/db";
import { revalidatePath } from "next/cache";
import { and, eq, isNull, ne } from "drizzle-orm";

export async function updateTags(songId: number, selected: { id: number, name: string }[]) {
    //only DISPLAY tags in the form (available for user to select) that are not attached to song
    //if doesn't show up, create new --> check client side that it's not alr attached
    // Everything sent to this function should be existing tags or newly created, but should all need to be attached to the song

    const userId = await getUserId();
    try {
        const [song] = await db.select().from(songs).where(and(eq(songs.id, songId), eq(songs.userId, userId)));
        if (!song) {
            throw Error;
        }

        await Promise.all(selected.map(async (t) => {
            if (t.id < 0) {
                //create tag if it doesnt exist
                const [tagId] = await db
                    .insert(tags)
                    .values({ userId: userId, name: t.name })
                    .returning({ id: tags.id });

                await db
                    .insert(songTags)
                    .values({ songId: songId, tagId: tagId.id });
            } else {
                const [tag] = await db
                    .select()
                    .from(tags)
                    .where(and(eq(tags.id, t.id), eq(tags.userId, userId)));
                if (!tag) {
                    throw Error;
                }
                await db
                    .insert(songTags)
                    .values({ songId: songId, tagId: t.id });
            }
        }));
        revalidatePath(`/dashboard/songs/${songId}`);
    } catch {
        return { error: 'Something went wrong' };
    }
}

export async function deleteTag(tag: Tag, songId: number) {
    const userId = await getUserId();
    try {
        await db.delete(tags).where(and(eq(tags.userId, userId), eq(tags.id, tag.id)));
        revalidatePath(`/dashboard/songs/${songId}`);
    } catch {
        return { error: 'Something went wrong' };
    }
}

export async function deleteTagFromSong(tag: Tag, songId: number) {
    const userId = await getUserId();
    try {
        const [exists] = await db
            .select()
            .from(tags)
            .where(and(eq(tags.userId, userId), eq(tags.id, tag.id)));
        if (!exists) {
            throw Error;
        }
        await db
            .delete(songTags)
            .where(and(eq(songTags.tagId, tag.id), eq(songTags.songId, songId)));
        revalidatePath(`/dashboard/songs/${songId}`);
    } catch (error) {
        throw error;
    }
}

export async function getTags(songId: number) {
    const userId = await getUserId();
    try {
        const items = await db
            .select({
                id: songTags.tagId,
                name: tags.name,
                userId: tags.userId,
            })
            .from(songTags)
            .innerJoin(tags, eq(songTags.tagId, tags.id))
            .where(and(eq(songTags.songId, songId), eq(tags.userId, userId)));
        return items;
    } catch (error) {
        throw error;
    }
}

export async function getUnusedTags(songId: number) {
    const userId = await getUserId();
    try {
        const items = await db
            .select({
                id: tags.id,
                name: tags.name,
            })
            .from(tags)
            .leftJoin(songTags, and(eq(songTags.tagId, tags.id), eq(songTags.songId, songId)))
            .where(and(eq(tags.userId, userId), isNull(songTags.tagId)));
        return items;
    } catch (error) {
        throw error;
    }
}