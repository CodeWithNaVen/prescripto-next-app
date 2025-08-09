'use client'
import React, { useEffect, useState } from 'react'
import DoctorCard from './DoctorCard';
import { useAppContext } from '@/context/AppContext';
import toast from 'react-hot-toast';

const TopDoctors = () => {
    const {router, axios} = useAppContext();
    const [doctors, setDoctors] = useState([]);

    // show few doctors for non logged in user
    const getDoctors = async () => {
      const res = await axios.get('/api/user/doctors');
      const data = await res.data;

      if(data.success){
        setDoctors(data.doctors);
      }else{
        toast.error(data.message);
      }

    }

    useEffect(()=>{
      getDoctors();
    }, [])

  return doctors.length > 0 ? (
    <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
      <h1 className='text-3xl md:text-4xl font-medium'>Top Doctors to Book</h1>
      <p className='sm:w-1/3 text-center text-sm'>Simply browse through our extensive list of trusted doctors.</p>

      <div className='w-full flex flex-col justify-center items-center md:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pt-5 gap-y-6 px-3 sm:px-0 '>
        {
            doctors.slice(0,10).map((item, index)=>(
                <DoctorCard key={index} doctor={item}/>
            ))
        }
      </div>
      <button onClick={()=>{router.push('/doctors'); scrollTo(0,0)}} className='bg-primary text-white px-12 py-2 md:py-3 rounded-full'>More</button>
    </div>
  ) : (
    // show please login to see our doctor and a login button
    <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
      <h1 className='text-3xl md:text-4xl font-medium'>Top Doctors to Book</h1>
      <p className='sm:w-1/3 text-center text-sm'>Please login to see our doctors</p>
     
    </div>
  )
}

export default TopDoctors
