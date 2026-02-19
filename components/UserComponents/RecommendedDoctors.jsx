'use client';
import React, { useEffect, useState } from 'react';
import DoctorCard from './DoctorCard';
import { useAppContext } from '@/context/AppContext';
import toast from 'react-hot-toast';

const RecommendedDoctors = ({ speciality }) => {
  const { axios } = useAppContext();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRecommendedDoctors = async () => {
    if (!speciality) return;

    try {
      setLoading(true);
      const res = await axios.get(
        `/api/recommend-doctors?speciality=${speciality}`
      );
      const data = res.data;

      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to load recommendations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendedDoctors();
  }, [speciality]);

  if (loading) {
    return (
      <div className="my-10 text-center text-gray-500">
        Finding the best doctors for you...
      </div>
    );
  }

  if (doctors.length === 0) return null;

  return (
    <div className="my-14 px-4 sm:px-8">
      <div className="mb-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
          Recommended Doctors for You
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Handpicked based on experience, ratings, availability, and fees.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {doctors.slice(0, 8).map((doctor) => (
          <DoctorCard key={doctor._id} doctor={doctor} />
        ))}
      </div>
    </div>
  );
};

export default RecommendedDoctors;
