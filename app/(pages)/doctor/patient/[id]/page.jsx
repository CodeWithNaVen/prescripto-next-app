'use client';
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ReactPlayer from 'react-player';

import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

export default function PatientViewPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  console.log("Patient ID:", id);

  useEffect(() => {
    async function fetchPatient() {
      try {
        const res = await fetch(`/api/doctor/patient/${id}`);
        const data = await res.json();

        if (!data.success) {
          setError(data.message || "Failed to load patient");
          setLoading(false);
          return;
        }

        setPatient(data.patient);
      } catch (err) {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    }

    fetchPatient();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;
  if (!patient) return <p className="text-center mt-10">No patient data found.</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Patient Details</h1>

      {/* Basic info */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">

        <div className="flex max-md:flex-col items-center md:items-start justify-center gap-5">
            <div>
                <Image src={patient.profileImage} alt="Patient" width={100} height={100} className="w-32 h-32 rounded-md mx-auto mb-4 border-primary border-2" />

            </div>
            <div>
                <p><strong>Name:</strong> {patient.name}</p>
                <p><strong>Email:</strong> {patient.email}</p>
                <p><strong>Phone:</strong> {patient.phone || "N/A"}</p>
                <p><strong>Gender:</strong> {patient.gender || "N/A"}</p>
                <p><strong>Date of Birth:</strong> {patient.dob || "N/A"}</p>
                {patient.address && (
                <p><strong>Address:</strong> {patient.address.line1} {patient.address.line2}</p>
                )}
            </div>
        </div>
      </div>

      {/* Images */}
      {/* <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Images</h2>
        {patient.images?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {patient.images.map((url, idx) => (
              <div key={idx} className="relative w-full h-48 rounded-lg overflow-hidden shadow">
                <Image src={url} alt={`Patient Image ${idx + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No images uploaded.</p>
        )}
      </div> */}


      {/* Images */}
    <div>
        <h2 className="text-2xl font-semibold mb-4">Images</h2>
        {patient.images?.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {patient.images.map((url, i) => (
                <Zoom key={i}>
                <img
                    src={url}
                    alt={`Patient Image ${i + 1}`}
                    className="rounded-lg shadow-md cursor-pointer object-cover w-full h-48"
                />
                </Zoom>
            ))}
            </div>
        ) : (
            <p className="text-gray-500">No images uploaded.</p>
        )}
    </div>

      {/* Videos */}
        <div>
            <h2 className="text-2xl font-semibold mb-4">Videos</h2>
            {patient.videoUrls?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {patient.videoUrls.map((url, idx) => (
                    <div key={idx} className="w-full rounded-lg shadow-lg overflow-hidden">
                    <ReactPlayer
                        src={url}
                        controls
                        width="100%"
                        height="200px"
                    />
                    </div>
                ))}
                </div>
            ) : (
                <p className="text-gray-500">No videos uploaded.</p>
            )}
        </div>
    </div>
  );
}
