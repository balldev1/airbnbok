import prisma from '@/app/libs/prismadb';

import getCurrentUser from './getCurrentUser';

// {  prisma.listing => find => listing.id === currentUser.favoriteIds }
// {  [] คือการกระจายค่า currentUser.favoriteIds ให้อยู่ใน array }
// { => ได้ favorites เอามา map =>  ...favorites คือการกระจาย (spread) รายการ favorites เข้ากับออบเจกต์ใหม่ }
// { createdAt แปลงให้เป็น ISO string  แปลงค่าวันที่และเวลาเป็นรูปแบบของ ISO string. }
export default async function getFavoriteListings() {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return [];
        }

        const favorites = await prisma.listing.findMany({
            where: {
                id: {
                    in: [...(currentUser.favoriteIds || [])]
                }
            }
        });
        // {favorite}
        const safeFavorites = favorites.map((favorite) => ({
            ...favorite,
            createdAt: favorite.createdAt.toString(),
        }));

        return safeFavorites;
    } catch (error: any) {
        throw new Error(error);
    }
}