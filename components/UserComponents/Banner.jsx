'use client';
import React from 'react';
import { assets } from '@/assets/assets';
import { useAppContext } from '@/context/AppContext';
import Image from 'next/image';

const Banner = () => {
  const { router } = useAppContext();

  return (
    <div className="relative mx-4 my-20 overflow-hidden md:mx-10 rounded-3xl bg-primary shadow-2xl shadow-primary/20">
      
      {/* Premium background accents using the primary theme */}
      <div className="absolute top-0 right-0 w-80 h-80 -mr-20 -mt-20 bg-white opacity-10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 -ml-20 -mb-20 bg-black opacity-10 rounded-full blur-3xl" />

      <div className="flex flex-col md:flex-row items-center justify-between px-8 py-12 sm:px-12 md:px-16 lg:px-24">
        
        {/* Left Side: Content */}
        <div className="z-10 w-full text-center md:text-left md:w-3/5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <p className="text-xs font-medium text-white/90 tracking-wide">
              join our medical community
            </p>
          </div>

          <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl tracking-tight">
            Book appointment <br className="hidden sm:block" /> 
            <span className="text-white/80">with 100+ trusted doctors</span>
          </h1>
          
          <p className="mt-6 text-sm font-medium text-white/70 sm:text-base max-w-md mx-auto md:mx-0 leading-relaxed">
            Take the first step towards better health. Connect with experts and get the care you deserve today.
          </p>

          <button 
            onClick={() => { router.push('/login'); window.scrollTo(0, 0); }} 
            className="group mt-10 inline-flex items-center justify-center gap-3 rounded-full bg-white px-10 py-4 text-sm font-bold text-primary transition-all hover:shadow-xl hover:shadow-black/10 active:scale-95 sm:text-base"
          >
            Create account
            <svg 
              className="w-5 h-5 transition-transform group-hover:translate-x-1" 
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>

        {/* Right Side: Image with floating interaction */}
        <div className="relative hidden w-full mt-12 md:mt-0 md:block md:w-2/5 self-end">
          <div className="relative z-10 flex justify-end">
            <Image 
              src={assets.appointment_img} 
              alt="appointment" 
              width={500} 
              height={500} 
              className="w-full max-w-sm h-auto drop-shadow-2xl transition-all duration-700 group-hover:scale-105"
              priority
            />
          </div>
          
          {/* Decorative glass card */}
          <div className="absolute bottom-10 left-0 hidden lg:flex flex-col gap-1 p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl -translate-x-12 animate-bounce-slow">
             <p className="text-[10px] font-bold text-white/60 tracking-widest leading-none">trusted by</p>
             <p className="text-sm font-bold text-white">10k+ patients</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;