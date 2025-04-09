import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from '../assets/logo.png';

const getNavigationItems = (role) => {
  const commonItems = [
    { name: "Dashboard", path: "/home", show: true },
    { name: "Students", path: "students", show: true },
    { name: "Classes", path: "classes", show: true },
    { name: "Questions", path: "questions", show: true },
    { name: "Attendance", path: "attendance", show: true },
    { name: "Noticeboard", path: "noticeboard", show: true },
    { name: "Feedback", path: "feedback", show: true },
    { name: "Leaderboard", path: "leaderboard", show: true }
  ];

  const adminItems = [
    { name: "Batches", path: "batches", show: ["super_admin", "admin", "IT"].includes(role) },
    { name: "Tests", path: "tests", show: ["super_admin", "admin", "IT"].includes(role) },
    { name: "Reports", path: "reports", show: ["super_admin", "admin", "IT"].includes(role) },
    { name: "Solutions", path: "marks", show: ["super_admin", "admin", "IT"].includes(role) },
    { name: "SMS", path: "sms", show: ["super_admin", "admin", "IT"].includes(role) },
    { name: "Hospital", path: "hospital", show: ["super_admin", "admin", "IT"].includes(role) },
    { name: "Hostel", path: "hostel", show: ["super_admin", "admin", "IT"].includes(role) },
    { name: "Gate Pass", path: "gatepass", show: ["super_admin", "admin", "IT"].includes(role) },
    { name: "Admission", path: "admission", show: ["super_admin", "admin", "IT"].includes(role) },
    { name: "Settings", path: "settings", show: ["super_admin", "admin", "IT"].includes(role) },
    { name: "Staffs", path: "staffs", show: ["super_admin", "admin", "IT"].includes(role) }
  ];

  // Combine and sort alphabetically
  return [...commonItems, ...adminItems]
    .filter(item => item.show === true || item.show)
    .sort((a, b) => a.name.localeCompare(b.name));
};

export default function Navigation({ userRole, activeTab, setActiveTab }) {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    setTimeout(() => {
      navigate(path);
    }, 0);
  };

  return (
    <div className="w-full h-screen bg-white text-gray-700 p-5 flex flex-col">
      <img src={logo} alt="" className="mx-auto mb-4" />
      <ul className="space-y-2 overflow-y-auto flex-1">
        {getNavigationItems(userRole).map((item) => (
          <li key={item.name}>
            <NavLink
              to={item.path}
              end
              className={({ isActive }) =>
                `block px-4 py-2 rounded-md transition-all duration-300 ${
                  isActive 
                    ? "bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 text-white shadow-lg"
                    : "hover:bg-gradient-to-r hover:from-red-500/20 hover:via-orange-500/20 hover:to-yellow-400/20 hover:text-gray-900"
                }`
              }
              onClick={(e) => {
                e.preventDefault();
                handleNavigation(item.path);
              }}
            >
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}