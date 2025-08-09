'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.NEXT_PUBLIC_URL;

export const AdminAppContext = createContext();

export const AdminAppContextProvider = ({ children }) => {
    const router = useRouter();
    const pathname = usePathname();

    const [admin, setAdmin] = useState(null);
    const [loadingAdmin, setLoadingAdmin] = useState(true);

    const [doctors, setDoctors] = useState([]);

    const getAdminProfile = async () => {
        try {
            const res = await axios.get('/api/auth/admin/profile');
            const data = res.data;
            
            if (data.success) {
                setAdmin(data.adminData);
            } else {
                setAdmin(null);
            }
        } catch (err) {
            setAdmin(null);
        } finally {
            setLoadingAdmin(false);
        }
    };

    const fetchAllDoctors = async () => {
        try {
            const res = await axios.get('/api/auth/admin/all-doctors');
            const data = res.data;
            setDoctors(data.doctors);
        } catch (err) {
            toast.error(err?.message || 'Error fetching doctors');
        }
    };

    const changeAvailability = async (doctorId) => {
        try {
            const res = await axios.put(`/api/auth/admin/change-availability`, { doctorId });
            const data = res.data;

            toast.success(data.message);
            fetchAllDoctors(); // Refresh list
        } catch (err) {
            toast.error(err?.message || 'Error updating availability');
        }
    };


    //get all appointments
    const [appointments, setAppointments] = useState([]);

    const fetchAllAppointments = async () => {
        try {
            const res = await axios.get('/api/admin/appointments');
            const data = res.data;

            if (!data.success) {
                toast.error(data.message);
                return;
            }

            setAppointments(data.appointments);
        } catch (err) {
            toast.error(err?.message || 'Error fetching appointments');
        }
    };


    //cancel appointment
    const cancelAppointment = async(appointmentId)=>{
        try {
            const res = await axios.post(`/api/admin/cancel-appointment`, {appointmentId});

            const data = await res.data;

            if(data.success){
                toast.success(data.message);
                fetchAllAppointments(); //update appointments data

                //refresh route
                router.refresh();
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error('Failed to cancel appointment', error.message);
        }
    }


    //get all dashData 
    const [dashData, setDashData] = useState(null);

    const fetchDashData = async () => {
        try {
            const res = await axios.get('/api/admin/dashboard');
            const data = res.data;

            if (!data.success) {
                toast.error(data.message);
                return;
            }

            setDashData(data.dashData);
        } catch (err) {
            toast.error(err?.message || 'Error fetching dashData');
        }
    };


    const value = { 
        axios,
        admin, setAdmin, 
        loadingAdmin, 
        router, pathname,
        getAdminProfile,
        doctors,
        fetchAllDoctors,
        changeAvailability,
        appointments,
        setAppointments,
        fetchAllAppointments,
        cancelAppointment,
        dashData,
        setDashData,
        fetchDashData

    }


    useEffect(() => {
        getAdminProfile();
    }, []);

    return (
        <AdminAppContext.Provider value={value}>
        {children}
        </AdminAppContext.Provider>
    );
};

export const useAdminAppContext = () => useContext(AdminAppContext);
