"use client";
import React, { useEffect, useState } from "react";
import DoctorCard from "./DoctorCard";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";

const TopRatedDoctors = () => {
  const { router, axios } = useAppContext();
  const [topRatedDoctors, setTopRatedDoctors] = useState([]);

  const getTopRatedDoctors = async () => {
    try {
      const res = await axios.get("/api/user/doctors");
      const data = res.data;

      if (data.success) {
        // Filter doctors with ratings and sort by highest rating
        const ratedDoctors = data.doctors
          .filter((doc) => doc.ratings && doc.ratings.count > 0)
          .sort((a, b) => b.ratings.average - a.ratings.average);

        setTopRatedDoctors(ratedDoctors.slice(0, 10)); // top 10
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to load top rated doctors");
    }
  };

  useEffect(() => {
    getTopRatedDoctors();
  }, []);

  return topRatedDoctors.length > 0 ? (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
      <h1 className="text-3xl md:text-4xl font-medium">
        Top Rated Doctors ⭐
      </h1>

      <p className="sm:w-1/3 text-center text-sm text-gray-600">
        Doctors loved by patients based on ratings and reviews.
      </p>

      <div className="w-full flex flex-col items-center md:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pt-5 gap-y-6 px-3 sm:px-0">
        {topRatedDoctors.map((doctor, index) => (
          <DoctorCard key={index} doctor={doctor} />
        ))}
      </div>

      <button
        onClick={() => {
          router.push("/doctors");
          scrollTo(0, 0);
        }}
        className="bg-primary text-white px-12 py-2 md:py-3 rounded-full"
      >
        View All Doctors
      </button>
    </div>
  ) : (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
      <h1 className="text-3xl md:text-4xl font-medium">
        Top Rated Doctors ⭐
      </h1>
      <p className="sm:w-1/3 text-center text-sm text-gray-600">
        No ratings available yet.
      </p>
    </div>
  );
};

export default TopRatedDoctors;
