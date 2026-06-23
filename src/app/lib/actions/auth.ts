import NextAuth from "next-auth";
import { authConfig } from "../../../../auth.config";
import Credentials from "next-auth/providers/credentials"
import z from "zod";
import type { User } from '@/db/schema';
import bcrypt from 'bcrypt';
import { db } from '@/db/index';
import { users } from '@/db/schema'
import { eq } from "drizzle-orm";

export async function getUser(email: string): Promise<User | undefined> {
    try {
        const user = await db.select().from(users).where(eq(users.email, email));
        //select * from users where email = email
        return user[0];
    } catch (error) {
        console.error('Failed to fetch user: ', error);
        throw new Error('Failed to fetch user.');
    }
}

export const { signIn, signOut, auth } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.email(), password: z.string().min(6) })
                    .safeParse(credentials);
                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await getUser(email);
                    if (!user) {
                        return null;
                    }
                    const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
                    if (passwordsMatch) {
                        return { id: String(user.id), email: user.email };
                    }
                }
                console.log('Invalid credentials.');
                return null;
            }
        })
    ],
});