import { adminAssets } from '@/assets/admin_assets/adminAssets';
import { useDoctorAppContext } from '@/context/DoctorAppContext';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

const DNavbar = () => {
    const {router, axios, doctor, getDoctorProfile} = useDoctorAppContext();

    const logout = async()=>{
      try {
        const res = await axios.get('/api/auth/doctor/logout');
        const data = res.data;
        
        if(data.success){
           router.push('/doctor/login');
          router.refresh();
          toast.success(data.message);
        }else{
          toast.error(data.message);
        }

      } catch (error) {
        console.error('Logout failed', error);
      }
        
    }

    useEffect(() => {
      getDoctorProfile();
    }, []);

  return (
    <div className='flex items-center justify-between px-4 sm:px-10 py-3 border-b border-gray-300 bg-white'>
        <Link href="/doctor/dashboard" className='flex items-center gap-2 text-sm'>
            <Image src={adminAssets.admin_logo} alt="" className='w-36 sm:w-40 cursor-pointer'/>

            <p className='border px-2.5 py-0.5 rounded-full border-primary text-gray-700'>Doctor</p>
        </Link>

        <button onClick={logout} className='bg-primary text-white px-3 py-1  sm:px-10 sm:py-2 rounded-full cursor-pointer hover:scale-105'>Logout</button>

    </div>
  )
}

export default DNavbar
