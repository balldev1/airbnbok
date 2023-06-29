'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { IoMdClose } from 'react-icons/io'
import Button from '../Button';

interface ModalProps {
    isOpen?: boolean;
    onClose: () => void;
    onSubmit: () => void;
    title?: string;
    body?: React.ReactElement;
    footer?: React.ReactElement;
    actionLabel: string;
    disabled?: boolean;
    secondaryAction?: () => void;
    secondaryActionLabel?: string;
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    title,
    body,
    footer,
    actionLabel,
    disabled,
    secondaryAction,
    secondaryActionLabel,
}) => {
    // {showmodal(isopen)เก็บค่า, useEffect(isopen)เปลี่ยนจะไปsetshowModal}
    // {handleclose ถ้า useCallback true จะไม่ทำอะไร / ถ้า false setshowModal flase 3วิ}
    const [showModal, setShowModal] = useState(isOpen);

    // {useEffect เมือ isopen เกิดการเปลี่ยนแปลง showmodal จะเป็นค่าใหม่ true}
    useEffect(() => {
        setShowModal(isOpen);
    }, [isOpen]);

    // {Close disabled true แสดงว่าปุ่มถูกปิด}
    // {ถ้า false ปุ่มเปิด แล้วมีคนไปคลิก setShowmodal(false) ปุ่มก็จะถูกปิด}
    const handleClose = useCallback(() => {
        if (disabled) {
            return;
        }

        setShowModal(false);
        setTimeout(() => {
            onClose();
        }, 300)
    }, [disabled, onClose])

    // {Submit}
    const handleSubmit = useCallback(() => {
        if (disabled) {
            return;
        }

        onSubmit();
    }, [disabled, onSubmit]);

    // { Action }
    const handleSecondaryAction = useCallback(() => {
        if (disabled || !secondaryAction) {
            return;
        }

        secondaryAction();
    }, [disabled, secondaryAction]);

    // {isOpen = true => null เพือไม่มีการเปิด modal }
    if (!isOpen) {
        return null;
    }

    return (
        <>
            {/* {page จาง} */}
            <div
                className='justify-center items-center flex overflow-x-hidden
                overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none
                bg-neutral-800/80'>
                {/* container */}
                <div
                    className='relative w-full md:w-4/6 lg-w-3/6 xl:w-2/5
                    my-6 mx-auto h-full lg:h-auto md:h-auto'>
                    {/* CONTENT */}
                    {/* {translate duration-300 องคประกอบเคลื่อนที่} */}
                    <div
                        className={`translate duration-300 h-full
                        ${showModal ? 'translate-y-0' : 'translate-y-full'}
                        ${showModal ? 'opacity-100' : 'opacity-0'}
                        `}
                    >
                        <div
                            className='translate h-full lg:h-auto md:h-auto border-0
                            rounded-lg shadow-lg relative flex flex-col w-full bg-white
                            outline-none focus:outline-none'
                        >
                            {/* {HEADER} */}
                            <div
                                className='flex items-center p-6 rounded-t justify-center
                                relative border-b-[1px]'
                            >
                                {/* {BUTTON CLOSE} */}
                                <button onClick={handleClose}
                                    className='p-1 border-0 hover:opacity-70 transition absolute
                                    left-9  '
                                >
                                    <IoMdClose size={18} />
                                </button>
                                {/* {TITLE} */}
                                <div
                                    className='text-lg font-semibold'
                                >
                                    {title}
                                </div>
                            </div>
                            {/* {BODY} */}
                            <div className='relative p-6 flex-auto'>
                                {body}
                            </div>
                            {/* {FOOTER} */}
                            <div
                                className='flex flex-col gap-2 p-6'
                            >
                                <div
                                    className='flex flex-row items-center gap-4 w-full'
                                >
                                    {/* {if ture secondary show button} */}
                                    {secondaryAction && secondaryActionLabel && (
                                        <Button
                                            outline
                                            disabled={disabled}
                                            label={secondaryActionLabel}
                                            onClick={handleSecondaryAction}
                                        />
                                    )}

                                    <Button
                                        disabled={disabled}
                                        label={actionLabel}
                                        onClick={handleSubmit}
                                    />
                                </div>
                                {footer}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Modal
