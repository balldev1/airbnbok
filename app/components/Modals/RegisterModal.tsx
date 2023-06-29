'use client';

import React, { useState, useEffect, useCallback } from 'react'
import { AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'react-hot-toast'

import {
    FieldValues,
    SubmitHandler,
    useForm
} from 'react-hook-form';


import useRegisterModal from '@/app/hooks/useRegisterModal';
import axios from 'axios';
import Modal from './Modal';
import Heading from '../Heading';

import Input from '../inputs/Input';
import Button from '../Button';

import { signIn } from 'next-auth/react';
import useLoginModal from '@/app/hooks/useLoginModal';


const RegisterModal = () => {

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
            name: '',
            email: '',
            password: ''
        }
    });

    // {submit field api}
    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        axios.post('/api/register', data)
            .then(() => {
                toast.success('Success!')
                registerModal.onClose();
                LoginModal.onOpen();
            })
            .catch((error) => {
                toast.error('Something went Wrong');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    // {TOGGLE LOGIN.CLOSE => REGISTER.OPEN}
    const toggle = useCallback(() => {
        LoginModal.onOpen();
        registerModal.onClose();
    }, [LoginModal, registerModal])

    // {BODY CONTENT}
    const bodyContent = (
        <div className='flex flex-col gap-4'>
            <Heading
                title='Welcome to Airbnb'
                subtitle='Create an account!'
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
                id='name'
                label='Name'
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
                        Already have an account ?
                    </div>
                    <div onClick={toggle}
                        className='text-neutral-800 cursor-pointer hover:underline'>
                        login
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <Modal
            disabled={isLoading}
            isOpen={registerModal.isOpen}
            title='Register'
            actionLabel='Continue'
            onClose={registerModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
        />
    )
}

export default RegisterModal
