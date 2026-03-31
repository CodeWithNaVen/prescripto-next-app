"use client";

import { useState } from "react";
import { symptomCategories } from "@/symptomData.js";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { 
  Search, 
  Star, 
  StarHalf, 
  MapPin, 
  Briefcase, 
  Stethoscope, 
  ChevronRight,
  BrainCircuit,
  Activity,
  Plus
} from "lucide-react";

export default function RecommendPage() {
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [custom, setCustom] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { axios } = useAppContext();

  const toggle = (symptom) => {
    setSelected((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    const customSymptoms = custom.split(",").map((s) => s.trim()).filter(Boolean);
    const symptoms = [...new Set([...selected, ...customSymptoms])];
    try {
      const res = await axios.post("/api/recommend", { symptoms });
      setResult(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Helper to render stars (from your theme)
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`f-${i}`} size={14} className="text-yellow-400 fill-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(<StarHalf key="h" size={14} className="text-yellow-400 fill-yellow-400" />);
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`e-${i}`} size={14} className="text-gray-300" />);
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200 pt-12 pb-10 px-6 mb-8 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-2xl">
              <BrainCircuit className="text-primary" size={32} />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            NexCare Symptom Checker
          </h1>
          <p className="text-slate-500">
            Select your symptoms below and our model will recommend the best specialists for you.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* SYMPTOM SELECTION (LEFT) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
              <input
                type="text"
                placeholder="Search symptoms..."
                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              {Object.entries(symptomCategories).map(([category, symptoms]) => {
                const filtered = symptoms.filter((s) => s.toLowerCase().includes(search.toLowerCase()));
                if (filtered.length === 0) return null;
                return (
                  <div key={category} className="bg-white p-5 rounded-2xl border border-slate-200">
                    <h2 className="flex items-center gap-2 mb-3 text-slate-700 font-semibold bg-primary/10 w-max px-6 py-1 rounded-r-full">
                      <span className="border-l-4 border-primary w-8 h-8 flex items-center justify-center" />
                      <Activity size={14} className="text-primary" /> {category}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {filtered.map((symptom) => (
                        <button
                          key={symptom}
                          onClick={() => toggle(symptom)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            selected.includes(symptom)
                              ? "bg-primary text-white shadow-lg shadow-primary/20"
                              : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100"
                          }`}
                        >
                          {symptom.replace(/_/g, " ")}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2 mb-3 text-slate-700 font-semibold">
                <Plus size={18} />
                <span>Other Symptoms</span>
              </div>
              <textarea
                placeholder="Enter any other symptoms separated by commas..."
                className="w-full p-4 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none min-h-[80px]"
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || (selected.length === 0 && !custom)}
              className="w-full bg-primary hover:bg-primary/90 disabled:bg-slate-300 text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? "Analyzing Symptoms..." : "Analyze & Find Recommended Doctors"}
              {!loading && <ChevronRight size={20} />}
            </button>
          </div>

          {/* AI PREDICTIONS (RIGHT) */}
          <div className="lg:col-span-4">
            {result ? (
              <div className="bg-white p-6 rounded-2xl border-2 border-primary/20 shadow-sm sticky top-6">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <BrainCircuit className="text-primary" />
                  Best Prediction
                </h2>
                <div className="space-y-6">
                  {result.predictions.map((p, i) => (
                    <div key={i}>
                      <div className="flex justify-between mb-2">
                        <span className="font-semibold text-slate-700">{p.disease}</span>
                        <span className="text-primary font-bold">{(p.confidence * 100).toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${p.confidence * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-400 sticky top-6">
                <Stethoscope size={40} className="mx-auto mb-4 opacity-20" />
                <p className="text-sm">Select symptoms and click analyze to see best predictions</p>
              </div>
            )}
          </div>
        </div>

        {/* RECOMMENDED DOCTORS (BOTTOM GRID) */}
        {result?.success && (
          <div className="mt-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">
              Top Specialists for your Condition
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {result.recommendations.map((doc) => (
                <div
                  key={doc._id}
                  onClick={() => router.push(`/appointment/${doc._id}`)}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group flex flex-col"
                >
                  <div className="relative aspect-square overflow-hidden bg-primary/10">
                    <Image
                      src={doc.doctorPic || "/placeholder-doc.png"}
                      alt={doc.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-2">
                      {doc.available ? (
                        <span className="flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse"></span>
                          Available
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                          Busy
                        </span>
                      )}
                      <div className="flex items-center gap-0.5">
                        {renderStars(doc.ratings?.average || 0)}
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">
                      {doc.name}
                    </h3>
                    <p className="text-primary text-sm font-medium mb-4">{doc.speciality}</p>

                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-slate-500 text-xs">
                        <Briefcase size={14} className="shrink-0" />
                        <span>{doc.experience?.[0]?.hospital || "Senior Consultant"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 text-xs">
                        <MapPin size={14} className="shrink-0" />
                        <span className="truncate">{doc.address?.line1 || "Not Provided"}</span>
                      </div>
                    </div>

                    <button className="mt-auto w-full bg-primary text-white py-2.5 rounded-xl text-sm font-bold group-hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                      Book Appointment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}