'use client'
// { react }
import React, { useMemo, useState } from 'react'

// {..Components}
import Modal from './Modal'
import Heading from '../Heading';
import { categories } from '../navbar/Categories';

// {..Input}
import CategoryInput from '../inputs/CategoryInput';
import CountrySelect from '../inputs/CountrySelect';
import Counter from '../inputs/Counter';
import ImageUpload from '../inputs/ImageUpload';

import useRentModal from '@/app/hooks/useRentModal';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import dynamic from 'next/dynamic';
import Input from '../inputs/Input';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

// { STEPS }
enum STEPS {
    CATEGORY = 0,
    LOCATION = 1,
    INFO = 2,
    IMAGES = 3,
    DESCRIPTION = 4,
    PRICE = 5
}

// {# RentModal}
const RentModal = () => {

    const rentModal = useRentModal();
    const router = useRouter();

    // {State Step.category}
    const [step, setStep] = useState(STEPS.CATEGORY);
    const [isLoading, setIsLoading] = useState(false);

    // {set Form => defaultValue}
    const { register, handleSubmit, setValue, watch,
        formState: { errors, }, reset } = useForm<FieldValues>({
            defaultValues: {
                categories: '',
                location: null,
                guestCount: 1,
                roomCount: 1,
                bathroomCount: 1,
                imageSrc: '',
                price: 1,
                title: '',
                description: ''
            }
        });

    // { watchติดตามค่าที่ถูกป้อน => เก็บไว้ที่ category }
    const category = watch('category');
    const location = watch('location');
    const guestCount = watch('guestCount');
    const roomCount = watch('roomCount');
    const bathroomCount = watch('bathroomCount');
    const imageSrc = watch('imageSrc');

    // {Memo} dynamic ใช้สำหรับโหลด componentที่มีการโหลด api ลดขนาดไฟล์
    // { usememo เก็บค่าไว้ที่ location ช่วยลดการโหลดใหม่คอมโพแนก map }
    // { ssr: false } เพื่อไม่ให้โหลดคอมโพเนนต์นี้ในระหว่าง ssr และเซตค่า map เป็นค่า memo }
    const Map = useMemo(() => dynamic(() => import('../Map'), {
        ssr: false
    }), [location]);

    // {set value field form(id,value)}
    const setCustomValue = (id: string, value: any) => {
        setValue(id, value, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,

        })
    }

    // { Next , Back เมือกดปุ่มจะ step +1 , -1 }
    const onBack = () => {
        setStep((e) => e - 1);
    };

    const onNext = () => {
        setStep((e) => e + 1);
    };

    // { Submit => (data) => axios.post.api/listings  }
    // {toast.refresh.reset.setStep.closeModal}
    // {!steps.price  => +1 onNext => modal ถัดไป}
    // {.finally.setLoading(false)}
    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        if (step !== STEPS.PRICE) {
            return onNext();
        }

        setIsLoading(true);

        axios.post('api/listings', data)
            .then(() => {
                toast.success('Listing Created!');
                router.refresh();
                reset();
                setStep(STEPS.CATEGORY);
                rentModal.onClose();
            })
            .catch(() => {
                toast.error('Something went wrong');
            }).finally(() => {
                setIsLoading(false);
            })
    }


    // { Memo }
    // { step === steps.price => create  / !== Next +1}
    const actionLabel = useMemo(() => {
        if (step === STEPS.PRICE) {
            return 'Create';
        }

        return 'Next';
    }, [step]);

    // { step === steps.category => undefined  / !== Next -1}
    const secondaryActionLabel = useMemo(() => {
        if (step === STEPS.CATEGORY) {
            return undefined;
        }

        return 'Back';
    }, [step]);

    // { BodyContent }
    // { setCustomValue(category) Click => ( id,value )  => category }
    // { selected if ===  true / !== false }
    // {step 0.category}
    let bodyContent = (
        <div
            className='flex flex-col gap-8'>
            <Heading
                title='Which of these best describes your place?'
                subtitle='Pick a category'
            />
            <div
                className='grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto'
            >
                {categories.map((item) => (
                    <div key={item.label} className='col-span-1'>
                        <CategoryInput onClick={(category) => setCustomValue('category', category)}
                            selected={category === item.label}
                            label={item.label}
                            icon={item.icon}
                        />
                    </div>
                ))}
            </div>
        </div>
    )

    // {step 1.location}
    if (step === STEPS.LOCATION) {
        bodyContent = (
            <div className='flex flex-col gap-8'>
                <Heading
                    title='Where is your place located?'
                    subtitle='Help guests find you!'
                />
                <CountrySelect
                    value={location}
                    onChange={(value) => setCustomValue('location', value)}
                />
                <Map
                    center={location?.latlng} />
            </div>
        )
    }

    // {step 2.info}
    if (step === STEPS.INFO) {
        bodyContent = (
            <div className='flex flex-col gap-8'>
                <Heading
                    title='Share some basics about your place'
                    subtitle='What amenities do you have?'
                />
                <Counter
                    title='Number of guests'
                    subtitle='How many guests do you allow'
                    value={guestCount}
                    onChange={(value) => setCustomValue('guestCount', value)}
                />
                <hr />
                <Counter
                    title='Rooms'
                    subtitle='How many rooms do you have?'
                    value={roomCount}
                    onChange={(value) => setCustomValue('roomCount', value)}
                />
                <hr />
                <Counter
                    title='Bathrooms'
                    subtitle='How many bathrooms do you have?'
                    value={bathroomCount}
                    onChange={(value) => setCustomValue('bathroomCount', value)}
                />
            </div>
        )
    }

    // {step 3.IMAGES}
    if (step === STEPS.IMAGES) {
        bodyContent = (
            <div className='flex flex-col gap-8'>
                <Heading
                    title='Add a photo of your place'
                    subtitle='Show guests what your place looks like!'
                />
                <ImageUpload
                    value={imageSrc}
                    onChange={(value) => setCustomValue('imageSrc', value)}
                />
            </div>
        )

    }

    // {step 4.DESCRIPTION}
    if (step === STEPS.DESCRIPTION) {
        bodyContent = (
            <div className='flex flex-col gap-8'>
                <Heading
                    title='How would you describe your place?'
                    subtitle='Short and sweet works best?'
                />
                <Input
                    id='title'
                    label='Title'
                    disabled={isLoading}
                    register={register}
                    errors={errors}
                    required
                />
                <hr />
                <Input
                    id='description'
                    label='Description'
                    disabled={isLoading}
                    register={register}
                    errors={errors}
                    required
                />
            </div>
        )

    }
    // {step 5.PRICE}
    if (step === STEPS.PRICE) {
        bodyContent = (
            <div className='flex flex-col gap-8'>
                <Heading
                    title='Now, set your price'
                    subtitle='How much do you charge per night?'
                />
                <Input
                    id='price'
                    label='Price'
                    formatPrice
                    type='number'
                    disabled={isLoading}
                    register={register}
                    errors={errors}
                    required
                />
            </div>

        )

    }
    // {step === steps.category ? true undefined / false onBack -1}
    return (
        <Modal
            isOpen={rentModal.isOpen}
            onClose={rentModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            actionLabel={actionLabel}
            secondaryActionLabel={secondaryActionLabel}
            secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
            title='Airbnb your home!'
            body={bodyContent}
        />
    )
}

export default RentModal
