"use client";

import { useAppContext } from "@/context/AppContext";
import { useEffect, useState } from "react";
import DoctorCard from "./DoctorCard";

const RelatedDoctorSection = ({ docId, speciality }) => {
  const { doctors } = useAppContext();
  const [relDocs, setRelDocs] = useState([]);

  const relatedDoctors = () => {
    setRelDocs(
      doctors.filter(
        (doc) => doc.speciality === speciality && doc._id !== docId
      )
    );
  };

  useEffect(() => {
    relatedDoctors();
  }, [doctors, speciality, docId]);

  return (
    <div className="flex flex-col py-4">
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-xl md:text-2xl font-semibold">
          More Related Top Doctors to Book
        </h2>
        <p className="text-sm md:text-base text-gray-700 py-4">
          Simply browse through our extensive list of trusted doctors.
        </p>
      </div>

      <div className="flex flex-col justify-center items-center md:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {relDocs.slice(0, 5).map((item, index) => (
          <DoctorCard key={index} doctor={item} />
        ))}
      </div>
    </div>
  );
};

export default RelatedDoctorSection;
