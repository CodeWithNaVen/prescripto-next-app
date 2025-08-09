'use client';

import { useAppContext } from "@/context/AppContext";
import { useDoctorAppContext } from "@/context/DoctorAppContext";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const DoctorProfile = () => {
  const { doctor, profileData, setProfileData, getDoctorProfile, axios, router } = useDoctorAppContext();
  const { currency } = useAppContext();

  const [isEdit, setIsEdit] = useState(false);

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleExperienceChange = (index, field, value) => {
    const updatedExperience = [...(profileData.experience || [])];
    updatedExperience[index] = { ...updatedExperience[index], [field]: value };
    setProfileData((prev) => ({
      ...prev,
      experience: updatedExperience,
    }));
  };

  const updateDoctorProfile = async () => {
    try {
      const res = await axios.put("/api/auth/doctor/update-profile", profileData);
      const data = await res.data;

      if (data.success) {
        toast.success("Profile updated successfully");
        setIsEdit(false);
        getDoctorProfile();
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    getDoctorProfile();
  }, []);

  useEffect(()=>{
    if(!doctor){
      router.push('/doctor/login');
    }
  },[])

  if (!profileData) return <div className="text-center py-10">Loading profile...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary">Doctor Profile</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Profile Image */}
        <div className="flex-shrink-0 mx-auto md:mx-0">
          {profileData.doctorPic ? (
            <Image
              src={profileData.doctorPic}
              alt="Doctor Profile Image"
              width={160}
              height={160}
              className="rounded-full border-4 border-primary object-cover"
              unoptimized
            />
          ) : (
            <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xl">
              No Image
            </div>
          )}
        </div>

        {/* Profile Details */}
        <div className="flex-1 space-y-4">
          {/* Name */}
          <div>
            <label className="block font-semibold mb-1">Name:</label>
            {isEdit ? (
              <input
                type="text"
                value={profileData.name || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-primary focus:ring-1 focus:ring-primary"
              />
            ) : (
              <p className="text-lg font-medium">{profileData.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block font-semibold mb-1">Email:</label>
            <p className="text-gray-600">{profileData.email}</p>
          </div>

          {/* Speciality and Degree */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block font-semibold mb-1">Speciality:</label>
              <p className="text-gray-700">{profileData.speciality || "Not specified"}</p>
            </div>
            <div className="flex-1">
              <label className="block font-semibold mb-1">Degree:</label>
              <p className="text-gray-700">{profileData.degree || "Not specified"}</p>
            </div>
          </div>

          {/* Experience */}
          <div>
            <label className="block font-semibold mb-2">Experience:</label>
            {(profileData.experience || []).length === 0 && !isEdit && (
              <p className="text-gray-500">No experience details available.</p>
            )}
            {(profileData.experience || []).map((exp, index) => (
              <div
                key={index}
                className="mb-3 p-3 border rounded-md bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
              >
                {isEdit ? (
                  <>
                    <input
                      type="text"
                      placeholder="Hospital"
                      value={exp.hospital || ""}
                      onChange={(e) => handleExperienceChange(index, "hospital", e.target.value)}
                      className="border rounded px-2 py-1 flex-1"
                    />
                    <input
                      type="text"
                      placeholder="Duration"
                      value={exp.duration || ""}
                      onChange={(e) => handleExperienceChange(index, "duration", e.target.value)}
                      className="border rounded px-2 py-1 flex-1"
                    />
                    <input
                      type="text"
                      placeholder="Position"
                      value={exp.position || ""}
                      onChange={(e) => handleExperienceChange(index, "position", e.target.value)}
                      className="border rounded px-2 py-1 flex-1"
                    />
                  </>
                ) : (
                  <p className="text-gray-700">
                    <span className="font-semibold">{exp.position}</span> at {exp.hospital}{" "}
                    <span className="text-gray-500">({exp.duration})</span>
                  </p>
                )}
              </div>
            ))}
            {isEdit && (
              <button
                type="button"
                onClick={() =>
                  setProfileData((prev) => ({
                    ...prev,
                    experience: [...(prev.experience || []), { hospital: "", duration: "", position: "" }],
                  }))
                }
                className="mt-2 px-3 py-1 bg-primary text-white rounded hover:bg-primary-dark transition"
              >
                + Add Experience
              </button>
            )}
          </div>

          {/* Fees */}
          <div>
            <label className="block font-semibold mb-1">Appointment Fees:</label>
            {isEdit ? (
              <input
                type="number"
                value={profileData.fees || ""}
                onChange={(e) => handleInputChange("fees", e.target.value)}
                className="w-32 border border-gray-300 rounded px-3 py-2 focus:outline-primary focus:ring-1 focus:ring-primary"
              />
            ) : (
              <p>
                {currency} {profileData.fees || "Not set"}
              </p>
            )}
          </div>

          {/* Availability */}
          <div>
            <label className="block font-semibold mb-1">Availability:</label>
            {isEdit ? (
              <select
                value={profileData.available ? "true" : "false"}
                onChange={(e) => handleInputChange("available", e.target.value === "true")}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-primary focus:ring-1 focus:ring-primary"
              >
                <option value="true">Available</option>
                <option value="false">Not Available</option>
              </select>
            ) : (
              <p>{profileData.available ? "Available" : "Not Available"}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block font-semibold mb-1">Address:</label>
            {isEdit ? (
              <>
                <input
                  type="text"
                  placeholder="Street"
                  value={profileData.address?.street || ""}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      address: { ...prev.address, street: e.target.value },
                    }))
                  }
                  className="mb-2 w-full border rounded px-3 py-2 focus:outline-primary focus:ring-1 focus:ring-primary"
                />
                <input
                  type="text"
                  placeholder="City"
                  value={profileData.address?.city || ""}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      address: { ...prev.address, city: e.target.value },
                    }))
                  }
                  className="mb-2 w-full border rounded px-3 py-2 focus:outline-primary focus:ring-1 focus:ring-primary"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={profileData.address?.state || ""}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      address: { ...prev.address, state: e.target.value },
                    }))
                  }
                  className="mb-2 w-full border rounded px-3 py-2 focus:outline-primary focus:ring-1 focus:ring-primary"
                />
                <input
                  type="text"
                  placeholder="Zip"
                  value={profileData.address?.zip || ""}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      address: { ...prev.address, zip: e.target.value },
                    }))
                  }
                  className="w-full border rounded px-3 py-2 focus:outline-primary focus:ring-1 focus:ring-primary"
                />
              </>
            ) : profileData.address ? (
              <p className="text-gray-700">
                {profileData.address.street}, {profileData.address.city}, {profileData.address.state} - {profileData.address.zip}
              </p>
            ) : (
              <p className="text-gray-500">No address provided</p>
            )}
          </div>

          {/* About */}
          <div>
            <label className="block font-semibold mb-1">About:</label>
            {isEdit ? (
              <textarea
                value={profileData.about || ""}
                onChange={(e) => handleInputChange("about", e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-primary focus:ring-1 focus:ring-primary"
                rows={4}
              />
            ) : (
              <p className="text-gray-700 whitespace-pre-line">{profileData.about || "No description provided."}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-6 justify-center md:justify-start">
            <button
              onClick={() => setIsEdit(!isEdit)}
              className="px-6 py-2 border rounded text-primary border-primary hover:bg-primary hover:text-white transition cursor-pointer"
            >
              {isEdit ? "Cancel" : "Edit"}
            </button>
            {isEdit && (
              <button
                onClick={updateDoctorProfile}
                className="px-6 py-2 bg-primary text-white rounded hover:bg-primary-dark transition cursor-pointer"
              >
                Save
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
