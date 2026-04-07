'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.NEXT_PUBLIC_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currencySymbol = '₹';
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState(null); // user state
  const [loadingUser, setLoadingUser] = useState(true); // loading state for auth

  const isAdminPath = pathname.includes('/admin');
  const isDoctorPath = pathname.includes('/doctor');


  const [doctors, setDoctors] = useState([]);

  const [speciality, setSpeciality] = useState('');

  const [aiDoctors, setAiDoctors] = useState([]);

  // Fetch user data on mount
  const getUserProfile = async () => {
      try {
        const res = await axios.get('/api/auth/user/get-profile');
        const data = res.data;
        if (data.success) {
          setUser(data.userData);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    };

  //fetch all doctors
  const fetchAllDoctors = async () => {
    try {
      const res = await axios.get("/api/auth/user/all-doctors");
      const data = res.data;

      if(data.success){
        setDoctors(data.doctors);
        setAiDoctors(data.aiDoctors);
      }else{
        toast.error(data.message);
      }
      
    } catch (err) {
      toast.error(err?.message || "Error fetching doctors");
    }
  };

  // fetch user profile info
  const fetchUserProfileInfo = async () => {
    try {
      const res = await axios.get('/api/auth/user/get-profile');
      const data = res.data;

      if(data.success){
        setUser(data.userData);
      }else{
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.message);
    }
  };


  useEffect(() => {
    user && fetchAllDoctors();
  }, [user]);


  useEffect(() => {
    getUserProfile();
  }, []);

  const value = {
    currencySymbol,
    router, axios,
    pathname,
    user,
    setUser,
    loadingUser,
    isAdminPath,
    isDoctorPath,
    getUserProfile,
    doctors,
    fetchUserProfileInfo,
    fetchAllDoctors,
    speciality,
    setSpeciality,
    aiDoctors,
    setAiDoctors
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);