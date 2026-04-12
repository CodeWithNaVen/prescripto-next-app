'use client'

import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import slotDateFormat from "@/utils/slotDateFormat";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";

const MyAppointments = () => {
  // Added 'doctors' from context to find images for AI appointments
  const { axios, user, fetchAllDoctors, doctors } = useAppContext();

  const [appointments, setAppointments] = useState([]);
  const [aiAppointments, setAiAppointments] = useState([]);
  const [showAiAppointments, setShowAiAppointments] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. Fetch User Appointments
  const getUserAppointments = useCallback(async () => {
    try {
      const res = await axios.get(`/api/user/appointments`);
      if (res.data.success) {
        setAppointments(res.data.appointments.reverse());
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch user appointments');
    }
  }, [axios]);

  // 2. Fetch AI Appointments
  const getAIAppts = useCallback(async () => {
    try {
      const res = await axios.get(`/api/ai/appointments`);
      if (res.data.success) {
        setAiAppointments(res.data.appointments);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch AI appointments');
    }
  }, [axios]);

  // Load all data on mount
  const loadData = useCallback(async () => {
    setLoading(true);
    if (user) {
      // Ensure doctors are loaded so we can find images
      if (doctors.length === 0) fetchAllDoctors();
      await Promise.all([getUserAppointments(), getAIAppts()]);
    }
    setLoading(false);
  }, [user, doctors.length, fetchAllDoctors, getUserAppointments, getAIAppts]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Helper: Find doctor image by name
  const getDocImageByName = (name) => {
    const doctor = doctors.find(doc => doc.name === name);
    return doctor ? doctor.doctorPic : null; 
  };

  // 3. Action: Cancel User Appointment
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(`/api/user/cancel-appointment`, { appointmentId });
      if (data.success) {
        toast.success(data.message);
        getUserAppointments(); 
        fetchAllDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel');
    }
  };

  // 4. Action: Cancel/Update AI Appointment
  const cancelAIAppointment = async (id, status) => {
    try {
      const { data } = await axios.patch(`/api/ai/appointments`, { id, status });
      if (data.success) {
        toast.success(`Appointment ${status}`);
        getAIAppts();
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update AI appointment');
    }
  };

  const appointmentPayment = async (appointmentId) => {
    toast.success("Redirecting to payment gateway...");
  };

  const currentList = showAiAppointments ? aiAppointments : appointments;

  return (
    <div className="mx-4 my-8 sm:mx-[10%] min-h-[80vh]">
      {/* Header Section */}
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Appointments</h1>
        <div className="h-1.5 w-12 bg-primary rounded-full mt-3 opacity-80"></div>
      </div>

      {/* Tab Toggle */}
      <div className="flex justify-center mb-10">
        <div className="bg-slate-100 p-1 rounded-2xl flex gap-1 w-full max-w-md shadow-inner border border-slate-200">
          <button 
            onClick={() => setShowAiAppointments(false)} 
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${!showAiAppointments ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Doctor Visits
          </button>
          <button 
            onClick={() => setShowAiAppointments(true)} 
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${showAiAppointments ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            AI Consultations
          </button>
        </div>
      </div>

      {/* List Container */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-primary"></div>
            <p className="text-slate-400 font-medium">Loading appointments...</p>
          </div>
        ) : currentList.length > 0 ? (
          currentList.map((item, index) => {
            // Find image for AI card
            const doctorPic = showAiAppointments ? getDocImageByName(item.doctorName) : null;

            return (
              <div key={index} className="bg-white border border-slate-100 rounded p-5 sm:p-7 shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all duration-300">
                
                {/* Unified Card Layout for both AI and User Appts */}
                <div className='flex flex-col sm:flex-row gap-8'>
                  
                  {/* Doctor Image Column */}
                  <div className="flex-shrink-0 flex justify-center sm:block">
                    <div className="relative w-32 h-32 group">
                        <Image 
                        src={showAiAppointments ? (doctorPic || '/default-avatar.png') : item.docData.doctorPic} 
                        width={128} 
                        height={128} 
                        alt="doctor" 
                        className='w-32 h-32 object-cover bg-primary/50  border border-slate-100 shadow-sm transition-transform duration-500 group-hover:scale-105' 
                        />
                        {showAiAppointments && (
                            <div className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[8px] font-bold px-2 py-1 rounded-full shadow-lg">⭐</div>
                        )}
                    </div>
                  </div>
                  
                  {/* Content Column */}
                  <div className='flex-1 space-y-3'>
                    <div className="flex flex-wrap items-center gap-2">
                        <h2 className='text-xl font-extrabold text-slate-900'>
                            {showAiAppointments ? item.doctorName : item.docData.name}
                        </h2>
                        {!showAiAppointments && <span className="text-primary bg-primary/5 px-3 py-0.5 rounded-full text-xs font-bold">{item.docData.speciality}</span>}
                        {showAiAppointments && <span className="text-indigo-600 bg-indigo-50 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-tighter">AI Verification Pending</span>}
                    </div>

                    {!showAiAppointments ? (
                        <div className="space-y-1">
                            <p className='text-slate-500 text-xs font-bold uppercase tracking-widest'>Location</p>
                            { item.docData.address .line1 ? <>
                              <p className='text-slate-600 text-sm'>{item.docData.address.line1}, {item.docData.address.line2}</p>
                            </> : <p className='text-slate-600 text-sm'>Not provided</p> }
                        </div>
                    ) : (
                        <div className="space-y-1">
                            <p className='text-slate-500 text-xs font-bold uppercase tracking-widest'>Chief Complaint / Symptom</p>
                            <p className='text-slate-800 text-sm font-medium italic'>"{item.symptom}"</p>
                        </div>
                    )}

                    <div className="pt-2">
                        <p className='text-sm flex items-center gap-2'>
                            <span className='text-slate-400 font-medium'>Schedule:</span>
                            <span className="text-slate-900 bg-slate-50 px-3 py-1 rounded-lg font-bold border border-slate-100">
                                {showAiAppointments ? item.date : `${slotDateFormat(item.slotDate)} | ${item.slotTime}`}
                            </span>
                        </p>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className='flex flex-col justify-center gap-3 sm:min-w-[220px]'>
                    {showAiAppointments ? (
                      /* AI Actions */
                      <>
                        {item.status !== 'cancelled' ? (
                            <button 
                                onClick={() => cancelAIAppointment(item.id, 'cancelled')} 
                                className='w-full py-3 text-red-500 border border-red-100 rounded-xl font-bold hover:bg-red-50 hover:border-red-200 transition-all active:scale-95'
                            >
                                Cancel Booking
                            </button>
                        ) : (
                            <button className='w-full py-3 bg-red-50 text-red-500 border border-red-100 rounded-xl font-bold cursor-not-allowed'>
                                Cancelled
                            </button>
                        )}
                        <div className='w-full py-3 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl font-bold flex items-center justify-center gap-2 text-sm'>
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            Confirmed by AI
                        </div>
                      </>
                    ) : (
                      /* Manual Actions */
                      <>
                        {!item.cancel && item.payment && !item.isCompleted && <button className='w-full py-3 bg-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-200'>Paid</button>}
                        {!item.cancel && !item.payment && !item.isCompleted && <button onClick={() => appointmentPayment(item._id)} className='w-full py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95'>Pay Online</button>}
                        {!item.cancel && !item.isCompleted && <button onClick={() => cancelAppointment(item._id)} className='w-full py-3 text-red-500 border border-red-100 rounded-xl font-bold hover:bg-red-100 transition-all active:scale-95'>Cancel Appointment</button>}
                        {item.cancel && !item.isCompleted && <button className='w-full py-3 bg-red-50 text-red-500 border border-red-100 rounded-xl font-bold cursor-not-allowed'>Cancelled</button>}
                        {item.isCompleted && <button className='w-full py-3 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-xl font-bold cursor-not-allowed'>Completed</button>}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-24 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200">
             <div className="p-6 bg-white rounded-full shadow-sm mb-6">
                <Image src={assets.logo} alt="logo" className="w-12 grayscale opacity-30" />
             </div>
             <p className='text-slate-400 text-xl font-light tracking-tight'>No {showAiAppointments ? 'AI' : 'scheduled'} appointments found.</p>
             <button onClick={() => window.location.href = '/doctors'} className="mt-6 px-8 py-3 bg-white text-primary border border-primary/20 rounded-full font-bold shadow-sm hover:shadow-md transition-all">
               Book An Appointment
             </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyAppointments;