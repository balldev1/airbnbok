import prisma from '@/app/libs/prismadb'


// {Param}
export interface IListingsParams {
    userId?: string;
    guestCount?: number;
    roomCount?: number;
    bathroomCount?: number;
    startDate?: string;
    endDate?: string;
    locationValue?: string;
    category?: string;
}

// {ข้อมูลจากฐานข้อมูล prisma.listing => createdAt มากไปน้อย => listings}
// {params = userId => query.userId => where : query ใช้ค่าที่อยู่ใน query คือ userId.params}
export default async function getListings(params: IListingsParams) {
    try {

        const {
            userId,
            roomCount,
            guestCount,
            bathroomCount,
            locationValue,
            startDate,
            endDate,
            category,
        } = params;

        let query: any = {};

        if (userId) {
            query.userId = userId;
        }

        if (category) {
            query.category = category;
        }

        // {roomCount gte: +roomCount คือ gte = > : + คือเป็นเลขจำนวนเต็ม
        // {roomCount,guestCount,bathroomCount}
        if (guestCount) {
            query.guestCount = {
                gte: +guestCount
            }
        }

        if (bathroomCount) {
            query.bathroomCount = {
                gte: +bathroomCount
            }
        }

        if (bathroomCount) {
            query.bathroomCount = {
                gte: +bathroomCount
            }
        }

        // { locationValue }
        if (locationValue) {
            query.locationValue = locationValue;
        }

        // { startDate && endDate } { gte > | < lte }
        // { ตรวจสอบ ช่วงเวลาไม่ทับซ้อนกัน  เงื่อนไขช้ในการตรวจสอบช่วงเวลาทับซ้อนของการจอง คือการตรวจสอบว่ามีการจองที่ช่วงเวลาทับซ้อนกับช่วงเวลาที่กำหนดหรือไม่}
        // { หมายความว่าวันสิ้นสุดและวันเริ่มต้นต้องเป็นวันเดียวกัน }
        // {query.NOT.reservations.some.or เพื่อให้เงื่อนไขทั้งสองสามารถเป็นจริงได้เพียงเงื่อนไขใดก็ได้ 
        // คือ ถ้ามีการจองที่เข้าข่ายกับเงื่อนไขใดเงื่อนไขหนึ่ง ก็จะถือว่าเงื่อนไขนี้เป็นจริง}
        if (startDate && endDate) {
            query.NOT = {
                reservations: {
                    some: {
                        OR: [
                            {
                                endDate: { gte: startDate },
                                startDate: { lte: startDate }
                            },
                            {
                                startDate: { lte: endDate },
                                endDate: { gte: endDate }
                            }
                        ]
                    }
                }
            }
        }

        const listings = await prisma.listing.findMany({
            where: query,
            orderBy: {
                createdAt: 'desc'
            }
        });


        // {...listing เพือกระจายคุณสมบัติ listhing ไปรายการใหม่ safeListings}
        // {สร้างวันเวลาตามสากล}
        const safeListings = listings.map((listing) => ({
            ...listing,
            createdAt: listing.createdAt.toISOString(),
        }));

        return safeListings;
    } catch (error: any) {
        throw new Error(error);
    }
}
