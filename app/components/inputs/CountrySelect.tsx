'use client';

import React from 'react'
import Select from 'react-select';

import useCountries from '@/app/hooks/useCountries';

export type CountrySelectValue = {
    flag: string;
    label: string;
    latlng: number[];
    region: string;
    value: string;
}

// {value? ค่าที่ถูกเลือกใน CountrySelect : type CountrySelectValue}
// {onChange ใช้งานเมือมีค่าใหม่ CountrySelect โดยรับพารามิเตอร์ value}
// { formatOptionLabel รูปแบบ select }
interface CountrySelectProp {
    value?: CountrySelectValue;
    onChange: (value: CountrySelectValue) => void;
}

const CountrySelect: React.FC<CountrySelectProp> = ({ value, onChange }) => {

    const { getAll } = useCountries();

    return (
        <div>
            <Select
                placeholder="Anywhere"
                isClearable
                options={getAll()}
                value={value}
                onChange={(value) => onChange(value as CountrySelectValue)}
                formatOptionLabel={(option: any) => (
                    <div className="flex items-center gap-3">
                        <div> {option.flag}</div>
                        <div>
                            {option.label},
                            <span className="text-neutral-500 ml-1"> {option.region}</span>
                        </div>
                    </div>
                )}
                classNames={{
                    control: () => 'p-3 border-2',
                    input: () => 'text-lg',
                    option: () => 'text-lg'
                }}

                theme={(theme) => ({
                    ...theme,
                    borderRadius: 6,
                    colors: {
                        ...theme.colors,
                        primary25: '#ffe4e6',
                        primary: 'black',
                    }
                })
                }
            />
        </div>
    );
}

export default CountrySelect
