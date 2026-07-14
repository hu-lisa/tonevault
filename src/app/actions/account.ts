'use server'
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getUserId, signIn } from "./auth";
import { AuthError } from "next-auth";
import bcrypt from 'bcrypt';
import { logOut } from "./login";

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

export async function updatePassword(id: number, password: string) {
    try {
        const newHash = await bcrypt.hash(password, 12);
        await db.update(users).set({ passwordHash: newHash }).where(eq(users.id, id));
    } catch (error) {
        return { error: 'Something went wrong. '};
    }
}


export async function validate(id: number, password: string) {
    try {
        const email = await getEmail(id);
        await signIn('credentials', {
            email,
            password,
            redirect: false,
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return { error: 'Invalid password' }
                default:
                    return { error: 'Something went wrong' }     
            }
        }
        throw(error);
    }
}

export async function deleteUser(id: number) {
    try {
        await db.delete(users).where(eq(users.id, id));
        await logOut();
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return { error: 'Invalid credentials.' };
                default:
                    return { error: 'Something went wrong. '};
            }
        }
        throw error;
    }
}