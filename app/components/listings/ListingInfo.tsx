'use client'
import React from 'react'

import { SafeUser } from '@/app/types';
import { IconType } from 'react-icons';
import useCountries from '@/app/hooks/useCountries';
import Avatar from '../Avatar';
import ListingCategory from './ListingCategory';
import dynamic from 'next/dynamic';
// { dynamic เป็นการโหลดคอมโพเนนต์แบบแยกโค้ดเพื่อเพิ่มประสิทธิภาพและลดเวลาโหลด }
// { loading (Component) - คอมโพเนนต์ที่จะแสดงขณะที่คอมโพเนนต์หลักกำลังโหลด }
// { ssr (Boolean) - กำหนดว่าจะถูกโหลดในส่วนของ Server Side Rendering (SSR) หรือไม่ }
// { no ssr (Boolean) - กำหนดว่าจะไม่ถูกโหลดในส่วนของ Server Side แต่จะโหลดเฉพาะ Client Side }
// { loadingFallback (ReactNode) - คอมโพเนนต์ที่จะแสดงขณะที่คอมโพเนนต์หลักกำลังโหลดในรูปแบบ JSX } 
// Server Side: เป็นส่วนที่ทำงานบนเซิร์ฟเวอร์
// Client Side: เป็นส่วนที่ทำงานบนเบราว์เซอร์

// {ssr : false เพือไม่ถูกโหลดในส่วนของ Server Side  แต่จะโหลดและแสดงผลเฉพาะในส่วนของ Client Side }
const Map = dynamic(() => import('../Map'), {
    ssr: false
});

interface ListingInfoProps {
    user: SafeUser,
    description: string;
    guestCount: number;
    roomCount: number;
    bathroomCount: number;
    category: {
        icon: IconType,
        label: string;
        description: string;
    } | undefined
    locationValue: string;
}

const ListingInfo: React.FC<ListingInfoProps> = ({
    user, description, guestCount, roomCount, bathroomCount, category, locationValue,
}) => {

    const { getByValue } = useCountries();
    const coordinates = getByValue(locationValue)?.latlng

    return (
        <div className='col-span-4 flex flex-col gap-8'>
            <div className='flex flex-col gap-2'>
                <div className='text-xl font-semibold flex flex-row items-center gap-2'>
                    <div>Hosted by {user?.name}</div>
                    <Avatar src={user?.image} />
                </div>
                <div className='flex flex-row items-center gap-4 font-light text-neutral-500'>
                    <div>
                        {guestCount} guests
                    </div>
                    <div>
                        {roomCount} rooms
                    </div>
                    <div>
                        {bathroomCount} bathroom
                    </div>
                </div>
            </div>
            <hr />
            {category && (
                <ListingCategory
                    icon={category.icon}
                    label={category.label}
                    description={category.description}
                />
            )}
            <hr />
            <div className='text-lg font-light text-neutral-500'>
                {description}
            </div>
            <hr />
            {/* {dynamic coordinates โหลดในส่วน Client เท่านั้น} */}
            <Map center={coordinates} />
        </div>
    )
}

export default ListingInfo
