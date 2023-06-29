'use client'

import React, { useEffect, useState } from 'react'

interface ClientOnlyProps {
    children: React.ReactNode;
}

// component นี้จะรอให้ component ที่เป็น children ถูก render เสร็จสิ้นแล้วเท่านั้น 
// จึงจะแสดงผล children นั้น ๆ ในการ render ของ component นี้
// ใช้เพื่อการจัดการกับการโหลดข้อมูลหรือการทำงานที่อาจใช้เวลานานกว่าเวลา Render ของ Component หลัก
//  โดยเรียกว่า "รอการ Mount" (Mount Waiting) เพื่อให้รอให้ Component หลัก
//  ทำงานเสร็จสมบูรณ์และข้อมูลพร้อมใช้งานก่อนที่จะแสดงผล Component 
// ย่อยหรือข้อมูลนั้น ๆ ที่อาจต้องใช้งานจากภายนอกหรือจากการโหลดจากแหล่งข้อมูลอื่น ๆ
const ClientOnly: React.FC<ClientOnlyProps> = ({
    children
}) => {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, [])

    if (!hasMounted) return null;

    return (
        <>
            {children}
        </>
    );
};

export default ClientOnly;
