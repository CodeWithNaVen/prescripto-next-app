"use client";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import React from "react";

const DoctorCard = ({ doctor }) => {
  const { router } = useAppContext();
  return (
    <div
      onClick={() => {
        router.push(`/appointment/${doctor._id}`);
        scrollTo(0, 0);
      }}
      className="border border-blue-300 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-all duration-300 group w-max"
    >
        <Image
            src={doctor.doctorPic}
            alt=""
            width={200}
            height={200}
            className="bg-indigo-400 group-hover:bg-indigo-500 "
        />
        <div className="p-4">
            {doctor.available ? (
            <span className="flex items-center doctors-center gap-2 text-sm text-center text-green-600">
                <p className="w-2 h-2 bg-green-600 rounded-full"></p>
                <p>Available</p>
            </span>
            ) : (
            <span className="flex items-center doctors-center gap-2 text-sm text-center text-red-600">
                <p className="w-2 h-2 bg-red-600 rounded-full"></p>
                <p>Not Available</p>
            </span>
            )}

            <p className="text-gray-900 text-lg font-medium">{doctor.name}</p>
            <p className="text-gray-700 text-sm">{doctor.speciality}</p>
        </div>
    </div>
  );
};

export default DoctorCard;
