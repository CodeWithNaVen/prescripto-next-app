import { verifyAdminToken } from '@/lib/authMiddleware';
import { NextResponse } from 'next/server';

export const GET = async (req) => {
    try {
        const admin = verifyAdminToken(req);

        if (!admin) {
            throw new Error('Admin not authenticated');
        }

        const adminData = {
            name: process.env.ADMIN_NAME,
            email: process.env.ADMIN_EMAIL,
        };

        return NextResponse.json({ success: true, message: 'Admin Info', adminData }, { status: 200 });

    } catch (error) {
        console.log(error.message);
        return NextResponse.json({ success: false, message: 'Failed to get admin Info' }, { status: 500 });
    }
};
