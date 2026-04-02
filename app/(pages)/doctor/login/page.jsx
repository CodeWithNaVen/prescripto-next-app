'use client';

import { useState, useEffect } from 'react';

import { useDoctorAppContext } from '@/context/DoctorAppContext';
import Image from 'next/image';
import { assets } from '@/assets/assets';

const DoctorLoginPage = () => {
  const { doctor, router, axios} = useDoctorAppContext();
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
      const res = await axios.post('/api/auth/doctor/login', formData);
      const data = res.data;

      if (data?.success) {
        router.push('/doctor/dashboard');

      } else {
        setErrorMsg(data.message);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // if logged in, redirect to dashboard
  useEffect(() => {
    if (doctor) {
      router.push('/doctor/dashboard');
    }
  }, [doctor, router]);

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="max-w-md w-full bg-white p-8 rounded shadow-md">
        {/* logo */}
        <Image 
          src={assets.logo}
          alt="Logo"
          width={1000}
          height={1000}
          className="mx-auto h-12 w-auto mb-6"
        />

        <h2 className="text-2xl font-semibold text-center">Doctor Login</h2>
        <p className="text-gray-600 mb-3 text-center">Login using your credentials to access your dashboard</p>

        {errorMsg && <p className="text-red-500 mb-4 text-sm text-center">{errorMsg}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
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

          {/* forgot password */}
          <p className="text-sm text-end">
            <a href="/forgot-password" className="text-red-500 hover:underline">
              Forgot Password?
            </a>
          </p>

          <p className="text-center text-sm">
            Are you a patient?{' '}
            <a href="/login" className="text-primary hover:underline">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default DoctorLoginPage;
