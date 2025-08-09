'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdminAppContext } from '@/context/AdminAppContext';
import Link from 'next/link';
import toast from 'react-hot-toast';

const AdminLoginPage = () => {
  const { admin, router, getAdminProfile } = useAdminAppContext();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

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
      const res = await axios.post('/api/auth/admin/login', {
        email: formData.email,
        password: formData.password
      });
      const data = res.data;

      if (data.success) {
        scrollTo(0, 0);
        router.push('/admin/dashboard');
        toast.success(data.message);
      } else {
        setErrorMsg(data.message);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Check if admin is already logged in
  useEffect(() => {
    if (admin) {
      router.push('/admin/dashboard');
    }
  }, [admin]);

  useEffect(() => {
    getAdminProfile();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
        <div className="max-w-md w-full bg-white p-8 rounded shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-center">Admin Login</h2>

            {errorMsg && <p className="text-red-500 mb-4 text-sm text-center">{errorMsg}</p>}

            <form onSubmit={handleSubmit} className="space-y-5 w-max md:w-sm">
            <div>
                <label className="block mb-1 text-sm font-medium">Email</label>
                <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-md"
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
                className="w-full border border-gray-300 px-3 py-2 rounded-md"
                required
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-2 rounded-md active:scale-95 duration-300 cursor-pointer"
            >
                {loading ? 'Logging in...' : 'Login'}
            </button>
            </form>

            <p className="mt-4 text-sm text-center">
            Are you a Doctor?{' '}
            <Link href="/doctor/login" className="text-primary">
                login now
            </Link>
            </p>
        </div>
    </div>
  );
};

export default AdminLoginPage;
