'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAppContext } from '@/context/AppContext';
import Link from 'next/link';

const LoginPage = () => {
    const {user, router, loadingUser} = useAppContext();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleChange = (e) => {
        setFormData(prev => ({
        ...prev,
        [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setLoading(true);

        try {
        const res = await axios.post('/api/auth/user/login', formData);
        if (res.data.success) {
            router.push('/'); // or redirect to dashboard or profile
        } else {
            setErrorMsg(res.data.message);
        }
        } catch (err) {
            setErrorMsg(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!loadingUser && user) {
        router.push('/'); // redirect to home or user dashboard
        }
    }, [user, loadingUser, router]);

    if (loadingUser || user) {
        return null; // Avoid flicker
    }

    return (
        <>
        <div className="flex items-center justify-center min-h-screen px-4 ">
            <div className="max-w-md w-full bg-white p-8 rounded shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-center">User Login</h2>

            {errorMsg && <p className="text-red-500 mb-4 text-sm text-center">{errorMsg}</p>}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                <label className="block mb-1 text-sm font-medium">Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
                    placeholder="Enter your email"
                    required
                />
                </div>

                <div>
                <label className="block mb-1 text-sm font-medium">Password</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
                    placeholder="Enter your password"
                    required
                />
                </div>

                <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-2 rounded-md hover:bg-opacity-90 active:scale-95 duration-300 transition cursor-pointer"
                >
                {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link href="/register" className="text-primary font-medium hover:underline">
                   Register
                </Link>
                </p>


                {/* admin login link */}
                <p className="text-sm text-gray-600 mt-3">
                    Are you an admin?{' '}
                    <Link href="/admin/login" className="text-red-500 font-medium hover:underline">
                    Admin Login
                    </Link>
                </p>
            </div>
            
            </div>
        </div>
        </>
    );
};

export default LoginPage;
