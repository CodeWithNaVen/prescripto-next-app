'use client';
import RecommendedDoctors from '@/components/UserComponents/RecommendedDoctors'
import { useAppContext } from "@/context/AppContext";
import React from 'react'

const page = () => {
    const {setSpeciality} = useAppContext();
  return (
    <RecommendedDoctors speciality={'gynecologist'} />
  )
}

export default page