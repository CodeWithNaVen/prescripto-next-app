import React from 'react'
import { assets } from '@/assets/assets'
import Image from 'next/image'
import Link from 'next/link'

const Hero = () => {
  return (
    <div className='flex flex-col md:flex-row bg-primary text-white rounded-lg px-6 md:px-10 lg:px-20'>
        <div className='md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px]'>
            <h1 className='text-3xl md:text-4xl lg:text-4xl font-semibols leading-tight'>Book Appointment <br className='hidden sm:block'/> With Trusted Doctors
            </h1>
            <div className='flex flex-col md:flex-row items-center gap-3 text-sm font-light'>
                <Image src={assets.group_profiles} width={100} height={100} alt="" className='w-28'/>
                <p>Simply browse through our extensive list of trusted doctors schedule your appointment hassle-free.</p>
            </div>

            <Link href="#speciality" className='flex items-center gap-2 bg-white text-gray-600 text-sm m-auto md:m-0 px-8 py-3 rounded-full hover:scale-105 transition-all duration-300'>Book Appointment
                <Image src={assets.arrow_icon} width={20} height={20} alt="" />
            </Link>

        </div>
        
        <div className='md:w-1/2 relative'>
            <Image src={assets.header_img} width={0} height={0} alt="" className='max-h-[510px] h-auto w-full md:absolute bottom-0 rounded-lg'/> 
        </div>
    </div>
  )
}

export default Hero
