'use client'

import React, { useCallback, useMemo, useState } from 'react'
import Heading from '../Heading'

import { useRouter, useSearchParams } from 'next/navigation'
import { Range } from 'react-date-range'

import Modal from './Modal'
import useSearchModal from '@/app/hooks/useSearchModal'

import qs from 'query-string'
import { formatISO } from 'date-fns'
import dynamic from 'next/dynamic'

import CountrySelect from '../inputs/CountrySelect'
import { CountrySelectValue } from '../inputs/CountrySelect'
import Calendar from '../inputs/Calendar'
import Counter from '../inputs/Counter'


const SearchModal = () => {

    // {STEP.LOCATION => useState คือเริ่มจาก enum.step.s => location start}
    // { start.location , end.Info}
    enum STEPS {
        LOCATION = 0,
        DATE = 1,
        INFO = 2
    }
    // {Enum State} dateRange<Range> คือกำหนดวันเริ่มวันสุดท้าย
    const [step, setStep] = useState(STEPS.LOCATION);
    // {value}
    const [location, setLocation] = useState<CountrySelectValue>()
    const [guestCount, setGuestCount] = useState(1);
    const [roomCount, setRoomCount] = useState(1);
    const [bathroomCount, setBathroomCount] = useState(1);
    const [dateRange, setDateRange] = useState<Range>({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection'
    });

    // {Memo} ssr เป็น false เพื่อไม่ให้โหลดคอมโพเนนต์นี้ในระหว่าง Server-Side Rendering (SSR)
    // แต่ให้โหลดแบบ Client-Side Rendering (CSR) เมื่อถูกเรียกใช้งาน
    // {ใช้กับ latng ละติดจูด เพือบอกพิกัด}
    const Map = useMemo(() => dynamic(() => import('../Map'), {
        ssr: false,
    }), [location])

    // {router, params, searchModal}
    const router = useRouter();
    const params = useSearchParams();
    const searchModal = useSearchModal();

    // { on Back.Next => -1 , +1 => เก็บไว้ที่ step }
    const onBack = useCallback(() => {
        setStep((value) => value - 1);
    }, [setStep])

    const onNext = useCallback(() => {
        setStep((value) => value + 1);
    }, [setStep])

    // { onSubmit  !step.INFO(3) =>onNext}
    // { currentQuery = obj => params =>qs.pasre.params แปลง เป็น string }
    const onSubmit = useCallback(() => {
        if (step !== STEPS.INFO) {
            return onNext();
        }

        let currentQuery = {};

        if (params) {
            currentQuery = qs.parse(params.toString());
        }

        // { updatedQuery...currentQuery(params) }
        const updatedQuery: any = {
            ...currentQuery,
            locationValue: location?.value,
            guestCount,
            roomCount,
            bathroomCount
        };

        // { updatedQuery if มีค่าจะอัพเดท  startDate,endDate }
        if (dateRange.startDate) {
            updatedQuery.startDate = formatISO(dateRange.startDate);
        }

        if (dateRange.endDate) {
            updatedQuery.endDate = formatISO(dateRange.endDate);
        }

        // {url เป็น URL ที่สร้างขึ้นจาก qs.stringifyUrl และใช้ในการเปลี่ยนเส้นทางของเว็บไปยัง URL นั้น 
        //   => setStep.location,closeModal => router(url) }
        const url = qs.stringifyUrl({
            url: '/',
            query: updatedQuery
        }, { skipNull: true });

        setStep(STEPS.LOCATION);
        searchModal.onClose();

        router.push(url);
    }, [step, searchModal, location, router, guestCount, roomCount,
        bathroomCount, dateRange, onNext, params]);

    // { useMemo Next,Back }
    // {!INFO(3) return Next }
    const actionLabel = useMemo(() => {
        if (step === STEPS.INFO) {
            return 'Search';
        }

        return 'Next';
    }, [step]);
    // {!location(0) return back }
    const secondaryActionLabel = useMemo(() => {
        if (step === STEPS.LOCATION) {
            return undefined;
        }

        return 'Back';
    }, [step]);

    // {Body.Countent}
    // {CountrySelect เลือกประเทศ}
    // {0.STEPS.LOCATION}
    // {ควบคุมการ show โดย value => enum step => จาก step => setstep}
    let bodyContent = (
        <div className='flex flex-col gap-8'>
            <Heading
                title='Where do you wanna'
                subtitle='Find the perfect location!'
            />
            <CountrySelect
                value={location}
                onChange={(value) =>
                    setLocation(value as CountrySelectValue)
                }
            />
            <hr />
            <Map center={location?.latlng} />
        </div>
    )

    // {1.STEPS.LOCATION}
    if (step === STEPS.DATE) {
        bodyContent = (
            <div className='flex flex-col gap-8'>
                <Heading
                    title='When do you plan to go?'
                    subtitle='Make sure everyone is free!'
                />
                <Calendar
                    value={dateRange}
                    onChange={(value) => setDateRange(value.selection)}
                />
            </div>
        )
    }

    // {2.STEPS.INFO}
    if (step === STEPS.INFO) {
        bodyContent = (
            <div className='flex flex-col gap-8'>
                <Heading
                    title='More information'
                    subtitle='Find your perfect place!'
                />
                <Counter
                    title='Guests'
                    subtitle='How many guest are coming'
                    value={guestCount}
                    onChange={(value) => setGuestCount(value)}
                />
                <Counter
                    title='Rooms'
                    subtitle='How many rooms do you need?'
                    value={roomCount}
                    onChange={(value) => setRoomCount(value)}
                />
                <Counter
                    title='Bathrooms'
                    subtitle='How many bathrooms do you need?'
                    value={bathroomCount}
                    onChange={(value) => setBathroomCount(value)}
                />
            </div>
        )
    }
    // {Modal Buttn secondary}
    // { secondaryActionLabel = button back }
    // { secondaryAction step === STEPS.LOCATION ? undefined : onBack }
    return (
        <Modal isOpen={searchModal.isOpen}
            onClose={searchModal.onClose}
            onSubmit={onSubmit}
            title='Filters'
            actionLabel={actionLabel}
            secondaryActionLabel={secondaryActionLabel}
            secondaryAction={step === STEPS.LOCATION ? undefined : onBack}
            body={bodyContent}
        />
    )
}

export default SearchModal
