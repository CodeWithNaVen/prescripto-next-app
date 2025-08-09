// components/admin/ANavbar.jsx
import { adminAssets } from '@/assets/admin_assets/adminAssets';
import Image from 'next/image';
import { useAdminAppContext } from '@/context/AdminAppContext';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';

const ANavbar = () => {
  const { router, setAdmin, getAdminProfile, axios } = useAdminAppContext();

  const logout = async () => {
    try {
      const res = await axios.get('/api/auth/admin/logout');
      const data = res.data;
      
      if (data.success) {
        router.push('/admin/login');
        router.refresh();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
      
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  useEffect(() => {
    getAdminProfile();
  }, []);

  return (
    <div className="flex items-center justify-between px-4 sm:px-10 py-3 border-b border-gray-300 bg-white">
      <Link href="/admin/dashboard" className="flex items-center gap-2 text-sm">
        <Image src={adminAssets.admin_logo} alt="Admin Logo" className="w-36 sm:w-40 cursor-pointer" />
        <p className="border px-2.5 py-0.5 rounded-full border-primary text-gray-700">Admin</p>
      </Link>
      <button onClick={logout} className="bg-primary text-white px-3 py-1 sm:px-10 sm:py-2 rounded-full cursor-pointer active:scale-95 duration-300">
        Logout
      </button>
    </div>
  );
};

export default ANavbar;