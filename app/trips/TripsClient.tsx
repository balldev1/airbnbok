'use client'

import React, { useCallback, useState } from 'react'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

// {type}
import { SafeReservation, SafeUser } from '../types';

// { Component }
import Heading from '../components/Heading';
import Container from '../components/Container';
import ListingCard from '../components/listings/ListingCard';


// {interface from trip.page}
interface TripsClientProp {
    reservations?: SafeReservation[];
    currentUser?: SafeUser | null;
}

const TripsClient: React.FC<TripsClientProp> = ({
    reservations, currentUser

}) => {

    const router = useRouter();
    const [deletingId, setDeletingId] = useState('');

    // {api.delete(/api/reservation/${id}) => onaction => hadleCancel.listngCard}
    const onCancel = useCallback((id: string) => {
        setDeletingId(id);

        axios.delete(`/api/reservations/${id}`)
            .then(() => {
                toast.success('Reservation cancelled');
                router.refresh();
            })
            .catch((error) => {
                toast.error(error?.response?.data?.error);
            })
            .finally(() => {
                setDeletingId('');
            })

        return

    }, [router]);

    // {deletingId === reservations.id}
    // {onAcotin=callback{onCancel}=> api${id} => listingcard =>click.hadleCancel }
    return (
        <Container>
            <Heading
                title='Trips'
                subtitle="where you've been and where you're going"
            />
            <div
                className='mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3
           lg:grid:cols-4 xl:grid-cols-5 2xl:grid-6 gap-8'
            >
                {reservations?.map((reservations) => (
                    <ListingCard
                        key={reservations.id}
                        data={reservations.listing}
                        reservation={reservations}
                        actionId={reservations.id}
                        onAction={onCancel}
                        disabled={deletingId === reservations.id}
                        actionLabel='Cancel reservation'
                        currentUser={currentUser}
                    />
                ))}
            </div>
        </Container>
    )
}

export default TripsClient
