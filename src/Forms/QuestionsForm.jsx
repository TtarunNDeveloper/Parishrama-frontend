import React, { useState, useEffect } from "react";
import axios from "axios";

export default function QuestionsForm() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState("");
  const [newChapter, setNewChapter] = useState("");
  const [subtopics, setSubtopics] = useState([]);
  const [selectedSubtopic, setSelectedSubtopic] = useState("");
  const [newSubtopic, setNewSubtopic] = useState("");
  const [questionType, setQuestionType] = useState("MCQ");
  const [question, setQuestion] = useState("");
  const [questionImage, setQuestionImage] = useState(null);
  const [options, setOptions] = useState([{ text: "", image: null }, { text: "", image: null }, { text: "", image: null }, { text: "", image: null }]);
  const [solution, setSolution] = useState("");
  const [solutionImage, setSolutionImage] = useState(null);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/questions")
      .then((response) => {
        setSubjects(response.data);
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
      });
  }, []);

  const handleSubjectChange = (e) => {
    const selected = e.target.value;
    setSelectedSubject(selected);
    setNewSubject("");
    const subject = subjects.find((s) => s.name === selected);
    setChapters(subject ? subject.chapters : []);
    setSelectedChapter("");
    setSubtopics([]);
    setSelectedSubtopic("");
  };

  const handleChapterChange = (e) => {
    const selected = e.target.value;
    setSelectedChapter(selected);
    setNewChapter("");
    const chapter = chapters.find((c) => c.name === selected);
    setSubtopics(chapter ? chapter.subtopics : []);
    setSelectedSubtopic("");
  };

  const handleSubtopicChange = (e) => {
    setSelectedSubtopic(e.target.value);
    setNewSubtopic("");
  };

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...options];
    newOptions[index][field] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('subject', selectedSubject);
    formData.append('chapter', selectedChapter);
    formData.append('subtopic', selectedSubtopic);
    formData.append('questionData', JSON.stringify({
      type: questionType,
      question: { text: question },
      options,
      solution: { text: solution }
    }));

    if (questionImage) {
      formData.append('questionImage', questionImage);
    }
    if (solutionImage) {
      formData.append('solutionImage', solutionImage);
    }

    options.forEach((option, index) => {
      if (option.image) {
        formData.append(`optionImages`, option.image);
      }
    });

    axios.post("http://localhost:5000/api/questions", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then((response) => {
      setMessage("Question and Solution added successfully!");
      setErrorMessage("");
      setQuestion("");
      setQuestionImage(null);
      setOptions([{ text: "", image: null }, { text: "", image: null }, { text: "", image: null }, { text: "", image: null }]);
      setSolution("");
      setSolutionImage(null);
    })
    .catch((err) => {
      setErrorMessage("Error adding question. Please try again.");
      setMessage("");
      console.error("Error adding question:", err);
    });
  };

  const handleAddNewSubject = (e) => {
    if (e.key === "Enter" && newSubject) {
      if (!subjects.find((subject) => subject.name === newSubject)) {
        const newSubjects = [...subjects, { name: newSubject, chapters: [] }];
        setSubjects(newSubjects);
        setSelectedSubject(newSubject);
        setNewSubject("");
      }
    }
  };

  const handleAddNewChapter = (e) => {
    if (e.key === "Enter" && newChapter) {
      const subjectIndex = subjects.findIndex((subject) => subject.name === selectedSubject);
      if (subjectIndex !== -1) {
        const updatedSubjects = [...subjects];
        if (!updatedSubjects[subjectIndex].chapters.find((chapter) => chapter.name === newChapter)) {
          updatedSubjects[subjectIndex].chapters.push({ name: newChapter, subtopics: [] });
          setSubjects(updatedSubjects);
          setChapters(updatedSubjects[subjectIndex].chapters);
          setSelectedChapter(newChapter);
          setNewChapter("");
        }
      }
    }
  };

  const handleAddNewSubtopic = (e) => {
    if (e.key === "Enter" && newSubtopic) {
      const subjectIndex = subjects.findIndex((subject) => subject.name === selectedSubject);
      const chapterIndex = chapters.findIndex((chapter) => chapter.name === selectedChapter);
      if (subjectIndex !== -1 && chapterIndex !== -1) {
        const updatedSubjects = [...subjects];
        if (!updatedSubjects[subjectIndex].chapters[chapterIndex].subtopics.find((subtopic) => subtopic.name === newSubtopic)) {
          updatedSubjects[subjectIndex].chapters[chapterIndex].subtopics.push({ name: newSubtopic });
          setSubjects(updatedSubjects);
          setSubtopics(updatedSubjects[subjectIndex].chapters[chapterIndex].subtopics);
          setSelectedSubtopic(newSubtopic);
          setNewSubtopic("");
        }
      }
    }
  };

  const handleFileChange = (e, index, field) => {
    const file = e.target.files[0];
    if (index !== undefined) {
      handleOptionChange(index, field, file);
    } else if (field === "solutionImage") {
      setSolutionImage(file);
    } else {
      setQuestionImage(file);
    }
  };

  const handleFileCancel = (index, field) => {
    if (index !== undefined) {
      const newOptions = [...options];
      newOptions[index][field] = null;
      setOptions(newOptions);
    } else if (field === "solutionImage") {
      setSolutionImage(null);
    } else {
      setQuestionImage(null);
    }
  };

  return (
    <form className="mt-4 max-w-7xl mx-auto" onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium">Subject *</label>
        <input
          type="text"
          value={newSubject}
          onChange={(e) => setNewSubject(e.target.value)}
          onKeyPress={handleAddNewSubject}
          placeholder="Type or select a subject"
          className="w-full border p-2 rounded-md mt-1"
          list="subjects"
        />
        <datalist id="subjects">
          {subjects.map((subject) => (
            <option key={subject.name} value={subject.name}>
              {subject.name}
            </option>
          ))}
        </datalist>
        <select value={selectedSubject} onChange={handleSubjectChange} className="w-full border p-2 rounded-md mt-1">
          <option value="">Select Subject</option>
          {subjects.map((subject) => (
            <option key={subject.name} value={subject.name}>
              {subject.name}
            </option>
          ))}
        </select>
      </div>

      {selectedSubject && (
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Chapter *</label>
          <input
            type="text"
            value={newChapter}
            onChange={(e) => setNewChapter(e.target.value)}
            onKeyPress={handleAddNewChapter}
            placeholder="Type or select a chapter"
            className="w-full border p-2 rounded-md mt-1"
            list="chapters"
          />
          <datalist id="chapters">
            {chapters.map((chapter) => (
              <option key={chapter.name} value={chapter.name}>
                {chapter.name}
              </option>
            ))}
          </datalist>
          <select value={selectedChapter} onChange={handleChapterChange} className="w-full border p-2 rounded-md mt-1">
            <option value="">Select Chapter</option>
            {chapters.map((chapter) => (
              <option key={chapter.name} value={chapter.name}>
                {chapter.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedChapter && (
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Subtopic *</label>
          <input
            type="text"
            value={newSubtopic}
            onChange={(e) => setNewSubtopic(e.target.value)}
            onKeyPress={handleAddNewSubtopic}
            placeholder="Type or select a subtopic"
            className="w-full border p-2 rounded-md mt-1"
            list="subtopics"
          />
          <datalist id="subtopics">
            {subtopics.map((subtopic) => (
              <option key={subtopic.name} value={subtopic.name}>
                {subtopic.name}
              </option>
            ))}
          </datalist>
          <select value={selectedSubtopic} onChange={handleSubtopicChange} className="w-full border p-2 rounded-md mt-1">
            <option value="">Select Subtopic</option>
            {subtopics.map((subtopic) => (
              <option key={subtopic.name} value={subtopic.name}>
                {subtopic.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedSubtopic && (
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Question Type *</label>
          <select value={questionType} onChange={(e) => setQuestionType(e.target.value)} className="w-full border p-2 rounded-md mt-1">
            <option value="MCQ">MCQ</option>
            <option value="Fill in the Blanks">Fill in the Blanks</option>
            <option value="Match the following">Match the following</option>
          </select>
        </div>
      )}

      {selectedSubtopic && questionType === "MCQ" && (
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1">
            <div className="mb-4">
              <label className="block text-gray-700 font-medium">Question *</label>
              <textarea value={question} onChange={(e) => setQuestion(e.target.value)} className="w-full border p-2 rounded-md mt-1" />
              {questionImage && (
                <div className="mt-2 flex items-center">
                  <span className="mr-2">{questionImage.name}</span>
                  <button type="button" onClick={() => handleFileCancel()} className="text-red-600">
                    Cancel
                  </button>
                </div>
              )}
              <input type="file" onChange={(e) => handleFileChange(e)} className="mt-2" />
            </div>
          </div>

          <div className="col-span-1">
            {options.map((option, index) => (
              <div key={index} className="mb-4">
                <label className="block text-gray-700 font-medium">{`Option ${String.fromCharCode(65 + index)}`}</label>
                <textarea
                  value={option.text}
                  onChange={(e) => handleOptionChange(index, "text", e.target.value)}
                  className="w-full border p-2 rounded-md mt-1"
                />
                {option.image && (
                  <div className="mt-2 flex items-center">
                    <span className="mr-2">{option.image.name}</span>
                    <button type="button" onClick={() => handleFileCancel(index, "image")} className="text-red-600">
                      Cancel
                    </button>
                  </div>
                )}
                <input type="file" onChange={(e) => handleFileChange(e, index, "image")} className="mt-2" />
              </div>
            ))}
          </div>

          <div className="col-span-1">
            <div className="mb-4">
              <label className="block text-gray-700 font-medium">Solution</label>
              <textarea value={solution} onChange={(e) => setSolution(e.target.value)} className="w-full border p-2 rounded-md mt-1" />
              {solutionImage && (
                <div className="mt-2 flex items-center">
                  <span className="mr-2">{solutionImage.name}</span>
                  <button type="button" onClick={() => handleFileCancel(undefined, "solutionImage")} className="text-red-600">
                    Cancel
                  </button>
                </div>
              )}
              <input type="file" onChange={(e) => handleFileChange(e, undefined, "solutionImage")} className="mt-2" />
            </div>
          </div>
        </div>
      )}

      {selectedSubtopic && questionType === "Fill in the Blanks" && (
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-1">
            <div className="mb-4">
              <label className="block text-gray-700 font-medium">Question *</label>
              <textarea value={question} onChange={(e) => setQuestion(e.target.value)} className="w-full border p-2 rounded-md mt-1" />
              {questionImage && (
                <div className="mt-2 flex items-center">
                  <span className="mr-2">{questionImage.name}</span>
                  <button type="button" onClick={() => handleFileCancel()} className="text-red-600">
                    Cancel
                  </button>
                </div>
              )}
              <input type="file" onChange={(e) => handleFileChange(e)} className="mt-2" />
            </div>
          </div>

          <div className="col-span-1">
            <div className="mb-4">
              <label className="block text-gray-700 font-medium">Solution</label>
              <textarea value={solution} onChange={(e) => setSolution(e.target.value)} className="w-full border p-2 rounded-md mt-1" />
              {solutionImage && (
                <div className="mt-2 flex items-center">
                  <span className="mr-2">{solutionImage.name}</span>
                  <button type="button" onClick={() => handleFileCancel(undefined, "solutionImage")} className="text-red-600">
                    Cancel
                  </button>
                </div>
              )}
              <input type="file" onChange={(e) => handleFileChange(e, undefined, "solutionImage")} className="mt-2" />
            </div>
          </div>
        </div>
      )}

      {selectedSubtopic && questionType === "Match the following" && (
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-1">
            <div className="mb-4">
              <label className="block text-gray-700 font-medium">Question *</label>
              <textarea value={question} onChange={(e) => setQuestion(e.target.value)} className="w-full border p-2 rounded-md mt-1" />
              {questionImage && (
                <div className="mt-2 flex items-center">
                  <span className="mr-2">{questionImage.name}</span>
                  <button type="button" onClick={() => handleFileCancel()} className="text-red-600">
                    Cancel
                  </button>
                </div>
              )}
              <input type="file" onChange={(e) => handleFileChange(e)} className="mt-2" />
            </div>
          </div>

          <div className="col-span-1">
            <div className="mb-4">
              <label className="block text-gray-700 font-medium">Solution</label>
              <textarea value={solution} onChange={(e) => setSolution(e.target.value)} className="w-full border p-2 rounded-md mt-1" />
              {solutionImage && (
                <div className="mt-2 flex items-center">
                  <span className="mr-2">{solutionImage.name}</span>
                  <button type="button" onClick={() => handleFileCancel(undefined, "solutionImage")} className="text-red-600">
                    Cancel
                  </button>
                </div>
              )}
              <input type="file" onChange={(e) => handleFileChange(e, undefined, "solutionImage")} className="mt-2" />
            </div>
          </div>
        </div>
      )}

      <button className="mt-6 bg-cyan-600 text-white py-2 px-6 rounded-lg w-full hover:bg-cyan-700 transition">
        Add Question and Solution
      </button>

      {message && <div className="mt-4 p-2 bg-green-100 border border-green-400 text-green-700 rounded">{message}</div>}
      {errorMessage && <div className="mt-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">{errorMessage}</div>}
    </form>
  );
}