'use client'

import React, { useCallback, useState } from 'react'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

// {type}
import { SafeListing, SafeUser } from '../types';

// { Component }
import Heading from '../components/Heading';
import Container from '../components/Container';
import ListingCard from '../components/listings/ListingCard';


// {interface from trip.page}
interface PropertiesClientProp {
    listings: SafeListing[];
    currentUser?: SafeUser | null;
}

const PropertiesClient: React.FC<PropertiesClientProp> = ({
    listings, currentUser

}) => {

    const router = useRouter();
    const [deletingId, setDeletingId] = useState('');

    // {api.delete(/api/reservation/${id}) => onaction => hadleCancel.listngCard}
    const onDelete = useCallback((id: string) => {
        setDeletingId(id);

        axios.delete(`/api/listings/${id}`)
            .then(() => {
                toast.success('Listing deleted');
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
                title='Properties'
                subtitle="List of your properties"
            />
            <div
                className='mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3
           lg:grid:cols-4 xl:grid-cols-5 2xl:grid-6 gap-8'
            >
                {listings.map((listing) => (
                    <ListingCard
                        key={listing.id}
                        data={listing}
                        actionId={listing.id}
                        onAction={onDelete}
                        disabled={deletingId === listing.id}
                        actionLabel='Delete Properties'
                        currentUser={currentUser}
                    />
                ))}
            </div>
        </Container>
    )
}

export default PropertiesClient;
