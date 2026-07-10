import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getEmail(id: number) {
    try {
        const [result] = await db
            .select({ email: users.email })
            .from(users)
            .where(eq(users.id, id));

        return result?.email;
    } catch (error) {
        throw new Error('failed to fetch email');
    }
}

export async function updatePassword(id: number, prev: string, pw: string) {

}