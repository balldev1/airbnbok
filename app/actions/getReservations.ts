import prisma from '@/app/libs/prismadb';

interface IParams {
    listingId?: string;
    userId?: string;
    authorId?: string;
}

// { สรุปข้อมูลจาก params =>listingId, userId, authorId   =>แปลงข้อมูลวันที่เวลา reservations }
// {query.listing จะถูกกำหนดเป็น object ที่มี key เป็น userId 
// และค่าของ userId มาจากตัวแปร authorId ที่ได้รับจาก params}
export default async function getReservations(params: IParams) {

    try {
        const { listingId, userId, authorId } = params;

        const query: any = {};

        if (listingId) {
            query.listingId = listingId;
        };

        if (userId) {
            query.userId = userId;
        }

        if (authorId) {
            query.listing = { userId: authorId };
        }

        // {primsa.reservation => เงื่อนไขของ ...query ตามที่ระบุใน params  }
        // { include.listing }
        // { desc เรียงลำดับวันที่สร้างมาไปน้อย }
        const reservations = await prisma.reservation.findMany({
            where: query,
            include: {
                listing: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // { สรุปแปลงข้อมูลวันที่เวลา }
        // { ...reservations คัดลอกข้อมูลทั้งหมดเพือรักษาข้อมูลเดิม => reservations.map => }
        // { toISOString แปลงค่าวันที่ }
        // { copy info.listing => toISOString  }
        const safeReservations = reservations.map(
            (reservations) => ({
                ...reservations,
                createdAt: reservations.createdAt.toISOString(),
                startDate: reservations.startDate.toISOString(),
                endDate: reservations.endDate.toISOString(),
                listing: {
                    ...reservations.listing,
                    createdAt: reservations.listing.createdAt.toISOString()
                }
            })
        );

        return safeReservations;

    } catch (error: any) {
        throw new Error(error);
    }
}