"use client";

import { adminAssets } from "@/assets/admin_assets/adminAssets";
import { useAppContext } from "@/context/AppContext";
import { useDoctorAppContext } from "@/context/DoctorAppContext";
import slotDateFormat from "@/utils/slotDateFormat";
import Image from "next/image";
import { useEffect } from "react";

const DoctorDashboard = () => {
  const { doctor, loadingDoctor, router } = useDoctorAppContext();

  const {currencySymbol} = useAppContext();
  const { dashData, fetchDashboardData, markAppointmentAsCancel,markAppointmentAsCompleted } = useDoctorAppContext();

  useEffect(() => {
    if (doctor) {
      fetchDashboardData();
    }
  }, [doctor]);

  useEffect(()=>{
    if(!doctor){
      router.push('/doctor/login');
    }
  },[doctor])

    if (loadingDoctor || !doctor) return null;

  return dashData && (
    <div className="m-5">
      <p className="text-lg font-semibold underline">DASHBOARD</p>
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-white p-4 min-w-50 rounded border-2 border-indigo-400 cursor-pointer hover:scale-105 transition-all duration-300 hover:bg-primary/60">
          <Image
            src={adminAssets.earning_icon}
            width={40}
            height={40}
            alt=""
            className="w-14 border border-primary rounded-md"
          />
          <div>
            <p className="text-xl font-semibold text-gray-800">
              {currencySymbol}
              {dashData.totalEarnings}
            </p>
            <p className="text-gray-700">Earnings</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white p-4 min-w-50 rounded border-2 border-primary cursor-pointer hover:scale-105 transition-all duration-300 hover:bg-primary/60">
          <Image
            src={adminAssets.appointments_icon}
            width={40}
            height={40}
            alt=""
            className="w-14 border border-primary rounded-md"
          />
          <div>
            <p className="text-xl font-semibold text-gray-800">
              {dashData.totalAppointments}
            </p>
            <p className="text-gray-700">Appointments</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white p-4 min-w-50 rounded border-2 border-indigo-400 cursor-pointer hover:scale-105 transition-all duration-300 hover:bg-primary/60">
          <Image
            src={adminAssets.patients_icon}
            width={40}
            height={40}
            alt=""
            className="w-14 border border-primary rounded-md"
          />
          <div>
            <p className="text-xl font-semibold text-gray-800">
              {dashData.totalPatients}
            </p>
            <p className="text-gray-700">Patients</p>
          </div>
        </div>
      </div>

      <div className="bg-white">
        <div className="flex items-center gap-2.5 p-4 rounded-t border border-primary mt-10">
          <Image src={adminAssets.list_icon} width={40} height={40} alt="" />
          <p className="text-base font-semibold">Latest Appointment</p>
        </div>

        <div className="pt-4 border border-primary border-t-0">
          {dashData.latestAppointments.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-6 py-3 hover:bg-indigo-200"
            >
              <Image
                src={item.userData.profileImage}
                width={40}
                height={40}
                alt=""
                className="w-10 rounded-full border border-gray-200"
              />
              <div className="flex-1 text-sm">
                <p className="text-gray-700 font-semibold">
                  {item.userData.name}
                </p>
                <p className="text-gray-700">{slotDateFormat(item.slotDate)}</p>
              </div>

              {item.cancel ? (
                <span className="text-red-600 text-xs font-medium border border-red-500 p-1">
                  Cancelled
                </span>
              ) : item.isCompleted ? (
                <span className="text-green-600 text-xs font-medium border border-green-500 p-1">
                  Completed
                </span>
              ) : (
                <div className="flex items-center gap-2">
                  <Image
                    onClick={() => markAppointmentAsCompleted(item._id)}
                    src={adminAssets.tick_icon}
                    width={40}
                    height={40}
                    alt=""
                    className="cursor-pointer w-8"
                  />
                  <Image
                    onClick={() => markAppointmentAsCancel(item._id)}
                    src={adminAssets.cancel_icon}
                    width={40}
                    height={40}
                    alt=""
                    className="cursor-pointer w-8"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  ) 
};

export default DoctorDashboard;
