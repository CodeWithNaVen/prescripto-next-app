"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, Search, Calendar, User, UserCheck, 
  Activity, MoreVertical, Trash2, CheckCircle, 
  XCircle, Clock, Filter, Loader2 
} from 'lucide-react';

const API_URL = '/api/ai/appointments';

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '', doctorName: '', date: '', symptom: '', status: 'pending'
  });

  // Fetch Data
  const fetchAppointments = async () => {
    try {
      const { data } = await axios.get(API_URL);
      setAppointments(data.appointments);
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAppointments(); }, []);

  // Handlers
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, formData);
      setIsModalOpen(false);
      setFormData({ patientName: '', doctorName: '', date: '', symptom: '', status: 'pending' });
      fetchAppointments();
    } catch (err) { alert("Error creating appointment"); }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(API_URL, { id, status: newStatus });
      fetchAppointments();
    } catch (err) { alert("Error updating status"); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      await axios.delete(API_URL, { data: { id } });
      fetchAppointments();
    } catch (err) { alert("Error deleting"); }
  };

  // Status Badge Helper
  const StatusBadge = ({ status }) => {
    const styles = {
      confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
      pending: "bg-amber-100 text-amber-700 border-amber-200",
      cancelled: "bg-rose-100 text-rose-700 border-rose-200",
      completed: "bg-primary/100 text-primary/700 border-primary/200",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      {/* Header Area */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Appointment Manager</h1>
            <p className="text-slate-500">Manage and track AI-driven patient bookings</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-primary/600 hover:bg-primary/700 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-primary/200 font-semibold"
          >
            <Plus size={20} /> New Appointment
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total" value={appointments.length} icon={<Activity className="text-primary/600" />} />
          <StatCard title="Confirmed" value={appointments.filter(a => a.status === 'confirmed').length} icon={<CheckCircle className="text-emerald-600" />} />
          <StatCard title="Pending" value={appointments.filter(a => a.status === 'pending').length} icon={<Clock className="text-amber-600" />} />
          <StatCard title="Completed" value={appointments.filter(a => a.status === 'completed').length} icon={<UserCheck className="text-indigo-600" />} />
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">Patient</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">Doctor</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">Date & Symptom</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <Loader2 className="animate-spin mx-auto text-primary/600" size={32} />
                    </td>
                  </tr>
                ) : appointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{appt.patientName}</div>
                      <div className="text-xs text-slate-400 font-mono">{appt.id.slice(-6).toUpperCase()}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">Dr. {appt.doctorName}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-slate-700"><Calendar size={14}/> {appt.date}</div>
                      <div className="text-xs text-slate-500 italic mt-1">"{appt.symptom}"</div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={appt.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <select 
                          value={appt.status} 
                          onChange={(e) => handleStatusChange(appt.id, e.target.value)}
                          className="text-xs border rounded p-1 bg-white outline-none focus:ring-2 ring-primary/100"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirm</option>
                          <option value="completed">Complete</option>
                          <option value="cancelled">Cancel</option>
                        </select>
                        <button onClick={() => handleDelete(appt.id)} className="text-slate-400 hover:text-rose-600 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-4">New Appointment</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Patient Name</label>
                <input required type="text" className="w-full border rounded-lg px-3 py-2 focus:ring-2 ring-primary/500 outline-none" 
                  onChange={(e) => setFormData({...formData, patientName: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Doctor</label>
                  <input required type="text" className="w-full border rounded-lg px-3 py-2 focus:ring-2 ring-primary/500 outline-none" 
                    onChange={(e) => setFormData({...formData, doctorName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                  <input required type="date" className="w-full border rounded-lg px-3 py-2 focus:ring-2 ring-primary/500 outline-none" 
                    onChange={(e) => setFormData({...formData, date: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Symptoms</label>
                <textarea required rows="3" className="w-full border rounded-lg px-3 py-2 focus:ring-2 ring-primary/500 outline-none" 
                  onChange={(e) => setFormData({...formData, symptom: e.target.value})}></textarea>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border rounded-lg hover:bg-slate-50">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary/600 text-white rounded-lg hover:bg-primary/700 shadow-md transition-all">Save Appointment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-component for stats
function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
      <div className="bg-slate-50 p-3 rounded-xl">{icon}</div>
    </div>
  );
}