'use client'

import { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import DoctorCard from "@/components/UserComponents/DoctorCard";
import toast from "react-hot-toast";
import RecommendedDoctors from "@/components/UserComponents/RecommendedDoctors";

const Doctors = () => {
  const { router, user, doctors, speciality, setSpeciality } = useAppContext();

  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality));
    } else {
      setFilterDoc(doctors);
    }
  };

  // if no user then redirect to login page
  useEffect(() => {
    if (!user) {
      router.push('/login');
      toast('🔔 Please login to see all doctors');
    }
  }, [user]);

  useEffect(() => {
    applyFilter();
  }, [speciality, doctors]);

  return (
    <div className="mx-4 my-8 sm:mx-[10%]">

      {/* Page Title */}
      <p className="text-base md:text-xl text-gray-800">
        Browse through the doctor specialist.
      </p>

      {/* ⭐ Recommended Doctors (NEW – SAFE INSERTION) */}
      {speciality && (
        <div className="mt-6">
          <RecommendedDoctors speciality={speciality} />
        </div>
      )}

      <div className="flex flex-col md:flex-row items-start gap-10 mt-5">

        {/* left section */}
        <button
          onClick={() => setShowFilter(prev => !prev)}
          className={`py-2 px-10 border rounded text-sm transition-all duration-300 cursor-pointer sm:hidden 
          ${showFilter ? 'bg-primary text-white' : 'border-primary'}`}
        >
          Filters
        </button>

        <div className={`flex-col gap-5 text-center text-sm md:text-base text-gray-800 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
          <p
            onClick={() => setSpeciality('')}
            className={`w-[94vw] sm:w-auto py-3 hover:bg-blue-200 border-2 border-primary cursor-pointer rounded-md transition-all duration-300 
            ${speciality === '' && 'bg-blue-200'}`}
          >
            ALL Doctors
          </p>

          <p onClick={() => setSpeciality('General physician')} className={`w-[94vw] sm:w-auto py-3 hover:bg-blue-200 border-2 border-primary cursor-pointer rounded-md transition-all duration-300 ${speciality === 'General physician' && 'bg-blue-200'}`}>
            General physician
          </p>

          <p onClick={() => setSpeciality('Gynecologist')} className={`w-[94vw] sm:w-auto px-8 py-3 hover:bg-blue-200 border-2 border-primary cursor-pointer rounded-md transition-all duration-300 ${speciality === "Gynecologist" && 'bg-blue-200'}`}>
            Gynecologist
          </p>

          <p onClick={() => setSpeciality('Dermatologist')} className={`w-[94vw] sm:w-auto px-8 py-3 hover:bg-blue-200 border-2 border-primary cursor-pointer rounded-md transition-all duration-300 ${speciality === "Dermatologist" && 'bg-blue-200'}`}>
            Dermatologist
          </p>

          <p onClick={() => setSpeciality('Pediatricians')} className={`w-[94vw] sm:w-auto px-8 py-3 hover:bg-blue-200 border-2 border-primary cursor-pointer rounded-md transition-all duration-300 ${speciality === "Pediatricians" && 'bg-blue-200'}`}>
            Pediatricians
          </p>

          <p onClick={() => setSpeciality('Neurologist')} className={`w-[94vw] sm:w-auto px-8 py-3 hover:bg-blue-200 border-2 border-primary cursor-pointer rounded-md transition-all duration-300 ${speciality === "Neurologist" && 'bg-blue-200'}`}>
            Neurologist
          </p>

          <p onClick={() => setSpeciality('Gastroenterologist')} className={`w-[94vw] sm:w-auto px-8 py-3 hover:bg-blue-200 border-2 border-primary cursor-pointer rounded-md transition-all duration-300 ${speciality === "Gastroenterologist" && 'bg-blue-200'}`}>
            Gastroenterologist
          </p>
          {/* add more specialities */}
          <p onClick={() => setSpeciality('Cardiologist')} className={`w-[94vw] sm:w-auto px-8 py-3 hover:bg-blue-200 border-2 border-primary cursor-pointer rounded-md transition-all duration-300 ${speciality === "Cardiologist" && 'bg-blue-200'}`}>
            Cardiologist
          </p>

          <p onClick={() => setSpeciality('Pulmonologist')} className={`w-[94vw] sm:w-auto px-8 py-3 hover:bg-blue-200 border-2 border-primary cursor-pointer rounded-md transition-all duration-300 ${speciality === "Pulmonologist" && 'bg-blue-200'}`}>
            Pulmonologist
          </p>
          <p onClick={() => setSpeciality('Orthopedist')} className={`w-[94vw] sm:w-auto px-8 py-3 hover:bg-blue-200 border-2 border-primary cursor-pointer rounded-md transition-all duration-300 ${speciality === "Orthopedist" && 'bg-blue-200'}`}>
            Orthopedist
          </p>

          <p onClick={() => setSpeciality('Urologist')} className={`w-[94vw] sm:w-auto px-8 py-3 hover:bg-blue-200 border-2 border-primary cursor-pointer rounded-md transition-all duration-300 ${speciality === "Urologist" && 'bg-blue-200'}`}>
            Urologist
          </p>
          <p onClick={() => setSpeciality('Psychiatrist')} className={`w-[94vw] sm:w-auto px-8 py-3 hover:bg-blue-200 border-2 border-primary cursor-pointer rounded-md transition-all duration-300 ${speciality === "Psychiatrist" && 'bg-blue-200'}`}>
            Psychiatrist
          </p>
          <p onClick={() => setSpeciality('Hepatologist')} className={`w-[94vw] sm:w-auto px-8 py-3 hover:bg-blue-200 border-2 border-primary cursor-pointer rounded-md transition-all duration-300 ${speciality === "Hepatologist" && 'bg-blue-200'}`}>
            Hepatologist
          </p>
          <p onClick={() => setSpeciality('Nephrologist')} className={`w-[94vw] sm:w-auto px-8 py-3 hover:bg-blue-200 border-2 border-primary cursor-pointer rounded-md transition-all duration-300 ${speciality === "Nephrologist" && 'bg-blue-200'}`}>
            Nephrologist
          </p>
          <p onClick={() => setSpeciality('ENT')} className={`w-[94vw] sm:w-auto px-8 py-3 hover:bg-blue-200 border-2 border-primary cursor-pointer rounded-md transition-all duration-300 ${speciality === "ENT" && 'bg-blue-200'}`}>
            ENT
          </p>
          <p onClick={() => setSpeciality('Oncologist')} className={`w-[94vw] sm:w-auto px-8 py-3 hover:bg-blue-200 border-2 border-primary cursor-pointer rounded-md transition-all duration-300 ${speciality === "Oncologist" && 'bg-blue-200'}`}>
            Oncologist
          </p>
          <p onClick={() => setSpeciality('Phlebologist')} className={`w-[94vw] sm:w-auto px-8 py-3 hover:bg-blue-200 border-2 border-primary cursor-pointer rounded-md transition-all duration-300 ${speciality === "Phlebologist" && 'bg-blue-200'}`}>
            Phlebologist
          </p>
          <p onClick={() => setSpeciality('Ophthalmologist')} className={`w-[94vw] sm:w-auto px-8 py-3 hover:bg-blue-200 border-2 border-primary cursor-pointer rounded-md transition-all duration-300 ${speciality === "Ophthalmologist" && 'bg-blue-200'}`}>
            Ophthalmologist
          </p>
          <p onClick={() => setSpeciality('Rheumatologist')} className={`w-[94vw] sm:w-auto px-8 py-3 hover:bg-blue-200 border-2 border-primary cursor-pointer rounded-md transition-all duration-300 ${speciality === "Rheumatologist" && 'bg-blue-200'}`}>
            Rheumatologist
          </p>
          <p onClick={() => setSpeciality('InfectiousDisease')} className={`w-[94vw] sm:w-auto px-8 py-3 hover:bg-blue-200 border-2 border-primary cursor-pointer rounded-md transition-all duration-300 ${speciality === "InfectiousDisease" && 'bg-blue-200'}`}>
            InfectiousDisease
          </p>
          <p onClick={() => setSpeciality('Proctologist')} className={`w-[94vw] sm:w-auto px-8 py-3 hover:bg-blue-200 border-2 border-primary cursor-pointer rounded-md transition-all duration-300 ${speciality === "Proctologist" && 'bg-blue-200'}`}>
            Proctologist
          </p>
          <p onClick={() => setSpeciality('Allergist')} className={`w-[94vw] sm:w-auto px-8 py-3 hover:bg-blue-200 border-2 border-primary cursor-pointer rounded-md transition-all duration-300 ${speciality === "Allergist" && 'bg-blue-200'}`}>
            Allergist
          </p>
          
        </div>

        {/* right side */}
        <div className="w-full max-sm:flex flex-col justify-center items-center grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 gap-y-7">
          {filterDoc.map((item, index) => (
            <DoctorCard key={index} doctor={item} />
          ))}
        </div>

      </div>
    </div>
  );
};

export default Doctors;
