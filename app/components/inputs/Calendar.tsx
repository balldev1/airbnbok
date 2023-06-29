'use client';

import React from 'react'
// { Date react-date-range จัดการและแสดงช่วงวันที่ ในรูปแบบต่าง ๆ }
// RangeKeyDict: เป็นชนิดข้อมูลที่ใช้ในการเก็บและจัดเก็บข้อมูลเกี่ยวกับการเลือกช่วงวัน
// RangeKeyDict,Range,DateRange ชนิดข้อมูลระบุช่วงวันที่ DateRange
//  ซึ่งประกอบด้วย startDate และ endDate
import { RangeKeyDict, Range, DateRange } from 'react-date-range';

// { date.css }
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css'

// {interface from ListingReservation}
interface CalendarProps {
    value: Range;
    disabledDate?: Date[]
    onChange: (value: RangeKeyDict) => void;
}

const Calendar: React.FC<CalendarProps> = ({
    value,
    disabledDate,
    onChange
}) => {

    return (
        <DateRange
            rangeColors={['#262626']}
            ranges={[value]}
            date={new Date()}
            onChange={onChange}
            direction='vertical'
            showDateDisplay={false}
            minDate={new Date()}
            disabledDates={disabledDate}
        />
    )
}

export default Calendar
