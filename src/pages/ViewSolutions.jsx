import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ViewSolutions() {
  const [filters, setFilters] = useState({
    stream: "LongTerm",
    questionType: "",
    testName: "",
    date: ""
  });
  const [testNames, setTestNames] = useState([]);
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch test names when stream changes
  useEffect(() => {
    const fetchTestNames = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_URL}/api/getsolutionbank?stream=${filters.stream}`
        );
        const uniqueTestNames = [...new Set(response.data.data.map(item => item.solutionRef.testName))];
        setTestNames(uniqueTestNames);
      } catch (err) {
        setError("Failed to fetch test names");
      }
    };
    fetchTestNames();
  }, [filters.stream]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await axios.get(`${process.env.REACT_APP_URL}/api/getsolutionbank?${params.toString()}`);
      const sortedSolutions = response.data.data.sort((a, b) => a.questionNumber - b.questionNumber);
      setSolutions(sortedSolutions);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch solutions");
      setSolutions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gradient-to-b from-red-600 via-orange-500 to-yellow-400 text-white py-6 px-8 flex flex-col">
        <h1 className="text-3xl font-bold">View Solutions</h1>
      </div>

      <div className="max-w-4xl bg-white shadow-md rounded-lg mx-auto mt-6 p-6">
        <form onSubmit={handleSearch} className="space-y-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Stream Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Stream</label>
              <select
                name="stream"
                value={filters.stream}
                onChange={handleFilterChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="LongTerm">Long Term</option>
                <option value="PUC">PUC</option>
              </select>
            </div>

            {/* Question Type Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Question Type</label>
              <select
                name="questionType"
                value={filters.questionType}
                onChange={handleFilterChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Types</option>
                <option value="MCQ">MCQ</option>
                <option value="FillInTheBlanks">Fill in the Blanks</option>
                <option value="TrueFalse">True/False</option>
              </select>
            </div>

            {/* Test Name Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Test Name</label>
              <select
                name="testName"
                value={filters.testName}
                onChange={handleFilterChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Tests</option>
                {testNames.map((name, index) => (
                  <option key={index} value={name}>{name}</option>
                ))}
              </select>
            </div>

            {/* Date Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-50' : ''}`}
            >
              {loading ? 'Searching...' : 'Search Solutions'}
            </button>
          </div>
        </form>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md border border-red-200">
            {error}
          </div>
        )}

        {solutions.length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Solutions Found: {solutions.length}</h2>
            <div className="space-y-4">
              {solutions.map((solution, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Question {solution.questionNumber}</h3>
                      <p className="text-sm text-gray-500">
                        Stream: {solution.solutionRef.stream}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {solution.solutionRef.testName} - {new Date(solution.solutionRef.date).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {solution.solutionRef.questionType === "MCQ" && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-700">Correct Option:</p>
                      <div className="flex space-x-4 mt-1">
                        {['A', 'B', 'C', 'D'].map(opt => (
                          <span 
                            key={opt}
                            className={`px-3 py-1 rounded ${solution.correctOption === opt ? 'bg-green-100 text-green-800 border border-green-200' : 'text-gray-700'}`}
                          >
                            {opt}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700">Correct Solution:</p>
                    <p className="mt-1 p-2 bg-gray-50 rounded">{solution.correctSolution}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          !loading && <p className="text-center text-gray-500">No solutions found. Apply filters to search.</p>
        )}
      </div>
    </div>
  );
}