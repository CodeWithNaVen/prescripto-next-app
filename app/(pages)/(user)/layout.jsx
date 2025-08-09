'use client';

import Footer from '@/components/UserComponents/Footer';
import Navbar from '@/components/UserComponents/Navbar';
import { AppContextProvider } from '@/context/AppContext';
import { usePathname } from 'next/navigation';
import { Toaster } from 'react-hot-toast';

export default function UserLayout({ children }) {

  //hide navbar on login and signup
  const pathname = usePathname();
  const isLoginRoute = pathname === '/login' || pathname === '/register';


  return (
    <AppContextProvider>
      <Toaster />
      <div className="min-h-screen bg-gray-50">
        {!isLoginRoute && <Navbar />}
        <main>{children}</main>
        {!isLoginRoute && <Footer />}
      </div>
    </AppContextProvider>
  );
}
