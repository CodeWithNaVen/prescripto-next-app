import React from 'react'
import { assets } from '@/assets/assets'
import Image from 'next/image'

const Footer = () => {
  return (
    <div className='px-6 py-2 bg-gray-200'>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 text-sm'>

            <div>
                <Image src={assets.logo} alt="" width={0} height={0}  className='mb-5 w-40'/>
                <p className='w-full md:2/3 text-gray-700 leading-6'>Your health matters! Our platform connects you with top-rated doctors whether you need a general checkup, specialist consultation, or urgent care, we've got you covered. Book appointments easily, access medical details, and manage your healthcare effortlessly. We prioritize your privacy and convenience.</p>
            </div>
            
            <div>
                <p className='mb-5 text-xl font-medium'>COMPANY</p>
                <ul className='flex flex-col gap-2 text-gray-700'>
                    <li>Home</li>
                    <li>About Us</li>
                    <li>Contact Us</li>
                    <li>Privacy Policy</li>
                </ul>
            </div>

            <div>
                <p className='mb-5 text-xl font-medium'>GET IN TOUCH</p>
                <ul className='flex flex-col gap-2 text-gray-700'>
                    <li>+1-253-987-5523</li>
                    <li>naveenshah.dev@gmail.com</li>
                </ul>

            </div>
        </div>

        <div>
            <hr className='border-gray-400'/>
            <p className='py-5 text-sm text-center text-gray-900'>Copyright {new Date().getFullYear()} &copy; Prescripto.com All Right Reserved.</p>
        </div>

    </div>
  )
}

export default Footer
