'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAppContext } from '@/context/AppContext';
import Link from 'next/link';
import Image from 'next/image';
import { assets } from '@/assets/assets';

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
        <main>
            <button onClick={()=> router.push('/')} className='border-2 border-primary py-2 px-4 rounded-full hover:bg-opacity-90 active:scale-95 duration-300 transition cursor-pointer mx-20 my-10'><Image src={assets.arrow_icon} alt="" width={0} height={0} className='w-4 h-4 inline rotate-180'/>&nbsp; Back to Home</button>

            <div className="flex items-center justify-center min-h-screen px-4 ">
                <div className="max-w-md w-full bg-white p-8 rounded shadow-md">
                    {/* logo */}
                    <Image 
                        src={assets.logo}
                        alt="Logo"
                        width={1000}
                        height={1000}
                        className="mx-auto h-12 w-auto mb-6"
                    />
                <h2 className="text-2xl font-semibold text-center">Patient Login</h2>
                <p className="text-gray-600 text-center">Login to access your account</p>

                {errorMsg && <p className="text-red-500 mb-4 text-sm text-center">{errorMsg}</p>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                    <label className="block mb-1 text-sm font-medium">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-primary"
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
                        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-primary"
                        placeholder="Enter your password"
                        required
                    />
                    </div>

                    {/* {forgot password link */}
                    <div className="text-right">
                    <Link href="/forgot-password" className="text-sm text-red-500 hover:underline">
                        Forgot Password?
                    </Link>
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
        </main>
    );
};

export default LoginPage;
