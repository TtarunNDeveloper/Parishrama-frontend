import React from "react";
import { useNavigate } from "react-router-dom";
import underconstr from '../../assets/workinprogress.gif'

export default function Admissions() {
  const navigate = useNavigate();

  // Admission categories
  const admissionSections = [
    { id: 1, name: "Registrations", icon: "📝", path: "/admissions/registrations", image:underconstr },
    { id: 2, name: "Enquiry", icon: "❓", path: "/admissions/enquiry", image:underconstr },
    { id: 3, name: "Leads", icon: "📊", path: "/admissions/leads", image:underconstr },
    { id: 4, name: "Counselling", icon: "💬", path: "/admissions/counselling", image:underconstr },
    { id: 5, name: "Applications", icon: "📄", path: "/admissions/applications", image:underconstr },
    { id: 6, name: "Admitted", icon: "🎓", path: "/admissions/admitted", image:underconstr },
    { id: 7, name: "Settings", icon: "⚙️", path: "/admissions/settings", image:underconstr },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Section with Gradient */}
      <div className="bg-gradient-to-b from-red-600 via-orange-500 to-yellow-400 text-white py-6 px-8 flex flex-col">
        <button
          onClick={() => navigate('/home')}
          className="text-white text-sm flex items-center mb-2"
        >
          ◀ Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold">Admissions</h1>
      </div>

      {/* Admission Sections */}
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-700">Manage Admissions</h2>
        <p className="text-gray-500 mb-4">Choose a category to manage admissions.</p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {admissionSections.map((section) => (
            <div
            key={section.id}
            className="group relative bg-white shadow-md rounded-lg p-6 flex flex-col items-center cursor-pointer overflow-hidden h-40"
            onClick={() => navigate(section.path)}
          >
            {/* Always visible content */}
            <div className="z-10 flex flex-col items-center transition-all duration-300 group-hover:scale-110 group-hover:text-white">
              <span className="text-4xl">{section.icon}</span>
              <p className="text-lg font-medium mt-2">{section.name}</p>
            </div>
            
            {/* Image background that appears on hover */}
            <div className="absolute inset-0 transition-all duration-500 opacity-0 group-hover:opacity-100">
              <img 
                src={section.image}
                alt={section.name}
                className="w-full h-full object-cover rounded-lg"
              />
              {/* Color overlay to maintain readability */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/60 via-orange-500/60 to-yellow-400/60 rounded-lg"></div>
            </div>
          </div>
          ))}
        </div>
      </div>
    </div>
  );
}
