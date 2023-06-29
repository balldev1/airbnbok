// Middleware สามารถใช้ในหลายๆ ด้านของแอปพลิเคชัน เช่น ในการตรวจสอบสิทธิ์การเข้าถึง 

export { default } from 'next-auth/middleware';

export const config = {
    matcher: [
        '/trips',
        '/reservations',
        '/properties',
        '/favorites',
    ]
}