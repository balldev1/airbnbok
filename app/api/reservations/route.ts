import { NextResponse } from "next/server";

import prisma from '@/app/libs/prismadb';
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(request: Request) {

    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.error();
    }

    // { req.json }
    const body = await request.json();

    const { listingId, startDate, endDate, totalPrice } = body;

    if (!listingId || !startDate || !endDate || !totalPrice) {
        return NextResponse.error();
    }

    // { prisma.update => listing => current.id === list.id =>
    //  data => reservation => ... create user.Id === current.id  }
    const listingAndReservation = await prisma.listing.update({
        where: {
            id: listingId
        },
        data: {
            reservations: {
                create: {
                    userId: currentUser.id,
                    startDate,
                    endDate,
                    totalPrice
                }
            }
        }
    });

    return NextResponse.json(listingAndReservation)
}

