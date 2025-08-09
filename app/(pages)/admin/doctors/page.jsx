// app/(admin)/admin/doctors/page.jsx
"use client";

import React, { useEffect } from "react";
import { useAdminAppContext } from "@/context/AdminAppContext";
import Image from "next/image";

const AllDoctorsPage = () => {
  const { doctors, fetchAllDoctors, changeAvailability, admin, router } = useAdminAppContext();

  useEffect(() => {
    admin && fetchAllDoctors();
  }, [admin]);

  useEffect(() => {
    if (!admin) {
      router.push('/admin/login');
    }
  }, []);

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll">
      <h1 className="text-lg font-medium lg:font-bold underline">
        All Doctors
      </h1>
      <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">
        {doctors.map((item, index) => (
          <div
            key={index}
            className="border border-[var(--primary)] rounded-lg max-w-56 overflow-hidden group"
          >
            <Image
              src={item.doctorPic}
              alt=""
              width={200}
              height={200}
              className="bg-indigo-300 group-hover:bg-indigo-400 transition-all duration-300"
            />
            <div className="p-4">
              <p className="text-gray-900 text-lg font-medium">{item.name}</p>
              <p className="text-gray-600 text-sm lg:text-base">
                {item.speciality}
              </p>

              <div className="flex items-center gap-1  mt-2 text-sm md:text-base text-gray-700">
                <label htmlFor="CB" className="flex gap-2 cursor-pointer">
                  <input
                    id="CB"
                    onChange={() => changeAvailability(item._id)}
                    type="checkbox"
                    checked={item.available}
                    className="cursor-pointer"
                  />
                  <p>Available</p>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllDoctorsPage;
