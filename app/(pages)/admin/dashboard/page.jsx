'use client';

import { adminAssets } from "@/assets/admin_assets/adminAssets";
import { useAdminAppContext } from "@/context/AdminAppContext";
import slotDateFormat from "@/utils/slotDateFormat";
import Image from "next/image";
import { useEffect } from "react";


const Dashboard = () => {

  const {admin, dashData, fetchDashData, cancelAppointment, router}=useAdminAppContext();
  
  useEffect(()=>{
    if(admin){
      fetchDashData();
    }
  }, [admin]);

  useEffect(() => {
    if (!admin) {
      router.push('/admin/login');
    }
  }, []);
  
  return dashData && (
    <div className='m-5'>
      <div className='flex flex-wrap gap-3'>
        <div className='flex items-center gap-2 bg-white p-4 min-w-50 rounded border-2 border-indigo-400 cursor-pointer hover:scale-105 transition-all duration-300 hover:bg-primary/60'>
          <Image src={adminAssets.doctor_icon} width={40} height={40} alt="" className='w-14 border border-primary rounded-md'/>
          <div>
            <p className='text-xl font-semibold text-gray-800'>{dashData.doctors}</p>
            <p className='text-gray-700'>Doctors</p>
          </div>
        </div>
        <div className='flex items-center gap-2 bg-white p-4 min-w-50 rounded border-2 border-primary cursor-pointer hover:scale-105 transition-all duration-300 hover:bg-primary/60'>
          <Image src={adminAssets.appointments_icon} width={40} height={40} alt="" className='w-14 border border-primary rounded-md'/>
          <div>
            <p className='text-xl font-semibold text-gray-800'>{dashData.appointments}</p>
            <p className='text-gray-700'>Appointments</p>
          </div>
        </div>
        <div className='flex items-center gap-2 bg-white p-4 min-w-50 rounded border-2 border-indigo-400 cursor-pointer hover:scale-105 transition-all duration-300 hover:bg-primary/60'>
          <Image src={adminAssets.patients_icon} width={40} height={40} alt="" className='w-14 border border-primary rounded-md'/>
          <div>
            <p className='text-xl font-semibold text-gray-800'>{dashData.patients}</p>
            <p className='text-gray-700'>Patients</p>
          </div>
        </div>
      </div>


      <div className='bg-white'>
        <div className='flex items-center gap-2.5 p-4 rounded-t border border-primary mt-10'>
          <Image src={adminAssets.list_icon} width={20} height={20} alt="" />
          <p className='text-base font-semibold'>Latest Appointment</p>
        </div>

        <div className='pt-4 border border-primary border-t-0'>
          {
            dashData.latestAppointments.map((item, index)=>(
              <div key={index} className='flex items-center px-6 py-3 hover:bg-indigo-200'>
                <Image src={item.docData.doctorPic} width={40} height={40} alt="" className='w-10 rounded-full border border-gray-200'/>
                <div className='flex-1 text-sm'>
                  <p className='text-gray-700 font-semibold'>{item.docData.name}</p>
                  <p className='text-gray-700'>{slotDateFormat(item.slotDate)}</p>
                </div>
                {item.cancel? <p className='border border-red-500 px-3 py-1 text-red-500'>Cancelled</p> : item.isCompleted ? <p className='px-2 py-1 border border-green-500 text-green-500'>Completed</p> :<Image onClick={()=> cancelAppointment(item._id)} src={adminAssets.cancel_icon} width={20} height={20} alt="" className='w-10 cursor-pointer' />}
              </div>
            ))
          }
        </div>

      </div>

      
      

      
    </div>
  )
}

export default Dashboard
