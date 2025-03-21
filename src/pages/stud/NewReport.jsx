import React, { useState } from "react";

export default function NewReport({ onClose }) {
  const [formData, setFormData] = useState({
    rollNo: "",
    studentName: "",
    section: "",
    testName: "",
    date: "",
    marks: {
      Botany: "",
      Chemistry: "",
      Physics: "",
      Zoology: "",
    },
  });

  const [totalMarks, setTotalMarks] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMarksChange = (subject, value) => {
    const marks = { ...formData.marks, [subject]: value };
    setFormData((prev) => ({
      ...prev,
      marks,
    }));

    // Calculate total marks
    const total = Object.values(marks).reduce((sum, mark) => sum + (parseInt(mark) || 0), 0);
    setTotalMarks(total);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rollNo: formData.rollNo,
          studentName: formData.studentName,
          testName: formData.testName,
          date: formData.date,
          marks: formData.marks,
        }),
      });

      if (response.ok) {
        alert("Report created successfully!");
        onClose();
      } else {
        alert("Failed to create report.");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4">New Report</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Roll Number</label>
              <input
                type="text"
                name="rollNo"
                value={formData.rollNo}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-100 focus:ring-indigo-100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Student Name</label>
              <input
                type="text"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-100 focus:ring-indigo-100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Section</label>
              <input
                type="text"
                name="section"
                value={formData.section}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-100 focus:ring-indigo-100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Test Name</label>
              <input
                type="text"
                name="testName"
                value={formData.testName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-100 focus:ring-indigo-100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-100 focus:ring-indigo-100"
                required
              />
            </div>
          </div>

          {/* Marks Table */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Marks Obtained</h3>
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Subject</th>
                  <th className="py-2 px-4 border-b">Marks Obtained</th>
                  <th className="py-2 px-4 border-b">Total Marks</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(formData.marks).map(([subject, marks]) => (
                  <tr key={subject}>
                    <td className="py-2 px-4 border-b">{subject}</td>
                    <td className="py-2 px-4 border-b">
                      <input
                        type="number"
                        value={marks}
                        onChange={(e) => handleMarksChange(subject, e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-100 focus:ring-indigo-100"
                        min="0"
                        max="180"
                        required
                      />
                    </td>
                    <td className="py-2 px-4 border-b">180</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total Marks Obtained */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Total Marks Obtained</label>
            <input
              type="text"
              value={`${totalMarks} out of 720`}
              readOnly
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-100 focus:ring-indigo-100"
            />
          </div>

          {/* Buttons */}
          <div className="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-gradient-to-b from-red-600 via-orange-500 to-yellow-400 text-white px-4 py-2 rounded-md hover:shadow-lg"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}