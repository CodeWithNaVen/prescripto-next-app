// app/(pages)/(user)/appointment/[docId]/page.jsx
'use client';
import { assets } from '@/assets/assets';
import DoctorRating from '@/components/UserComponents/DoctorRating';
import PatientMediaUpload from '@/components/UserComponents/PatientMediaUpload';
import RelatedDoctorSection from '@/components/UserComponents/RelatedDoctorSection';
import { useAppContext } from '@/context/AppContext';
import Image from 'next/image';
import React, { use, useEffect, useState } from 'react'
import toast from 'react-hot-toast';

const page = ({params}) => {

  const docId = use(params).docId;
  const {doctors, user, router, fetchAllDoctors, axios,currencySymbol } = useAppContext();

  const [docInfo, setDocInfo] = useState(null);
  // time and slot of doctors
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');

  //get dictor information
  const fetchDocInfo = async() => {    
    const foundDoc = await doctors.find((doc) => doc._id === docId);

    if(foundDoc){
      setDocInfo(foundDoc);
    }
  }

  //get the available slot
  const getAvailableSlot = async() => {
    if(!docInfo) return;
    setDocSlots([]); //clear previous slots

    //getting current data
    let today = new Date();

    //get next 7 days
    for(let i = 0; i<7; i++){
      let currentDate = new Date(today); // today
      currentDate.setDate(today.getDate() + i); // next day

      //setting end time of the date with index
      let endTime = new Date();
      endTime.setDate(today.getDate() + i + 1); //next day
      endTime.setHours(21, 0, 0, 0);

      //setting hrs
      if(today.getDay() === currentDate.getDate()){
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);

        // 30 min intervals
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      }else{
        // start form 10'O clock
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }


      let timeSlots = [];
      while(currentDate < endTime){
        let formattedTime = currentDate.toLocaleString([], {hour:'2-digit', minute:'2-digit'});
        
        
        //getting date
        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1; // January is 0
        let year = currentDate.getFullYear();
        
        const slotDate = day + "-" + month + "-" + year;
        const slotTime = formattedTime;

        const isSlotAvailable = docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime)? false : true;
        
        if(isSlotAvailable){
          // push available slots
          timeSlots.push({dateTime: new Date(currentDate), time: formattedTime});
        }
        
        currentDate.setMinutes(currentDate.getMinutes() + 30);
        
      }
      
      setDocSlots((prevSlots) => [...prevSlots, timeSlots]);
    }
  }


  // book appointment logic
  const bookAppointment = async () =>{
    if(!user){
      toast.error('Please login to book an appointment');
      router.push('/login');
      return;

    }

    try {
      const date = docSlots[slotIndex][0].dateTime;
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      const slotDate = day + "-" + month + "-" + year;

      if(!slotDate){
        toast('🔔 Please select a slot to book appointment');
        return;
      }

      if(!slotTime){
        toast('🔔 Please select a slot to book appointment');
        return;
      }

      //book appointment
      const res = await axios.post('/api/user/book-appointment', {userId:user._id, docId, slotDate, slotTime});
      const data = await res.data;

      if(data.success){
        toast.success(data.message);
        fetchAllDoctors(); // Refresh list
        router.push('/my-appointments');
      }else{
        toast.error("yey" + data.message);
      }

    } catch (error) {
      toast.error(error.message || 'Failed to book appointment');
    }
  }

  useEffect(()=>{
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(()=>{
    getAvailableSlot();
  }, [docInfo]);

  // redirect to login if not logged in
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user]);

  return docInfo && (
    <div className='mx-4 my-8 sm:mx-[10%] space-y-20'>
      {/* doctor details */}
      <div className='flex flex-col sm:flex-row gap-4'>
        <div>
          <Image src={docInfo.doctorPic} width={1000} height={1000} alt="" className='bg-primary w-full sm:max-w-72 rounded-lg'/>
        </div>
        <div className='flex-1 border border-gray-500 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
          <h1 className='flex items-center gap-2 text-2xl font-medium text-gray-950'>{docInfo.name} <Image src={assets.verified_icon} width={20} height={20} alt="" className='w-5'/> </h1>
          <div className='flex items-center justify-between gap-2 text-sm mt-1 text-gray-700'>
            <p>{docInfo.degree} - {docInfo.speciality}</p>

            <div className='mt-2 space-y-1 bg-primary/20 text-gray-800 p-2 rounded-md relative'>
              <p className='max-lg:hidden absolute top-[-28px] left-10 -translate-x-1/2  px-2 py-1 bg-primary text-white rounded-bl-2xl rounded-tr-2xl text-sm shadow-lg border-3 border-gray-900'>Experience</p>
              

              {docInfo.experience?.map((exp) => (
                <div key={exp._id} className='text-sm'>
                  <p><strong>{exp.position}</strong> at {exp.hospital} ({exp.duration})</p>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>About <Image src={assets.info_icon} width={20} height={20} alt="" /></p>
            <p className='text-sm text-gray-600 max-w-[700px] mt-1'>{docInfo.about}</p>
          </div>

          <p className='text-gray-600 font-medium mt-4'>Appointment Fee: <span className='text-gray-800'>{currencySymbol}{docInfo.fees}</span></p>

          {/* doctor rating component here */}
          <DoctorRating docId={docInfo._id} />

        </div>
      </div>

      {/* doctor time booking slots */}
      <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-800'>
        <p>Booking Slots</p>
        <div className='flex items-center gap-3 md:gap-5 w-full overflow-x-scroll mt-4'>
          {docSlots.length && docSlots.map((item, index)=>(
            <div onClick={()=> setSlotIndex(index)} key={index} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white': 'border border-gray-400 hover:scale-95 duration-300'}`}>
              <p>{item[0] && daysOfWeek[item[0].dateTime.getDay()]}</p>
              <p>{item[0] && item[0].dateTime.getDate()}</p>
            </div>
          ))}
        </div>

        <div className='flex items-center gap-3 md:gap-5 w-full overflow-x-scroll mt-4'>
          {docSlots.length && docSlots[slotIndex].map((item, index)=>(
            <p onClick={()=> setSlotTime(item.time)} key={index} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white':'text-gray-600 border border-gray-400 hover:scale-95 transition-all duration-300'}`}>{item.time.toLowerCase()}</p>
          ))}
        </div>

        <button onClick={bookAppointment} className='bg-primary text-white text-sm font-light px-14 py-3 my-6 rounded-md active:scale-95 transition-all duration-300 cursor-pointer'>Book an Appointment</button>
      </div>
      

      {/* images and videos sharing section */}
      <PatientMediaUpload />

      {/* related doctor section */}
      <RelatedDoctorSection docId={docId} speciality={docInfo.speciality}/>
    </div>
  )
}

export default page