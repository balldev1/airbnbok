import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from '@/app/libs/prismadb';

// {params from TripsClient }
interface IParams {
    reservationId?: string;
}

export async function DELETE(request: Request, { params }: { params: IParams }) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.error();
    }

    // { reservationId }
    const { reservationId } = params;

    if (!reservationId || typeof reservationId !== 'string') {
        throw new Error('Invalid ID');
    }

    // {prisma.delete = prismaid === reservationId}
    // { or [ => prisma.userId/listing === currentUser.id ] }
    const reservation = await prisma.reservation.deleteMany({
        where: {
            id: reservationId,
            OR: [
                { userId: currentUser.id },
                { listing: { userId: currentUser.id } }
            ]
        }
    })

    return NextResponse.json(reservation);
}