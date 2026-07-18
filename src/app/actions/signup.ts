'use server';
import { parse } from 'path';
import { z } from 'zod';
import { getUser, signIn } from './auth';
import bcrypt from 'bcrypt';
import { db } from '@/db';
import { loadouts, users } from '@/db/schema';
import { AuthError } from 'next-auth';

export async function signup({ email, password }: { email: string, password: string }) {

    //check if user already exists
    const existingUser = await getUser(email);
    if (existingUser) {
        return { errors: 'User already exists. Please use the login page.' };
    }

    const passwordHash = await bcrypt.hash(password, 12);

    //attempt insert into users table
    try {
        await db.insert(users).values({ email, passwordHash });
    } catch {
        return { errors: 'User already exists. Please use the login page.' };
    }

    try {
        await signIn('credentials', { email: email, password: password, redirectTo: '/dashboard' });
    } catch (error) {
        if (error instanceof AuthError) {
            return { errors: 'Something went wrong.' };
        }
        throw error;
    }
}