import { Listing, User, Reservation } from '@prisma/client';

// SafeUser => type => User => @prisma/client
// SafeUser คือ ประเภทข้อมูลที่เป็นผลลัพธ์จากการลบคุณสมบัติ createdAt, updatedAt, และ emailVerified
//  ออกจาก User และเพิ่มคุณสมบัติ createdAt, updatedAt, และ emailVerified
//  ที่มีประเภทเป็น string | null เข้าไปแทนที่

// {user}
// {prisma => User}
export type SafeUser = Omit<
    User,
    "createdAt" | "updatedAt" | "emailVerified"
> & {
    createdAt: string;
    updatedAt: string;
    emailVerified: string | null;
};

// ใช้เพื่อกำหนดประเภทข้อมูลของผู้ใช้ที่ปลอดภัยในการใช้งาน
// โดยไม่ต้องกังวลเกี่ยวกับข้อมูลที่เป็นความลับหรือไม่จำเป็นต้องใช้ในการทำงาน
// เมื่อต้องการส่งข้อมูลผู้ใช้ไปยัง client หรือใช้ในการแสดงผลในส่วนต่าง ๆ
// โดยเมื่อกำหนด SafeUser แล้ว เราสามารถใช้ประเภท SafeUser แทนที่ User
// มีคุณสมบัติที่กำหนดไว้ใน SafeUser เท่านั้น โดยไม่สามารถเข้าถึงหรือใช้งานคุณสมบัติที่ไม่ได้ระบุไว้ใน SafeUser ได้
//  ซึ่งช่วยให้เพิ่มความปลอดภัยและลดความเสี่ยงในการใช้งานข้อมูลผู้ใช้ได้

// {Listing}
// {prisma => Listing} เข้าไปที่ Listing เอาแต่ createAt.string มา
export type SafeListing = Omit<Listing, "createdAt"> & {
    createdAt: string;
};

// {Reservations}
export type SafeReservation = Omit<Reservation, 'createdAt' | 'startDate' | 'endDate' | 'listing'> & {
    createdAt: string;
    startDate: string;
    endDate: string;
    listing: SafeListing
}
