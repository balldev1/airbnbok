// {PRISMA}
import prisma from '@/app/libs/prismadb'

interface IParams {
    listingId?: string;
}

// {}
export default async function getListingById(params: IParams) {
    try {
        // {params}
        const { listingId } = params;

        // {prisma} user:true => include prisma.user
        // {หมายความว่าผู้ใช้ที่เกี่ยวข้องกับแต่ละรายการจะถูกดึงมาด้วย}
        const listing = await prisma.listing.findUnique({
            where: {
                id: listingId
            },
            include: {
                user: true
            }
        });

        if (!listing) {
            return null;
        }

        // {ส่งข้อมูลกลับ listing เปลี่ยนข้อมูล listing.createdAt}
        // {prisma.listing.user => user.createat,upadteat.emailverified}
        //{  ...listing เพื่อคัดลอกค่าทั้งหมดจาก object listing แล้วนำมาใช้ในการสร้าง object ใหม่}
        return {
            ...listing,
            createdAt: listing.createdAt.toISOString(),
            user: {
                ...listing.user,
                createdAt: listing.user.createdAt.toISOString(),
                updatedAt: listing.user.updatedAt.toISOString(),
                emailVerified: listing.user.emailVerified?.toDateString() || null,
            }
        };
    } catch (error: any) {
        throw new Error(error);

    }
}