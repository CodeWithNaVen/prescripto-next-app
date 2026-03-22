"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ClipboardList, CheckCircle2, XCircle, 
  Clock, Stethoscope, User, CalendarDays,
  Search, RefreshCw
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useDoctorAppContext } from '@/context/DoctorAppContext';

export default function DoctorDashboard() {
  const pathname = usePathname();
  const {doctor} = useDoctorAppContext();

  // const docName = doctor?.name && `${(doctor?.name).split(' ')[1]}`;

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDoctor, setCurrentDoctor] = useState(doctor?.name || ''); // Mock auth
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchDoctorAppointments = async () => {
    setLoading(true);
    try {
      // Filtering by doctor name in the API
      const { data } = await axios.get(`/api/ai/appointments?doctor=${currentDoctor}`);
      setAppointments(data.appointments);
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDoctorAppointments(); }, [currentDoctor]);

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch('/api/ai/appointments', { id, status: newStatus });
      fetchDoctorAppointments(); // Refresh list
    } catch (err) { alert("Failed to update status"); }
  };

  const filteredList = appointments.filter(a => 
    filterStatus === 'all' ? true : a.status === filterStatus
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Doctor Identity Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-primary/600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/200">
              <Stethoscope size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Welcome, {currentDoctor}</h1>
              <p className="text-slate-500">You have {appointments.filter(a => a.status === 'confirmed').length} appointments today</p>
            </div>
          </div>
          
          <div className="flex bg-white text-slate-900 p-1 rounded-xl shadow-sm border border-slate-200">
            {['all', 'confirmed', 'completed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterStatus(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                  filterStatus === tab ? 'bg-primary text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Appointments List */}
        {loading ? (
          <div className="flex justify-center py-20"><RefreshCw className="animate-spin text-primary/600" size={40} /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredList.map((appt) => (
              <div key={appt.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
                {/* Status Top Bar */}
                <div className={`h-1.5 w-full ${
                  appt.status === 'completed' ? 'bg-emerald-500' : 
                  appt.status === 'confirmed' ? 'bg-primary/500' : 'bg-amber-500'
                }`} />
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
                        <User size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{appt.patientName}</h3>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <CalendarDays size={12} /> {appt.date}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4 mb-4">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 text-primary">Reported Symptoms</p>
                    <p className="text-slate-700 text-sm leading-relaxed italic">"{appt.symptom}"</p>
                  </div>

                  {/* Doctor Actions */}
                  <div className="mt-auto flex gap-2">
                    {appt.status !== 'completed' && (
                      <>
                        <button 
                          onClick={() => updateStatus(appt.id, 'completed')}
                          className="flex-1 flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 py-2 rounded-lg font-semibold text-sm transition-colors border border-emerald-100"
                        >
                          <CheckCircle2 size={16} /> Mark Done
                        </button>
                        <button 
                          onClick={() => updateStatus(appt.id, 'cancelled')}
                          className="px-3 flex items-center justify-center bg-rose-50 text-rose-600 hover:bg-rose-100 py-2 rounded-lg transition-colors border border-rose-100"
                        >
                          <XCircle size={16} />
                        </button>
                      </>
                    )}
                    {appt.status === 'completed' && (
                      <div className="w-full text-center py-2 text-emerald-600 font-medium flex items-center justify-center gap-2 bg-emerald-50 rounded-lg">
                        <CheckCircle2 size={16} /> Treatment Completed
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredList.length === 0 && !loading && (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <ClipboardList className="mx-auto text-slate-300 mb-4" size={48} />
            <h3 className="text-lg font-medium text-slate-900">No appointments found</h3>
            <p className="text-slate-500">There are no records matching your current filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}