import React, { useState, useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import Navigation from "./Navigation";
import Dashboard from "./Dashboard";

function ParishramaHomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (!role) {
      navigate("/");
      return;
    }
    setUserRole(role);
  }, [navigate]);


  const activeTab = location.pathname === "/home" ? "dashboard" : location.pathname.split('/').pop();

  if (!userRole) return null;

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-red-600 via-orange-500 to-yellow-400">
      {/* Navigation Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${
        isNavOpen ? "translate-x-0" : "-translate-x-full"
      } w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out z-50`}>
        <Navigation 
          userRole={userRole} 
          activeTab={activeTab}
        />
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ${
        isNavOpen ? "ml-64" : "ml-0"
      }`}>
        {/* Top Navigation Bar */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setIsNavOpen(!isNavOpen)}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("userRole");
                  navigate("/");
                }}
                className="text-red-500 hover:text-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-6">
          {activeTab === "dashboard" ? (
            <Dashboard userRole={userRole} />
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
}

export default ParishramaHomePage;