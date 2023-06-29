'use client';

import React, { useState, useEffect, useCallback } from 'react'

import { toast } from 'react-hot-toast'
import { AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import {
    FieldValues,
    SubmitHandler,
    useForm
} from 'react-hook-form';

import Modal from './Modal';
import useRegisterModal from '@/app/hooks/useRegisterModal';
import useLoginModal from '@/app/hooks/useLoginModal';

import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react';
import Heading from '../Heading';

import Input from '../inputs/Input';
import Button from '../Button';


const LoginModal = () => {

    const router = useRouter();
    const registerModal = useRegisterModal();
    const LoginModal = useLoginModal();

    const [isLoading, setIsLoading] = useState(false);

    // {form values}
    const {
        register,
        handleSubmit,
        formState: {
            errors,
        }
    } = useForm<FieldValues>({
        defaultValues: {
            email: '',
            password: ''
        }
    });

    // {submit field}
    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        // {SIGNIN => ... DATA => คือเข้าระบบโดย EMAIL, PASSWORD ที่ผู้ใช้กรอกเข้ามา}
        signIn('credentials', {
            ...data,
            redirect: false,
        })
            .then((callback) => {
                setIsLoading(false);

                // {true => logged in}
                if (callback?.ok) {
                    toast.success('Logged in');
                    router.refresh();
                    LoginModal.onClose();
                }

                if (callback?.error) {
                    toast.error(callback.error);
                }
            })
    }

    // {TOGGLE LOGIN.CLOSE => REGISTER.OPEN}
    const toggle = useCallback(() => {
        LoginModal.onClose();
        registerModal.onOpen();
    }, [LoginModal, registerModal])

    // {BODY CONTENT}
    const bodyContent = (
        <div className='flex flex-col gap-4'>
            <Heading
                title='Welcome back'
                subtitle='Login to your account!'
            />
            <Input
                id='email'
                label='Email'
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />

            <Input
                id='password'
                label='Password'
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
        </div>
    )

    const footerContent = (
        <div className='flex flex-col gap-4 mt-3 '>
            {/* {BUTTON} */}
            <hr />
            <Button onClick={() => signIn('google')}
                outline
                label='Continue with google'
                icon={FcGoogle} />
            <Button onClick={() => signIn('github')}
                outline
                label='Continue with Github'
                icon={AiFillGithub} />
            {/* {ALREADY} */}
            <div className='text-neutral-500 text-center mt-4 font-light'>
                <div className='flex flex-row justify-center items-center gap-2'>
                    <div className=''>
                        First time using Airbnb?
                    </div>
                    <div onClick={toggle}
                        className='text-neutral-800 cursor-pointer hover:underline'>
                        Create an account
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <Modal
            disabled={isLoading}
            isOpen={LoginModal.isOpen}
            title='Login'
            actionLabel='Continue'
            onClose={LoginModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
        />
    )
}

export default LoginModal;
