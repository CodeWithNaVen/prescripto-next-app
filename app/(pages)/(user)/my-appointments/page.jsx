'use client'

import { useAppContext } from "@/context/AppContext";
import slotDateFormat from "@/utils/slotDateFormat";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const MyAppointments = () => {
  const { axios, router, user, fetchAllDoctors} = useAppContext();

  const [appointments, setAppointments] = useState([]);
  const months = [" ", 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov','Dec'];

  // list all appointments
  const getUserAppointments = async()=>{
    try {
      const res = await axios.get(`/api/user/appointments`);
      const data = await res.data;

      if(data.success){
        setAppointments(data.appointments.reverse());
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch appointments', error.message); 
    }

  }

  //cancel appointments
  const cancelAppointment = async(appointmentId)=>{
    try {
      const {data} = await axios.post(`/api/user/cancel-appointment`, {appointmentId});
      
      if(data.success){
        toast.success(data.message);
        getUserAppointments(); //update appointments data
        fetchAllDoctors();
      } else{
        toast.error(data.message);
      }
      
    } catch (error) {
      console.log(error);
      toast.error('Failed to cancel appointment', error.message);
      
    }
  };

  // payment razorpay
  const initPay = (order) =>{
    // paymet logic

  }

  const appointmentPayment = async(appointmentId)=>{
    // payment logic
  };


  useEffect(()=>{
    if(user){
      getUserAppointments();
    }
  }, [user])

  return appointments.length > 0 ? (
    <div className="mx-4 my-8 sm:mx-[10%] space-y-10">
      <p className='mt-12 font-medium bg-primary/80 text-white text-center w-maxx px-6 py-2 mx-auto'>My Appointments</p>
      <div className="bg-primary/10 rounded-md p-4">
        {appointments.map((item, index)=>(
          <div key={index} className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b border-gray-300'>
            <div>
              <Image src={item.docData.doctorPic} width={200} height={200} alt="" className='w-32 bg-indigo-400' />
            </div>
            <div className='flex-1 text-sm text-gray-700'>
              <p className='text-gray-800 font-semibold'>{item.docData.name}</p>
              <p className='text-gray-800'>{item.docData.speciality}</p>
              <p className='text-gray-800 font-semibold mt-1'>Address</p>
              <p className='text-gray-800 text-xs'>{item.docData.address.line1}</p>
              <p className='text-gray-800 text-xs'>{item.docData.address.line2}</p>
              <p className='text-gray-800 text-sm mt-1'><span className='font-semibold'>Date & Time: </span>{slotDateFormat(item.slotDate)} | {item.slotTime}</p>
            </div>

            <div></div>

            {!item.cancel && item.payment && !item.isCompleted && <button className='sm:min-w-48 py-2 border rounded text-gray-700 bg-indigo-500'>Paid</button>}
            <div className='flex flex-col justify-end gap-3'>
              {!item.cancel&& !item.payment && !item.isCompleted && <button onClick={()=>appointmentPayment(item._id)} className='text-sm text-stone-800 text-center sm:min-w-48 py-2 border border-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer'>Pay Online</button>}
              {!item.cancel && !item.isCompleted && <button onClick={()=> cancelAppointment(item._id)} className='text-sm text-gray-500 text-center sm:min-w-48 py-2 border border-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-300 cursor-pointer'>Cancel Appointment</button>}
              {item.cancel && !item.isCompleted && <button onClick={()=> cancelAppointment(item._id)} className='text-sm sm:min-w-48 py-2 border border-red-600 rounded-md text-red-600'>Appointment Cancelled!</button>}

              {item.isCompleted && <button className='text-sm sm:min-w-48 py-2 border border-green-600 rounded-md text-green-600 cursor-not-allowed'>Completed</button>}
            </div>
          </div>
        ))}

      </div>

    </div>
  ):(
    <div className="mx-4 my-8 sm:mx-[10%] space-y-10">
      <p className='mt-12 font-medium bg-primary/80 text-white text-center w-maxx px-6 py-2 mx-auto'>My Appointments</p>
      <div className="bg-primary/10 rounded-md p-4">
        <p className='text-center text-gray-700'>No Appointments for Now!!</p>
      </div>
    </div>
  )
}

export default MyAppointments
