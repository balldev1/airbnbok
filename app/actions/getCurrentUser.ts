// {SERVER}
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

// {PRISMA}
import prisma from '@/app/libs/prismadb'

// {GET.SESSION}
export async function getSession() {
    return await getServerSession(authOptions)
}

// {GET.CURRENT.USER} => {await GET.SESSION.ที่เข้าระบบปัจจุบัน} 
// {where prisma.email === session.email}
export default async function getCurrentUser() {
    try {
        const session = await getSession();

        if (!session?.user?.email) {
            return null;
        }

        const currentUser = await prisma.user.findUnique({
            where: {
                email: session.user.email as string
            }
        });

        if (!currentUser) {
            return null;
        }

        // {toISOString(), แปลง date => string}
        return {
            ...currentUser,
            createdAt: currentUser.createdAt.toISOString(),
            updatedAt: currentUser.updatedAt.toISOString(),
            emailVerified: currentUser.emailVerified?.toISOString() || null
        };
    } catch (error: any) {
        return null;
    }
}