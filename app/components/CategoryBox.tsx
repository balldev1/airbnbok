'use client'

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback } from 'react'
import { IconType } from 'react-icons';
import qs from 'query-string';

interface CategoryBoxProps {
    icon: IconType;
    label: string;
    selected?: boolean;
}

const CategoryBox: React.FC<CategoryBoxProps> = ({ icon: Icon, label, selected }) => {

    const router = useRouter();
    const params = useSearchParams();

    // {label ที่รับเข้ามา เป็น string}
    // {currentQuery = {} => if params true .ใช้ qs.pars เผือแปรงค่า params เป็น {obj} }
    // {currentQuery update => category ด้วยค่า label }
    // {if category(params:labelที่รับมา) === label ที่มีอยู่ ซ้ำกันให้ delete }
    // { qs.url สร้าง url เส้นทาง เป็น ' / ' และ params จาก updatedQuery }
    // { router => url  }
    // {แก้ไข query string ของ URL โดยการเพิ่มหรือลบพารามิเตอร์ category ตามค่า label 
    // {} ที่กำหนด และเปลี่ยนเส้นทาง URL ไปยัง URL ที่ได้สร้างขึ้น.}
    const handleClick = useCallback(() => {
        let currentQuery = {};

        if (params) {
            currentQuery = qs.parse(params.toString());
        }

        const updatedQuery: any = {
            ...currentQuery,
            category: label
        }

        if (params?.get('category') === label) {
            delete updatedQuery.category;
        }

        const url = qs.stringifyUrl({
            url: '/',
            query: updatedQuery
        }, { skipNull: true })

        router.push(url);
    }, [label, params, router])

    // {selected ถ้า user click ...true}
    return (
        <div onClick={handleClick}
            className={`flex flex-col items-center justify-center gap-2
        p-3 border-b-2 hover:text-neutral-800 transition cursor-pointer
        ${selected ? 'border-b-neutral-800' : 'border-transparent'}
        ${selected ? 'text-neutral-800' : 'text-neutral-500'}
        `}
        >
            <Icon size={26} />
            <div className='font-medium text-sm'>
                {label}
            </div>
        </div>
    )
}

export default CategoryBox
