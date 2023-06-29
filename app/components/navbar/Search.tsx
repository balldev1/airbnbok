'use client';

import useCountries from '@/app/hooks/useCountries';
import useSearchModal from '@/app/hooks/useSearchModal';
import { differenceInDays } from 'date-fns';
import { useSearchParams } from 'next/navigation';
import React, { useMemo } from 'react'

import { BiSearch } from 'react-icons/bi';

const Search = () => {

    const searchModal = useSearchModal();
    // {Params , Countries}
    const params = useSearchParams();
    const { getByValue } = useCountries();

    // {รับ paramsUrl => locationValue  }
    const locationValue = params?.get('locationValue');
    const startDate = params?.get('startDate');
    const endDate = params?.get('endDate');
    const guestCount = params?.get('guestCount');

    // {useMemo if locationValue ถ้ามีค่า => จะใช้ useCountries ดึงข้อมูลประเทศ และคืนคืนค่าlabel  }
    // if false return anywhere
    const locationLabel = useMemo(() => {
        if (locationValue) {
            return getByValue(locationValue as string)?.label;
        }

        return 'Anywhere';
    }, [getByValue, locationValue]);

    // { memo Date differenceInDays คำนวนช่วงต่างวันที่จองเช่น 1-10 ซึงได้ 9}
    const durationLabel = useMemo(() => {
        if (startDate && endDate) {
            const start = new Date(startDate as string);
            const end = new Date(endDate as string);
            let diff = differenceInDays(end, start)

            // if diff === 0 ให้ เป็น 1 หากไม่ 0 return diff day เช่น 7 day
            if (diff === 0) {
                diff = 1
            }
            return `${diff} Days`
        }

        return 'Any Week'
    }, [startDate, endDate])

    // {memo Guest ถ้ามีค่า return ไม่มีค่า addgUEST}
    const guestLabel = useMemo(() => {
        if (guestCount) {
            return `${guestCount} Guest`;
        }

        return 'Add Guest';
    }, [guestCount])

    return (
        <div onClick={searchModal.onOpen}
            className='border-[1px] w-full md:w-auto py-2 rounded-full 
            shadow-sm hover:shadow-md transition cursor-pointer'>
            <div
                className='flex flex-row items-center justify-between'
            >
                <div
                    className='text-sm font-semibold px-6'
                >
                    {locationLabel}
                </div>
                <div
                    className='hidden sm:block text-sm font-semibold px-6
                border-x-[1px] flex-1 text-center'
                >
                    {durationLabel}
                </div>
                <div
                    className='text-sm pl-6 pr-2 text-gray-600 flex flex-row
                items-center gap-3'
                >
                    <div className='hidden sm:block'>{guestLabel}</div>
                    <div className='p-2 bg-rose-500 rounded-full text-white '>
                        <BiSearch size={18} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Search
