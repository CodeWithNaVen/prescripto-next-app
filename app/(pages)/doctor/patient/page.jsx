'use client';
import { useEffect, useState } from "react";
import Link from "next/link";
import { useDoctorAppContext } from "@/context/DoctorAppContext";

export default function PatientsListPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const {axios, doctor} = useDoctorAppContext();

  const patientList = async ()=>{
    try {
      const res = await axios.get('/api/doctor/patient');
      const data = await res.data;

      if(data.success) setPatients(data.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }finally{
      setLoading(false);
    }
  }

  useEffect(() => {
    doctor && patientList();
  }, [doctor]);

  if (loading) return <p className="text-center mt-10">Loading patients...</p>;

  console.log("✅✅", patients);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Patients List</h1>

      {patients.length === 0 && <p>No patients found.</p>}

      <ul className="space-y-4">
        {patients.map((patient) => (
          <li key={patient._id} className="p-4 bg-white rounded-lg shadow hover:bg-gray-50 transition">
            <Link href={`/doctor/patient/${patient._id}`} className="text-lg font-semibold text-blue-600 hover:underline">
              {patient.name} — {patient.email}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
