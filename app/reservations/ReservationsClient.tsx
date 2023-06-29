'use client';

import { toast } from "react-hot-toast";
import axios from "axios";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import { SafeReservation, SafeUser } from "@/app/types"
    ;
import Heading from "@/app/components/Heading";
import Container from "@/app/components/Container";
import ListingCard from "@/app/components/listings/ListingCard";

interface ReservationsClientProps {
    reservations: SafeReservation[],
    currentUser?: SafeUser | null,
}

const ReservationsClient: React.FC<ReservationsClientProps> = ({
    reservations,
    currentUser
}) => {

    const router = useRouter();
    const [deletingId, setDeletingId] = useState('');

    // { onCancel => onAction => delete.api/reservations}
    const onCancel = useCallback((id: string) => {
        setDeletingId(id);

        axios.delete(`/api/reservations/${id}`)
            .then(() => {
                toast.success('Reservetaion cancelled');
                router.refresh();
            })
            .catch(() => {
                toast.error('Something went wrong');
            })
            .finally(() => {
                setDeletingId('');
            })
    }, [router])

    return (
        <Container>
            <Heading
                title="Reservations"
                subtitle="Bookings on your properties"
            />
            <div
                className="mt-10 grid gird-col-1 sm:gird-cols-2 md:grid-cols-3
                lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8"
            >
                {reservations.map((reservation) => (
                    <ListingCard
                        key={reservation.id}
                        data={reservation.listing}
                        reservation={reservation}
                        actionId={reservation.id}
                        onAction={onCancel}
                        disabled={deletingId === reservation.id}
                        actionLabel="Cancel guest reservation"
                        currentUser={currentUser}
                    />
                ))}
            </div>
        </Container>
    )
}

export default ReservationsClient
