import React, { useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "react-feather";

const SolutionForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    stream: "LongTerm",
    questionType: "MCQ",
    testName: "",
    date: format(new Date(), "yyyy-MM-dd"),
    questionCount: 1,
    solutions: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e) => {
    setFormData(prev => ({ ...prev, date: e.target.value }));
  };

  const handleQuestionCountChange = (e) => {
    const count = parseInt(e.target.value) || 1;
    setFormData(prev => {
      const solutions = Array(count).fill().map((_, i) => {
        const questionNumber = i + 1;
        return prev.solutions[i] ? 
          { ...prev.solutions[i], questionNumber } : 
          { 
            questionNumber, 
            correctOption: "", 
            correctSolution: "" 
          };
      }).slice(0, count);
      return { ...prev, questionCount: count, solutions };
    });
};

  const handleSolutionChange = (index, field, value) => {
    setFormData(prev => {
      const updatedSolutions = [...prev.solutions];
      updatedSolutions[index] = { ...updatedSolutions[index], [field]: value };
      return { ...prev, solutions: updatedSolutions };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Ensure all solutions have question numbers
      const validatedSolutions = formData.solutions.map((sol, index) => ({
        questionNumber: sol.questionNumber || index + 1, // fallback to index
        correctOption: formData.questionType === "MCQ" ? sol.correctOption : undefined,
        correctSolution: sol.correctSolution
      }));

      const payload = {
        stream: formData.stream,
        questionType: formData.questionType,
        testName: formData.testName,
        date: formData.date,
        solutionBank: validatedSolutions
      };

      const response = await axios.post(`${process.env.REACT_APP_URL}/api/createsolution`, payload);
      onSuccess(response.data);
      setFormData({
        stream: "LongTerm",
        questionType: "MCQ",
        testName: "",
        date: format(new Date(), "yyyy-MM-dd"),
        questionCount: 1,
        solutions: []
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create solution");
    } finally {
      setLoading(false);
    }
};

  return (
    <div className="p-4 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      <div className="bg-gradient-to-b from-red-600 via-orange-500 to-yellow-400 text-white py-6 px-8 flex flex-col mb-2">
        <h1 className="text-3xl font-bold">Add Solutions</h1>
      </div>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Stream Selection */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Stream</label>
            <select
              name="stream"
              value={formData.stream}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="LongTerm">Long Term</option>
              <option value="PUC">PUC</option>
            </select>
          </div>

          {/* Question Type Dropdown */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Question Type</label>
            <select
              name="questionType"
              value={formData.questionType}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="MCQ">MCQ</option>
              <option value="FillInTheBlanks">Fill in the Blanks</option>
              <option value="TrueFalse">True/False</option>
            </select>
          </div>

          {/* Test Name Input */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Test Name</label>
            <input
              type="text"
              name="testName"
              value={formData.testName}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Date Picker */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <div className="relative">
              <input
                type="date"
                value={formData.date}
                onChange={handleDateChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Solutions Input Section */}
        <div className="border border-gray-200 rounded-lg p-4 mt-4">
          <div className="pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter the Questions Range from 1 to:
            </label>
            <input
              type="number"
              min="1"
              value={formData.questionCount}
              onChange={handleQuestionCountChange}
              className="mb-2 block w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Solutions: </h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {Array.from({ length: formData.questionCount }).map((_, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                <h4 className="font-medium text-gray-800 mb-3">Question {index + 1}</h4>
                {formData.questionType === "MCQ" && (
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Correct Option
                    </label>
                    <div className="flex space-x-4">
                      {['A', 'B', 'C', 'D'].map(opt => (
                        <div key={opt} className="flex items-center">
                          <input
                            type="radio"
                            id={`q${index}-opt${opt}`}
                            name={`question-${index}-option`}
                            value={opt}
                            checked={formData.solutions[index]?.correctOption === opt}
                            onChange={() => handleSolutionChange(index, 'correctOption', opt)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            required={formData.questionType === "MCQ"}
                          />
                          <label 
                            htmlFor={`q${index}-opt${opt}`}
                            className="ml-2 block text-sm font-medium text-gray-700"
                          >
                            {opt}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correct Solution
                  </label>
                  <textarea
                    value={formData.solutions[index]?.correctSolution || ""}
                    onChange={(e) => handleSolutionChange(index, 'correctSolution', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    required
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}
          >
            {loading ? "Processing..." : "Submit Solutions"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SolutionForm;