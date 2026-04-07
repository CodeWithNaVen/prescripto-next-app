"use client";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import React from "react";
import { Star, StarHalf } from "lucide-react";

const DoctorCard = ({ doctor }) => {
  const { router } = useAppContext();

  // Helper to render stars using lucide-react
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          size={16}
          className="text-yellow-400 fill-yellow-400"
        />
      );
    }

    // Half star
    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="half"
          size={16}
          className="text-yellow-400 fill-yellow-400"
        />
      );
    }

    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star
          key={`empty-${i}`}
          size={16}
          className="text-gray-300"
        />
      );
    }

    return stars;
  };

  return (
    <div
      onClick={() => {
        router.push(`/appointment/${doctor._id}`);
        scrollTo(0, 0);
      }}
      className="border border-blue-300 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-all duration-300 group max-w-max"
    >
      <Image
        src={doctor.doctorPic}
        alt=""
        width={200}
        height={200}
        className="bg-primary/90 group-hover:bg-primary/95 transition-all duration-300"
      />

      <div className="p-4">
        {doctor.available ? (
          <span className="flex items-center gap-2 text-sm text-green-600">
            <p className="w-2 h-2 bg-green-600 rounded-full"></p>
            <p>Available</p>
          </span>
        ) : (
          <span className="flex items-center gap-2 text-sm text-red-600">
            <p className="w-2 h-2 bg-red-600 rounded-full"></p>
            <p>Not Available</p>
          </span>
        )}

        <p className="text-gray-900 text-lg font-medium line-clamp-1 ">{doctor.name}</p>
        <p className="text-gray-700 text-sm">{doctor.speciality}</p>

        {/* ⭐ Rating Display */}
        <div className="flex items-center gap-1 mt-1">
          {doctor.ratings?.average ? (
            renderStars(doctor.ratings.average)
          ) : (
            <span className="text-gray-400 text-sm">No ratings yet</span>
          )}

          {doctor.ratings?.count > 0 && (
            <span className="text-gray-500 text-sm ml-1">
              ({doctor.ratings.count})
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
