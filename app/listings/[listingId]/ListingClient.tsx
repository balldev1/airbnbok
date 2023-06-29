'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// {type}
import { SafeListing, SafeReservations, SafeUser } from "@/app/types";

// { Date-fns}
import { differenceInCalendarDays, eachDayOfInterval } from 'date-fns';

// { components }
import { categories } from "@/app/components/navbar/Categories";
import Container from "@/app/components/Container";
import ListingInfo from "@/app/components/listings/ListingInfo";
import ListingHead from '@/app/components/listings/ListingHead';

import useLoginModal from '@/app/hooks/useLoginModal';
import ListingReservation from '@/app/components/listings/ListingReservation';
import { Range } from 'react-date-range';

// { Date วันเริ่มวันสุดท้าย , key: selection แสดงวันแบบทั่วไป }
const initialDateRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
}

// { interface from [listingsId].page }
interface ListingClientProps {
    reservations?: SafeReservations[];
    listing: SafeListing & {
        user: SafeUser
    };
    currentUser?: SafeUser | null;
}

const ListingClient: React.FC<ListingClientProps> = ({ listing, reservations = [], currentUser }) => {

    const loginModal = useLoginModal();
    const router = useRouter()

    // {useState}
    // {totalPrice.listing.price}
    // {dateRange start,end}
    const [isLoading, setIsLoading] = useState(false);
    const [totalPrice, setTotalPrice] = useState(listing.price);
    const [dateRange, setDateRange] = useState<Range>(initialDateRange);

    // { เมือคลิกCallback api บันทึกการจอง post'/api/reservations' }
    // { ส่งค่า totalPrice, start,end Date , รหัสที่ถูกจองlisting.id}
    const onCreateReservation = useCallback(() => {
        if (!currentUser) {
            return loginModal.onOpen();
        }

        setIsLoading(true);

        axios.post('/api/reservations', {
            totalPrice,
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            listingId: listing?.id
        })
            .then(() => {
                toast.success('Success')
                setDateRange(initialDateRange);
                router.push('/trips');
            })
            .catch(() => {
                toast.error('Something went wrong.');
            })
            .finally(() => {
                setIsLoading(false);
            })
    }, [totalPrice, dateRange, listing?.id, router, currentUser, loginModal]);

    // { เมือเกิดเหตุการ Effect}
    // { โดย useEffect นี้จะทำงานเมื่อมีการเปลี่ยนแปลงใน dateRange หรือ listing.price }
    // { differenceInCalendarDays ฟังชั่น date-fns จะแสดงจำนวนระหว่างวันว่ามีกี่วัน เช่น วันที่ 1 start - 10 end = 9 day ที่อยู่ }
    // { dayCount * price จำนวนวันที่อยู่ * ราคาต่อคืน }
    useEffect(() => {
        if (dateRange.startDate && dateRange.endDate) {
            const dayCount = differenceInCalendarDays(
                dateRange.endDate,
                dateRange.startDate
            );

            if (dayCount && listing.price) {
                setTotalPrice(dayCount * listing.price);
            } else {
                setTotalPrice(listing.price)
            }
        }
    }, [dateRange, listing.price])

    // {Memo Date}
    //  { forEach(reservatin) => start ,end => range }
    // {eachDayOfInterval ฟังชั่น date fns สร้าง [] วันเริ่มต้น - สิ้นสุด}
    // { ...dates , ...range เพิ่มสมาชิค range[] ทั้งหมด => dates }
    const disabledDate = useMemo(() => {
        let dates: Date[] = [];

        reservations.forEach((reservation: any) => {
            const range = eachDayOfInterval({
                start: new Date(reservation.startDate),
                end: new Date(reservation.endDate)
            });

            dates = [...dates, ...range];
        });

        return dates;
    }, [reservations]);



    // {use.memo เก็บค่า category}
    // {categories.label === listing.category เก็บไว้ที่ category }
    const category = useMemo(() => {
        return categories.find((items) =>
            items.label === listing.category);
    }, [listing.category]);

    return (
        <Container>
            <div className='max-w-screen-lg mx-auto'>
                <div className='flex flex-col gap-6'>
                    <ListingHead
                        title={listing.title}
                        imageSrc={listing.imageSrc}
                        locationValue={listing.locationValue}
                        id={listing.id}
                        currentUser={currentUser}
                    />
                </div>
                <div className='grid grid-col-1 md:grid-cols-7 md:gap-10 mt-6'>
                    <ListingInfo
                        user={listing.user}
                        category={category}
                        description={listing.description}
                        roomCount={listing.roomCount}
                        guestCount={listing.guestCount}
                        bathroomCount={listing.bathroomCount}
                        locationValue={listing.locationValue}
                    />
                    <div
                        className='order-first mb-10 md:order-last md:col-span-3 '>
                        <ListingReservation
                            price={listing.price}
                            totalPrice={totalPrice}
                            onChangeDate={(value) => setDateRange(value)}
                            dateRange={dateRange}
                            onSubmit={onCreateReservation}
                            disabled={isLoading}
                            disabledDate={disabledDate}
                        />
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default ListingClient
