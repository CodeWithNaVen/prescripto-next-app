"use client";
import React, { useState } from "react";

// Common symptoms from the Training.csv to test with
const commonSymptoms = [
  "itching", "skin_rash", "nodal_skin_eruptions", "continuous_sneezing", 
  "shivering", "chills", "joint_pain", "stomach_pain", "acidity", 
  "ulcers_on_tongue", "muscle_wasting", "vomiting", "burning_micturition", 
  "spotting_urination", "fatigue", "weight_gain", "anxiety", 
  "cold_hands_and_feets", "mood_swings", "weight_loss", "restlessness", 
  "lethargy", "patches_in_throat", "irregular_sugar_level", "cough", 
  "high_fever", "sunken_eyes", "breathlessness", "sweating", "dehydration"
];

export default function RecommendationPage() {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const toggleSymptom = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const getRecommendations = async () => {
    if (selectedSymptoms.length === 0) return alert("Please select symptoms");
    
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: selectedSymptoms }),
      });

      const data = await response.json();
      if (data.success) {
        setResult(data);
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to fetch recommendations. Is the Python server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-800 mb-2">Doctor AI Assistant</h1>
      <p className="text-gray-600 mb-6">Select your symptoms to find the best specialist.</p>

      {/* Symptom Selection Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        {commonSymptoms.map((symptom) => (
          <button
            key={symptom}
            onClick={() => toggleSymptom(symptom)}
            className={`p-2 text-sm rounded-lg border transition-all ${
              selectedSymptoms.includes(symptom)
                ? "bg-blue-600 text-white border-blue-600 shadow-md"
                : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
            }`}
          >
            {symptom.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      <button
        onClick={getRecommendations}
        disabled={loading}
        className="w-full bg-green-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? "Analyzing Symptoms..." : "Find Recommended Doctors"}
      </button>

      {/* Results Section */}
      {result && (
        <div className="mt-10">
          <div className="bg-blue-100 p-4 rounded-lg mb-6 border-l-4 border-blue-500">
            <h2 className="text-xl font-semibold text-blue-900">
              Analysis: {result.disease}
            </h2>
            <p className="text-blue-800">
              We recommend seeing a: <strong>{result.specialty}</strong>
            </p>
          </div>

          <h3 className="text-2xl font-bold mb-4">Top Rated Doctors for You</h3>
          <div className="grid gap-4">
            {result.recommendations.length > 0 ? (
              result.recommendations.map((doc) => (
                <div key={doc._id} className="bg-white p-4 rounded-xl shadow-sm border flex items-center gap-4">
                  <img src={doc.doctorPic} alt={doc.name} className="w-20 h-20 rounded-full object-cover border" />
                  <div className="flex-1">
                    <h4 className="text-lg font-bold">{doc.name}</h4>
                    <p className="text-gray-600 text-sm">{doc.degree} • {doc.experience.length} Years Exp.</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs font-bold">
                        ★ {doc.ratings?.average || 0}
                      </span>
                      <span className="text-xs text-gray-400">({doc.ratings?.count || 0} reviews)</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-600 font-bold">${doc.fees}</p>
                    <button className="mt-2 bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm">Book</button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No doctors currently available for this specialty in our database.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}