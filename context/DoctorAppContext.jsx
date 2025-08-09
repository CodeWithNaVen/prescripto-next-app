'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.NEXT_PUBLIC_URL;

export const DoctorAppContext = createContext();

export const DoctorAppContextProvider = ({ children }) => {
    const router = useRouter();
    const pathname = usePathname();

    const [doctor, setDoctor] = useState(null);
    const [loadingDoctor, setLoadingDoctor] = useState(true);

    const [profileData, setProfileData] = useState(null);

    const getDoctorProfile = async () => {
        try {
            const res = await axios.get('/api/auth/doctor/profile');
            const data = res.data;
            
            if (data.success) {
                setDoctor(data.doctorData);
                setProfileData(data.doctorData);
            } else {
                setDoctor(null);
            }
        } catch (err) {
            setDoctor(null);
        } finally {
            setLoadingDoctor(false);
        }
    };

    

    // fetch all appointments
    const [appointments, setAppointments] = useState([]);
    const fetchAllAppointments = async () => {
        try {
            const res = await axios.get('/api/doctor/appointments');
            const data = res.data;
            
            if (data.success) {
                setAppointments(data.appointments);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error(err?.message || 'Error fetching appointments');
        }
    }

    //mark appointments as completed
    const markAppointmentAsCompleted = async(appointmentId)=>{
        try {
            const res = await axios.post(`/api/doctor/complete-appointment`, {appointmentId});
            const data = await res.data;

            if(data.success){
                toast.success(data.message);
                fetchAllAppointments(); // update appointments
            }else{
                toast.error(data.message);
            }

        } catch (error) {
            console.log(error.message);
            toast.error('Failed to mark appointment as completed'+ error.message);
            
        }
    };


    //mark appointments as cancelled
    const markAppointmentAsCancel = async(appointmentId)=>{
        try {
            const res = await axios.post(`/api/doctor/cancel-appointment`, {appointmentId});
            const data = await res.data;
            
            if(data.success){
                toast.success(data.message);
                fetchAllAppointments(); //update appointment
            }else{
                toast.error(data.message);
            }

        } catch (error) {
            console.log(error.message);
            toast.error('Failed to mark appointment as completed'+ error.message);
            
        }
    };

    // get dashboard data
    const [dashData, setDashData] = useState(null);

    const fetchDashboardData = async () => {
        try {
            const res = await axios.get('/api/doctor/dashboard');
            const data = res.data;
            
            if (data.success) {
                setDashData(data?.dashData);
            }
        } catch (err) {
            toast('Login to Continue');
        }
    };

    const value = { 
        doctor, 
        setDoctor, 
        loadingDoctor, 
        router, 
        pathname,
        axios,
        getDoctorProfile,
        profileData, setProfileData,
        fetchAllAppointments,
        appointments,
        markAppointmentAsCompleted,
        markAppointmentAsCancel,
        fetchDashboardData,
        dashData
    };

    useEffect(() => {
        getDoctorProfile();
    }, []);


    useEffect(() => {
        doctor && fetchDashboardData();
    }, [doctor]);

    

    return (
        <DoctorAppContext.Provider value={value}>
            {children}
        </DoctorAppContext.Provider>
    );
};

export const useDoctorAppContext = () => useContext(DoctorAppContext);
