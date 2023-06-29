'use client';

import React, { useCallback, useMemo } from 'react'
// {prisma}
import { Reservation } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { SafeListing, SafeReservation, SafeUser } from '@/app/types';
import { format } from 'date-fns';

import useCountries from '@/app/hooks/useCountries';
import Image from 'next/image';
import HeartButton from '../HeartButton';
import Button from '../Button';


// {safeUser createdAt,updatedAt,emailVerified}
interface ListingCardProps {
    data: SafeListing;
    reservation?: SafeReservation;
    onAction?: (id: string) => void;
    disabled?: boolean;
    actionLabel?: string;
    actionId?: string;
    currentUser?: SafeUser | null;
}

// {ข้อมูล รายการ}
const ListingCard: React.FC<ListingCardProps> = ({
    data,
    reservation,
    onAction,
    disabled,
    actionLabel,
    actionId = '',
    currentUser,
}) => {
    //  {  getByValue = location.db }
    const router = useRouter();
    const { getByValue } = useCountries();

    // {location จากฐานข้อมูล listings.locationValue}
    const location = getByValue(data.locationValue);

    // {Cancel => e = click button}
    // {ture return / false on action.id}
    // {เป็นการส่งพารามิเตอร์ actionId ให้กับ onAction}
    const handleCancel = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();

            if (disabled) {
                return;
            }

            onAction?.(actionId);
        }, [onAction, actionId, disabled]);

    // {reservation return => totalPrice}
    // {!reservation =>ให้ใช้ data.price}
    // {useMemo จะเก็บค่าป้องกันการซ้ำกัน => price}
    const price = useMemo(() => {
        if (reservation) {
            return reservation.totalPrice;
        }

        return data.price
    }, [reservation, data.price]);

    // {!reservation null =>true { format } => newDate start,end}
    const reservationDate = useMemo(() => {
        if (!reservation) {
            return null;
        }

        const start = new Date(reservation.startDate)
        const end = new Date(reservation.endDate)

        return `${format(start, 'PP')} - ${format(end, 'PP')}`
    }, [reservation])

    return (
        // {List}
        <div onClick={() => router.push(`/listings/${data.id}`)}
            className='col-span-1 cursor-pointer group'>
            <div className='flex flex-col gap-2 w-full'>
                {/* {Image} */}
                <div className='aspect-square w-full relative overflow-hidden rounded-xl'>
                    <Image
                        fill
                        alt='Listing'
                        src={data.imageSrc}
                        className='object-cover h-full w-full group-hover:scale-110
                        transition '
                    />
                    {/* {Heart Button} */}
                    <div className='absolute top-3 right-3'>
                        <HeartButton
                            listingId={data.id}
                            currentUser={currentUser}
                        />
                    </div>
                </div>
                {/* { Botton } */}
                <div className='font-semibold text-lg'>
                    {location?.region} , {location?.label}
                </div>
                <div className='font-lisht text-neutral-500'>
                    {reservationDate || data.category}
                </div>
                <div className='flex flex-row items-center gap-1'>
                    <div className='font-semibold'>
                        $ {price}
                    </div>
                    {!reservation && (
                        <div className='font-light'>
                            / night ✈️
                        </div>
                    )}
                </div>
                {onAction && actionLabel && (
                    <Button
                        disabled={disabled}
                        small
                        label={actionLabel}
                        onClick={handleCancel}
                    />
                )}
            </div>
        </div>
    )
}

export default ListingCard
