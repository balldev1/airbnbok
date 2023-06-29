import { PrismaClient } from "@prisma/client";

// {เชือมฐานข้อมูล mongodb}
declare global {
    var prisma: PrismaClient | undefined
}

const client = globalThis.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalThis.prisma = client

export default client;

// บรรทัดแรกนำเข้า PrismaClient จากแพคเกจ @prisma/client เพื่อใช้ในการสร้างและจัดการการเชื่อมต่อกับฐานข้อมูลของคุณ

// ในส่วน declare global {} เป็นการประกาศแบบส่วนเพื่อเพิ่มคุณสมบัติใหม่ให้กับตัวแปร global
//  โดยกำหนดให้มีตัวแปร prisma ซึ่งเป็นชนิด PrismaClient และค่าเริ่มต้นเป็น undefined ดังนั้นตัวแปร prisma สามารถใช้งานได้ในทุกส่วนของโค้ด

// ในบรรทัดถัดมา const client = globalThis.prisma || new PrismaClient() กำหนดให้ตัวแปร client เป็น PrismaClient
//  ที่ได้รับค่าจาก globalThis.prisma ถ้ามีค่าอยู่แล้ว หรือสร้าง new PrismaClient()
// ถ้าไม่มีค่าอยู่ใน globalThis.prisma นั่นหมายความว่าการสร้าง PrismaClient จะเกิดขึ้นครั้งเดียวในระหว่างการทำงานของโปรแกรม

// ในบรรทัดถัดมา if (process.env.NODE_ENV !== 'production') globalThis.prisma = client
//  ใช้เงื่อนไขเพื่อกำหนดให้ globalThis.prisma มีค่าเป็น client ในกรณีที่ process.env.NODE_ENV ไม่ใช่ 'production'
//  นั่นหมายความว่าในโหมดการพัฒนา (development mode) globalThis.prisma จะถูกกำหนดค่าเป็น client เพื่อให้สามารถเรียกใช้ PrismaClient ในโค้ดอื่นๆ ในโมดูลนั้นๆ ได