'use client';
import React from 'react';
import { assets } from '@/assets/assets';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-slate-100 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12">
        
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 lg:gap-16">
          
          {/* Brand Section */}
          <div className="md:col-span-5 lg:col-span-6">
            <Image
              src={assets.logo} 
              alt="Prescripto Logo" 
              width={160} 
              height={40} 
              className="mb-8 w-40 transition-all"
            />
            <p className="max-w-md text-sm leading-relaxed text-slate-500">
              Your health matters! Our platform connects you with top-rated doctors 
              whether you need a general checkup, specialist consultation, or urgent care. 
              We prioritize your privacy and convenience above all else.
            </p>
          </div>

          {/* Navigation Section */}
          <div className="md:col-span-3 lg:col-span-2">
            <h4 className="mb-6 text-base font-bold text-slate-900">
              company
            </h4>
            <ul className="flex flex-col gap-4 text-sm font-medium text-slate-500">
              <li>
                <Link href="/" className="transition-colors hover:text-primary">Home</Link>
              </li>
              <li>
                <Link href="/about" className="transition-colors hover:text-primary">About us</Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-primary">Contact us</Link>
              </li>
              <li>
                <Link href="/privacy" className="transition-colors hover:text-primary">Privacy Policy</Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="md:col-span-4 lg:col-span-4">
            <h4 className="mb-6 text-base font-bold text-slate-900">
              Get in touch
            </h4>
            <ul className="flex flex-col gap-4">
              <li className="flex items-center gap-3 text-sm text-slate-500">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-primary">
                  <Phone size={14} />
                </div>
                <span>+977-9819930709</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-500">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-primary">
                  <Mail size={14} />
                </div>
                <span>naveenshah.dev@gmail.com</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-500">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-primary">
                  <MapPin size={14} />
                </div>
                <span>Baneshwor, Kathmandu - Nepal</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-slate-100">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-xs font-medium text-slate-400">
              © {new Date().getFullYear()} nexcare.com. All Rights Reserved.
            </p>
            
            <div className="flex items-center gap-6">
              <span className="text-xs text-slate-400 hover:text-primary cursor-pointer transition-colors">Terms of service</span>
              <span className="text-xs text-slate-400 hover:text-primary cursor-pointer transition-colors">Cookie policy</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;