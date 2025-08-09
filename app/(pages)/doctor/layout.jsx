'use client';

import DNavbar from '@/components/DoctorComponents/DNavbar';
import DSidebar from '@/components/DoctorComponents/DSidebar';
import { AppContextProvider } from '@/context/AppContext';
import { DoctorAppContextProvider } from '@/context/DoctorAppContext';
import { usePathname } from 'next/navigation';
import { Toaster } from 'react-hot-toast';

export default function DoctorLayout({ children }) {
  const pathname = usePathname();
  const isLoginRoute = pathname === '/doctor/login' || pathname === '/doctor/register';

  return (
    <AppContextProvider>
      <DoctorAppContextProvider>
        {!isLoginRoute && <DNavbar />}
        <Toaster />
        <div className={`min-h-screen bg-gray-50 flex gap-5 ${isLoginRoute ? 'justify-center items-center' : 'flex-1 w-full'}`}>
          {!isLoginRoute && <DSidebar />}
            <main>{children}</main>
        </div>
      </DoctorAppContextProvider>
    </AppContextProvider>
  );
}
