'use client';

import ANavbar from "@/components/AdminComponents/ANavbar";
import ASidebar from "@/components/AdminComponents/ASidebar";
import { AdminAppContextProvider } from "@/context/AdminAppContext";
import { AppContextProvider } from "@/context/AppContext";
import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";



export default function AdminLayout({ children }) {
  //hide navbar and sidebar on login and signup
  const pathname = usePathname();
  const isLoginRoute = pathname === '/admin/login' || pathname === '/admin/register';

  return (
    <AppContextProvider>
      <AdminAppContextProvider>
        {!isLoginRoute && <ANavbar />}
        <Toaster />
        <div className={`min-h-screen bg-gray-50 flex gap-5 ${isLoginRoute ? 'justify-center items-center' : 'flex-1 w-full'}`}>
          {!isLoginRoute && <ASidebar />}
          <main>{children}</main>
        </div>
      </AdminAppContextProvider>
    </AppContextProvider>
  );
}
