'use client'
import React from 'react'
import { specialityData } from '@/assets/assets'
import Image from 'next/image'
import { useAppContext } from '@/context/AppContext'


const SpecialityMenu = () => {
  const {router, setSpeciality} = useAppContext();

  return (
    <div id='speciality' className='flex flex-col items-center gap-4 py-16 text-gray-800'>
        <h1 className='text-3xl font-medium'>Find by Speciality</h1>
        <p className='text-sm w-1/3 text-center'>Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.</p>

        <div className='flex sm:justify-center gap-4 pt-5 w-full overflow-auto overflow-y-scroll scrollbar-hidden'>
            {specialityData.map((item, index)=>(  
                <div onClick={() =>{ setSpeciality(item.speciality); router.push('/doctors');}} key={index} className='flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500'>
                    <Image src={item.image} alt="" className='w-16 sm:w-24 mb-2'/>
                    <p>{item.speciality}</p>
                </div>
            ))}
        </div>
      
    </div>
  )
}

export default SpecialityMenu
