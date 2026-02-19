"use client";
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import { Star } from "lucide-react";

const DoctorRating = ({ docId }) => {
  const { doctors, user, axios } = useAppContext();
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Get doctor info from context
  const fetchRatings = () => {
    const doctor = doctors.find((doc) => doc._id === docId);
    if (doctor && doctor.ratings) {
      setAverageRating(doctor.ratings.average || 0);
      setReviewCount(doctor.ratings.count || 0);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, [doctors, docId]);

  // Submit user rating
  const submitRating = async (rating) => {
    if (!user) {
      toast.error("Please login to submit a rating");
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post("/api/submit-rating", { docId, rating, userId: user._id });
      if (res.data.success) {
        toast.success("Rating submitted!");
        setUserRating(rating); // update local
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to submit rating");
    } finally {
      setSubmitting(false);
    }
  };

  // Render stars using Lucide icons
  const renderStars = (rating, interactive = false) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={20}
          className={`cursor-pointer ${i <= rating ? "text-yellow-400" : "text-gray-300"} transition-colors duration-200`}
          onClick={interactive ? () => submitRating(i) : undefined}
        />
      );
    }
    return stars;
  };

  return (
    <div className="mt-3">
      <p className="text-gray-600 font-medium">Doctor Ratings</p>
      <div className="flex items-center gap-1 mt-1">
        {renderStars(Math.round(averageRating))}
        {reviewCount > 0 && <span className="text-gray-500 text-sm ml-1">({reviewCount})</span>}
      </div>

      <div className="mt-3 border border-gray-300 rounded-md px-8 py-3 max-w-max bg-primary text-white">
        <p className="text-sm mt-2">Rate this doctor:</p>

        <div className="flex items-center gap-1 mt-1">
          {renderStars(userRating, true)}
        </div>
      </div>
      {submitting && <p className="text-sm text-gray-500 mt-1">Submitting...</p>}
    </div>
  );
};

export default DoctorRating;
