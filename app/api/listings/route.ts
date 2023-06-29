import { NextResponse } from 'next/server';

import prisma from '@/app/libs/prismadb';
import getCurrentUser from '@/app/actions/getCurrentUser';

// {POST.rentModal}
export async function POST(request: Request) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.error();
    }

    // { get req.json = body }
    // { ใช้ object.key เพือเข้าถึง obj.body }
    // { .forEach แต่ละ loop.false ไหม ถ้า false => error }
    const body = await request.json();
    const { title, description, imageSrc, category, roomCount,
        bathroomCount, guestCount, location, price } = body;

    Object.keys(body).forEach((value: any) => {
        if (!body[value]) {
            NextResponse.error();
        }
    });

    // {prisma => create.listing => data}
    // {parseInt(price, 10) เพื่อแปลงตัวเลขจำนวนเต็มโดยใช้ฐานที่ 10 เป็นเลขฐาน}
    // {currentUser กำหนดค่าผู้ใช้ปัจจุบัน เพือนบันทึกข้อมูล}
    const listing = await prisma.listing.create({
        data: {
            title, description, imageSrc, category, roomCount,
            bathroomCount, guestCount, locationValue: location.value,
            price: parseInt(price, 10), userId: currentUser.id
        }
    })

    return NextResponse.json(listing);
}