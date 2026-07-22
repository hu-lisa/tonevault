import NextAuth, { type DefaultSession } from "next-auth";
import { authConfig } from "../../../auth.config";
import Credentials from "next-auth/providers/credentials"
import z from "zod";
import type { User } from '@/db/schema';
import bcrypt from 'bcrypt';
import { db } from '@/db/index';
import { users } from '@/db/schema'
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

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

export async function getUserId() {
    const session = await auth();
    if (!session) {
        redirect('/');
    }
    const userId = Number(session.user.id);
    return userId;
}

declare module "next-auth" {
    interface Session {
      user: {
        id: string
      } & DefaultSession["user"]
    }
};

declare module "@auth/core/jwt" {
    interface JWT {
        id: string
    }
}

export const { signIn, signOut, auth } = NextAuth({
    ...authConfig,
    callbacks: {
        ...authConfig.callbacks,
        jwt({ token, user }) {
          if (user?.id) {
            token.id = user.id
          }
          return token
        },
        session({ session, token }) {
          session.user.id = token.id
          return session
        },
    },
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