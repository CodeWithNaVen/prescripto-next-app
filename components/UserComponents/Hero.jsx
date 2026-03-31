'use client';
import React from 'react';
import { assets } from '@/assets/assets';
import Image from 'next/image';
import Link from 'next/link';

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-primary rounded-3xl mx-4 md:mx-0 shadow-xl">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
      
      <div className="flex flex-col md:flex-row items-center min-h-[500px]">
        
        {/* Left Side: Content */}
        <div className="flex flex-col items-start justify-center flex-1 gap-6 px-8 py-16 sm:px-12 md:px-16 lg:pl-20">
          
          <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl tracking-tight">
            Book appointment <br className="hidden sm:block" /> 
            <span className="opacity-90">with trusted doctors</span>
          </h1>

          <div className="flex flex-col items-start gap-4 p-4 transition-colors md:flex-row md:items-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
            <Image 
              src={assets.group_profiles} 
              width={110} 
              height={40} 
              alt="Profiles" 
              className="w-24 h-auto"
            />
            <p className="max-w-xs text-sm font-medium leading-relaxed text-blue-50">
              Simply browse through our extensive list of trusted doctors and schedule your visit hassle-free.
            </p>
          </div>
          <div className='flex items-center gap-2'>
             <Link 
              href="/recommend" 
              className="group flex items-center gap-3 bg-white px-8 py-4 rounded-full text-primary font-semibold text-sm transition-all hover:bg-blue-50 hover:shadow-lg active:scale-95"
            >
              Check Symptoms Now
              <Image 
                src={assets.arrow_icon} 
                width={16} 
                height={16} 
                alt="Arrow" 
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <Link 
              href="#speciality" 
              className="group flex items-center gap-3 bg-white px-8 py-4 rounded-full text-primary font-semibold text-sm transition-all hover:bg-blue-50 hover:shadow-lg active:scale-95"
            >
              Book appointment
              <Image 
                src={assets.arrow_icon} 
                width={16} 
                height={16} 
                alt="Arrow" 
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>

        {/* Right Side: Image */}
        <div className="relative flex items-end justify-center w-full md:w-1/2 self-end">
          <div className="relative z-10 w-full px-8 md:px-0">
            <Image 
              src={assets.header_img} 
              width={600} 
              height={600} 
              alt="Doctors Header" 
              className="w-full h-auto object-contain rounded-b-lg"
              priority
            />
          </div>
          
          {/* Subtle gradient overlay at the bottom of the image for depth */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-primary/50 to-transparent z-20 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default Hero;