'use client';
import React from 'react'
import { assets } from '@/assets/assets'
import { useAppContext } from '@/context/AppContext';
import Image from 'next/image';


const Banner = () => {
    const {router} = useAppContext();
  return (
    <div className='flex bg-primary px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-10 text-white rounded-lg'>
      <div className='flex flex-col py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-5'>
        <h1 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold'>Book Appointment <br /> <p className='mt-4'>With 100+ Trusted Doctors</p> </h1>
        <button onClick={()=>{router.push('/login'); scrollTo(0,0)}} className='bg-white text-gray-800 px-4 md:px-8 py-2 rounded-full text-sm sm:text-base mt-6 hover:scale-105 transition-all duration-300 max-w-[70%]'>Create Account</button>
      </div>

      <div className='max-xs:hidden block md:w-1/2 lg:w-[370px] relative'>
        <Image src={assets.appointment_img} alt="" width={0} height={0} className='w-full max-w-[300px] absolute bottom-0 right-0'/>
      </div>
    </div>
  )
}

export default Banner
