'use client'

import { useAppContext } from "@/context/AppContext";
import { useDoctorAppContext } from "@/context/DoctorAppContext";
import calculateAge from "@/utils/calculateAge";
import slotDateFormat from "@/utils/slotDateFormat";
import Image from "next/image";
import { useEffect } from "react";
import { adminAssets } from "@/assets/admin_assets/adminAssets";

const DoctorAppointment = () => {
  const {
    doctor,
    appointments,
    fetchAllAppointments,
    markAppointmentAsCompleted,
    markAppointmentAsCancel
  } = useDoctorAppContext();

  const { currencySymbol } = useAppContext();

  const handleCashPayment = async () => {
    console.log("Cash collected!");
  };

  useEffect(() => {
    if (doctor) {
      fetchAllAppointments();
    }
  }, [doctor]);

  useEffect(()=>{
    if(!doctor){
      router.push('/doctor/login');
    }
  },[])
  

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-semibold">ALL APPOINTMENTS</p>
      <div className="bg-white border border-primary text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll">
        <div className="max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 px-6 py-3 border-b border-primary font-medium">
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {Array.isArray(appointments) && appointments.length > 0 ? (
          appointments.map((item, index) => (
            <div
              key={index}
              className="flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-700 px-6 py-3 border-b border-primary hover:bg-primary/20"
            >
              <p className="max-sm:hidden">{index + 1}</p>

              <div className="flex items-center gap-2">
                <Image
                  src={item?.userData?.profileImage}
                  alt=""
                  width={32}
                  height={32}
                  className="rounded-full border border-gray-400"
                />
                <p>{item.userData.name}</p>
              </div>

              <div>
                <p className="text-xs inline border border-primary px-1 rounded-md cursor-pointer">
                  {item.payment ? (
                    "Paid ONLINE"
                  ) : (
                    <span onClick={handleCashPayment}>
                      {item.payment ? <span>Cash Collected</span> : "CASH"}
                    </span>
                  )}
                </p>
              </div>

              { item.userData?.dob && <p className="max-sm:hidden">{ item.userData?.dob && calculateAge(item.userData.dob)}</p>}
              <p className="text-sm">
                {slotDateFormat(item.slotDate)} {item.slotTime}
              </p>

              <p className="font-medium">
                {currencySymbol}
                {item.amount}
              </p>

              <div className="flex items-center gap-1 mr-1">
                {item.isCompleted ? (
                  <p className="px-2 py-1 border border-green-500 text-green-600">
                    Completed
                  </p>
                ) : (
                  <Image
                    onClick={() => markAppointmentAsCompleted(item._id)}
                    src={adminAssets.tick_icon}
                    alt=""
                    className={`w-9 cursor-pointer ${item.cancel ? "hidden" : ""}`}
                  />
                )}

                {item.cancel ? (
                  <p className="px-2 py-1 border border-red-500 text-red-600">
                    Cancelled
                  </p>
                ) : (
                  <Image
                    onClick={() => markAppointmentAsCancel(item._id)}
                    src={adminAssets.cancel_icon}
                    alt=""
                    className={`w-9 cursor-pointer ${item.isCompleted ? "hidden" : ""}`}
                  />
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="p-4 text-center text-gray-500">No appointments found.</p>
        )}
      </div>
    </div>
  );
};

export default DoctorAppointment;
