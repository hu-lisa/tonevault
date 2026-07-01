'use server';
import { parse } from 'path';
import { z } from 'zod';
import { getUser, signIn } from './auth';
import bcrypt from 'bcrypt';
import { db } from '@/db';
import { users } from '@/db/schema';


const SignUpSchema = z.object({
    email: z.email("Please enter a valid email address."),
    password: z.string().min(6, "Password must be longer than 6 characters."),
});

export async function signup(
    prevState: any,
    formData: FormData,
) {
    const parsedCredentials = SignUpSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    });
    if (!parsedCredentials.success) {
        return { errors: z.flattenError(parsedCredentials.error).fieldErrors};
    }

    const { email, password } = parsedCredentials.data;

    const existingUser = await getUser(email);
    if (existingUser) {
        return { errors: { email: ['User already exists. Please use the login page.'] }};
    }

    const passwordHash = await bcrypt.hash(password, 12);

    try {
        await db.insert(users).values({ email, passwordHash });
    } catch {
        return { errors: { email: ['User already exists. Please use the login page.'] }};
    }
    await signIn('credentials', formData);
    return { success: [true] };
}