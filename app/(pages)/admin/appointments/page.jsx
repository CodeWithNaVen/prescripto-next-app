'use client'
import { adminAssets } from '@/assets/admin_assets/adminAssets';
import { useAdminAppContext } from '@/context/AdminAppContext';
import { useAppContext } from '@/context/AppContext';
import calculateAge from '@/utils/calculateAge';
import slotDateFormat from '@/utils/slotDateFormat';
import Image from 'next/image';
import React, { useEffect } from 'react'


const AllAppointments = () => {

  const { admin, appointments, fetchAllAppointments, cancelAppointment, router} = useAdminAppContext();

  const {currencySymbol} = useAppContext();


  useEffect(()=>{
    fetchAllAppointments();
    
  }, [admin]);

  useEffect(() => {
    if (!admin) {
      router.push('/admin/login');
    }
  }, []);


  return (
    <div className='w-full max-w-6xl m-5'>
      <h1 className='mb-3 text-lg font-medium'>ALL APPOINTMENTS</h1>
      <div className='bg-white border border-[var(--primary)] rounded text-sm max-h[80vh] min-h-[60vh] overflow-y-scroll '>
        <div className='font-semibold hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b border-[var(--primary)]'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor Name</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {appointments.map((item, index)=>(
          <div key={index} className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-800 py-3 px-6 border-b border-[var(--primary)] hover:bg-indigo-100'>
            <p className='max-sm:hidden'>{index+1}</p>
            <div className='flex items-center gap-2'>
              <Image src={item.userData.profileImage} width={40} height={40} alt="" className='w-8 rounded-full border border-gray-200' />
              <p>{item.userData.name}</p>
            </div>
            <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>
            <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>

            <div className='flex items-center gap-2'>
              <Image src={item.docData.doctorPic} width={40} height={40} alt="" className='w-8 rounded-full border border-gray-200' />
              <p>{item.docData.name}</p>
            </div>
            <p>{currencySymbol}{item.amount}</p>

           {item.cancel? <p className='border border-red-500 px-3 py-1 text-red-500'>Cancelled</p> : item.isCompleted ? <p className='px-2 py-1 border border-green-500 text-green-500'>Completed</p> :<Image onClick={()=> cancelAppointment(item._id)} src={adminAssets.cancel_icon} width={20} height={20} alt="" className='w-10 cursor-pointer' />}
          </div>
        ))}
      </div>
    </div>
  )
}

export default AllAppointments;
