"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { adminAssets } from "@/assets/admin_assets/adminAssets";
import { Plus, Trash, Loader2 } from "lucide-react";
import { useAdminAppContext } from "@/context/AdminAppContext";

const AddDoctorPage = () => {
  // Get axios instance and router from admin context
  const { axios, router, admin } = useAdminAppContext();

  // Loading state for form submission
  const [loading, setLoading] = useState(false);

  // Form state variables for doctor information
  const [doctorPic, setDoctorPic] = useState(null); // Store selected image file
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [degree, setDegree] = useState("");
  const [fees, setFees] = useState("");
  const [about, setAbout] = useState("");

  // Address object with all required fields - matches database model structure
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
  });

  // Experience array - matches the database model structure
  // Each experience object has: hospital (required), duration (required), position (optional)
  const [experience, setExperience] = useState([
    {
      hospital: "",
      duration: "",
      position: "",
    },
  ]);

  /**
   * Handle file selection for doctor's profile picture
   */
  const onDoctorPicChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setDoctorPic(e.target.files[0]);
    }
  };

  /**
   * Update a specific field in the experience array
   * @param {number} index - Index of experience item to update
   * @param {string} key - Field name to update (hospital, duration, or position)
   * @param {string} value - New value for the field
   */
  const onExperienceChange = (index, key, value) => {
    const updated = [...experience]; // Create a copy of the experience array
    updated[index][key] = value; // Update the specific field
    setExperience(updated); // Update state with modified array
  };

  /**
   * Add a new empty experience entry to the form
   */
  const addExperience = () => {
    setExperience([
      ...experience,
      { hospital: "", duration: "", position: "" },
    ]);
  };

  /**
   * Remove an experience entry from the form
   * @param {number} index - Index of experience item to remove
   */
  const removeExperience = (index) => {
    const updated = [...experience]; // Create a copy of the experience array
    updated.splice(index, 1); // Remove the item at the specified index
    setExperience(updated); // Update state with modified array
  };

  /**
   * Handle form submission - send doctor data to backend API
   * @param {Event} e - Form submit event
   */
  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault(); // Prevent default form submission
      setLoading(true); // Show loading state

      console.log("Form submitted, starting validation..."); // Debug log

      // Create FormData object for multipart/form-data submission (required for file uploads)
      const formData = new FormData();

      // Validate required fields before submission
      if (!doctorPic) {
        toast.error("Doctor image is required");
        return; // Exit early if no image selected
      }

      // Validate that required address fields are filled
      if (!address.street || !address.city || !address.state || !address.zip) {
        toast.error("All address fields are required");
        return;
      }

      // Validate that at least one experience entry is complete
      const hasValidExperience = experience.some(
        (exp) => exp.hospital && exp.duration
      );
      if (!hasValidExperience) {
        toast.error(
          "At least one complete experience entry (hospital and duration) is required"
        );
        return;
      }

      console.log("Adding form data..."); // Debug log

      // Append all form fields to FormData
      formData.append("doctorPic", doctorPic); // File upload
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("speciality", speciality);
      formData.append("degree", degree);
      formData.append("about", about);
      formData.append("fees", fees);

      // Convert objects/arrays to JSON strings for transmission
      formData.append("address", JSON.stringify(address));
      formData.append("experience", JSON.stringify(experience));

      console.log("Making API request..."); // Debug log

      // Send POST request to add doctor endpoint
      const res = await axios.post("/api/auth/admin/add-doctor", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Required for file uploads
        },
      });

      console.log("API Response:", res.data); // Debug log
      const data = res.data;

      // Handle API response
      if (data.success) {
        toast.success(data.message); // Show success message
        
        // Reset form fields after successful submission
        setDoctorPic(null);
        setName("");
        setEmail("");
        setPassword("");
        setSpeciality("");
        setDegree("");
        setAbout("");
        setFees("");
        setAddress({ street: "", city: "", state: "", zip: "" });
        setExperience([
          { hospital: "", duration: "", position: "" },
        ]);
        
      } else {
        toast.error(data.message || "Something went wrong"); // Show error message
      }
    } catch (error) {
      console.error("Error submitting doctor:", error); // Debug log
      // Show detailed error message
      toast.error(
        "Failed to submit doctor: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false); // Hide loading state regardless of success/failure
    }
  };

  useEffect(() => {
      if (!admin) {
        router.push('/admin/login');
      }
    }, []);

  return (
    <main className="flex justify-center items-center">
      <div className="px-5 py-8 max-w-4xl bg-white shadow-lg rounded-lg mt-5 mx-auto w-full">
        <h2 className="text-2xl font-semibold mb-4">Add New Doctor</h2>

        {/* Main form with submit handler */}
        <form onSubmit={onSubmitHandler} className="space-y-4">
          {/* Doctor Profile Picture Upload Section */}
          <div>
            <label className="block mb-1 font-medium">Doctor Image</label>
            {/* Hidden file input - triggered by clicking on image */}
            <input
              id="doctorPic"
              type="file"
              accept="image/*"
              onChange={onDoctorPicChange}
              hidden
            />

            {/* Display preview if image selected, otherwise show upload placeholder */}
            {doctorPic ? (
              <Image
                src={URL.createObjectURL(doctorPic)} // Create temporary URL for preview
                alt="Preview"
                width={100}
                height={100}
                className="mt-2 object-cover cursor-pointer border-2 border-primary rounded-full"
                onClick={() => document.getElementById("doctorPic").click()} // Trigger file input
              />
            ) : (
              <Image
                src={adminAssets.upload_area}
                onClick={() => document.getElementById("doctorPic").click()} // Trigger file input
                alt="Upload Area"
                width={100}
                height={100}
                className="mt-2 object-cover cursor-pointer border-2 border-primary rounded-full"
              />
            )}
          </div>

          {/* Basic Information Grid - Responsive 2-column layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-nowrap max-md:text-sm md:w-lg">
            <span>
              <p>Name</p>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="rounded p-2 border border-primary"
              />
            </span>

            <span>
              <p>Email</p>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded p-2 border border-primary"
              />
            </span>

            <span>
              <p>Password</p>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded p-2 border border-primary"
              />
            </span>

            <span>
              <p>Speciality</p>
              <input
                type="text"
                placeholder="Speciality"
                value={speciality}
                onChange={(e) => setSpeciality(e.target.value)}
                required
                className="rounded p-2 border border-primary"
              />
            </span>

            <span>
              <p>Degree</p>
              <input
                type="text"
                placeholder="Degree"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                required
                className="rounded p-2 border border-primary"
              />
            </span>

            <span>
              <p>Fees</p>
              <input
                type="text"
                placeholder="Fees"
                value={fees}
                onChange={(e) => setFees(e.target.value)}
                required
                className="rounded p-2 border border-primary"
              />
            </span>
          </div>

          {/* About Section - Full width textarea */}
          <span>
            <p>About</p>
            <textarea
              placeholder="About"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              rows={3}
              className="border border-primary rounded p-2"
              required
            />
          </span>

          {/* Address Section - All fields required to match backend validation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <span>
              <p>
                Street <span className="text-red-500">*</span>
              </p>
              <input
                type="text"
                placeholder="Street Address"
                value={address.street}
                onChange={(e) =>
                  setAddress({ ...address, street: e.target.value })
                }
                required
                className="rounded p-2 border border-primary"
              />
            </span>

            <span>
              <p>
                City <span className="text-red-500">*</span>
              </p>
              <input
                type="text"
                placeholder="City"
                value={address.city}
                onChange={(e) =>
                  setAddress({ ...address, city: e.target.value })
                }
                required
                className="rounded p-2 border border-primary"
              />
            </span>

            <span>
              <p>
                State <span className="text-red-500">*</span>
              </p>
              <input
                type="text"
                placeholder="State/Province"
                value={address.state}
                onChange={(e) =>
                  setAddress({ ...address, state: e.target.value })
                }
                required
                className="rounded p-2 border border-primary"
              />
            </span>

            <span>
              <p>
                Zip Code <span className="text-red-500">*</span>
              </p>
              <input
                type="text"
                placeholder="ZIP/Postal Code"
                value={address.zip}
                onChange={(e) =>
                  setAddress({ ...address, zip: e.target.value })
                }
                required
                className="rounded p-2 border border-primary"
              />
            </span>
          </div>

          {/* Experience Section - Dynamic array of experience entries */}
          <div>
            <label className="block font-medium mb-1">Experience</label>

            {/* Map through experience array to create input rows */}
            {experience.map((item, index) => (
              <div key={index} className="flex max-sm:flex-col flex-wrap gap-3 mb-2">
                {/* Hospital input - required field */}
                <input
                  type="text"
                  placeholder="Hospital"
                  value={item.hospital}
                  onChange={(e) =>
                    onExperienceChange(index, "hospital", e.target.value)
                  }
                  className="rounded p-2 border border-primary flex-1"
                  required
                />

                {/* Duration input - required field */}
                <input
                  type="text"
                  placeholder="Duration (e.g., 2 years)"
                  value={item.duration}
                  onChange={(e) =>
                    onExperienceChange(index, "duration", e.target.value)
                  }
                  className="rounded p-2 border border-primary w-32"
                  required
                />

                {/* Position input - optional field */}
                {/* Using || '' to prevent undefined values that cause React controlled/uncontrolled warnings */}
                <input
                  type="text"
                  placeholder="Position (optional)"
                  value={item.position || ""}
                  onChange={(e) =>
                    onExperienceChange(index, "position", e.target.value)
                  }
                  className="rounded p-2 border border-primary w-32"
                />

                {/* Remove experience entry button */}
                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  className="text-red-500 hover:text-red-700 cursor-pointer"
                >
                  <Trash />
                </button>
              </div>
            ))}

            {/* Add new experience entry button */}
            <button
              type="button"
              onClick={addExperience}
              className="mt-1 flex items-center gap-2 text-sm text-primary font-medium cursor-pointer"
            >
              <Plus /> Add More
            </button>
          </div>

          {/* Submit Button - Shows loading state during form submission */}
          <button
            type="submit"
            disabled={loading} // Disable button during loading
            className="bg-primary text-white py-2 px-10 rounded hover:opacity-90 my-5 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-4 h-4" />
                Adding Doctor...
              </>
            ) : (
              "Add Doctor"
            )}
          </button>
        </form>
      </div>
    </main>
  );
};

export default AddDoctorPage;
