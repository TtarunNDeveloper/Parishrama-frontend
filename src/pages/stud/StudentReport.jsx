import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReportCard from "../../download/ReportCard"; // Import ReportCard

export default function StudentReport() {
  const { rollNo } = useParams();
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(null);
  const [monthlyReports, setMonthlyReports] = useState([]); // State for monthly reports
  const [totalTestsAttended, setTotalTestsAttended] = useState(0); // State for total tests attended
  const [totalMarks, setTotalMarks] = useState(0); // State for total marks
  const [averageMarks, setAverageMarks] = useState(0); // State for average marks

  useEffect(() => {
    // Fetch student report data from the backend API
    const fetchStudentReport = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/student-report/${rollNo}`);
        if (response.ok) {
          const data = await response.json();
          setStudentData(data);

          // Process the data to group by month
          const { monthlyData, totalTests, totalMarks, averageMarks } = processMonthlyReports(data.tests);
          setMonthlyReports(monthlyData);
          setTotalTestsAttended(totalTests); // Set total tests attended
          setTotalMarks(totalMarks); // Set total marks
          setAverageMarks(averageMarks); // Set average marks
        } else {
          console.error("Failed to fetch student report");
        }
      } catch (err) {
        console.error("Error fetching student report:", err);
      }
    };

    fetchStudentReport();
  }, [rollNo]);

  const processMonthlyReports = (tests) => {
    const monthlyReports = {};
    let totalTests = 0; 
    let totalMarks = 0; 
    let totalPossibleMarks = 0; 

    Object.entries(tests).forEach(([testType, testEntries]) => {
      testEntries.forEach((test) => {
        const dateParts = test.date.split("-"); // Split date into [YYYY, MM, DD]
        const month = dateParts[1]; // Extract month (e.g., "04" for April)
        const monthName = getMonthName(month); // Convert month number to name (e.g., "April")

        if (!monthlyReports[monthName]) {
          monthlyReports[monthName] = {
            totalTests: 0,
            absentTests: 0,
            totalMarks: 0,
            totalPossibleMarks: 0,
          };
        }

        monthlyReports[monthName].totalTests += 1;
        monthlyReports[monthName].totalMarks +=
          test.subjects.Botany +
          test.subjects.Chemistry +
          test.subjects.Physics +
          test.subjects.Zoology;
        monthlyReports[monthName].totalPossibleMarks += 720; // 180 marks per subject * 4 subjects

        totalTests += 1;
        totalMarks +=
          test.subjects.Botany +
          test.subjects.Chemistry +
          test.subjects.Physics +
          test.subjects.Zoology;
        totalPossibleMarks += 720;
      });
    });

    // Convert the monthlyReports object into an array
    const monthlyData = Object.entries(monthlyReports).map(([month, data]) => ({
      month,
      totalTests: data.totalTests,
      absentTests: data.absentTests,
      accuracy: ((data.totalMarks / data.totalPossibleMarks) * 100).toFixed(2),
      percentage: ((data.totalMarks / data.totalPossibleMarks) * 100).toFixed(2),
    }));

    // Calculate average marks
    const averageMarks = totalMarks / totalTests;

    return { monthlyData, totalTests, totalMarks, averageMarks };
  };

  // Function to convert month number to month name
  const getMonthName = (month) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[parseInt(month) - 1]; // Subtract 1 because months are 0-indexed
  };

  if (!studentData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar with Student Info */}
      <div className="bg-gradient-to-b from-red-600 via-orange-500 to-yellow-400 text-white py-6 px-8 flex flex-col">
        <button onClick={() => navigate(-1)} className="text-white text-sm flex items-center mb-2">
          ◀ Back to Reports
        </button>
        <h1 className="text-2xl font-bold">{studentData.studentName}</h1>
        <p className="text-xl">Reg No: {studentData.rollNo}</p>
        <p className="text-xl">Tests Attended: {totalTestsAttended}</p>
      </div>

      {/* Download Report Button */}
      <div className="max-w-4xl mx-auto mt-6 px-4 flex justify-end">
        <button
          onClick={() => ReportCard.generatePDF({ ...studentData, totalTestsAttended, totalMarks, averageMarks })}
          className="bg-gradient-to-b from-red-600 via-orange-500 to-yellow-400 text-white py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          Download Report
        </button>
      </div>

      {/* Monthly Reports */}
      <div className="max-w-4xl mx-auto mt-6 p-4">
        <h2 className="text-xl font-bold mb-4">Monthly Test Reports</h2>
        <div className="space-y-4">
          {monthlyReports.map((report, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg p-4">
              <h3 className="text-lg font-semibold">{report.month}</h3>
              <div className="flex justify-between items-center mt-2">
                <div>
                  <p className="text-gray-600">{report.totalTests} total tests</p>
                  <p className="text-gray-600">{report.absentTests} absent tests</p>
                  <p className="text-gray-600">{report.accuracy}% accuracy</p>
                </div>
                <div className="text-2xl font-bold">{report.percentage}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}