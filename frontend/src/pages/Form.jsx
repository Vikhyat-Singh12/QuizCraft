import React, { useState } from "react";
import toast from "react-hot-toast";
import CategoriseUI from "../components/CategoriseUI";
import ClozeUI from "../components/ClozeUI";
import ComprehensionUI from "../components/ComprehensionUI";
import useFormStore from "../store/useFormStore.js";
import { useNavigate } from "react-router-dom";
import { 
  Plus, 
  Send, 
  FileText, 
  Hash,
  Upload,
  Sparkles,
  Type,
  AlignLeft,
  Trash2,
  Save,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit
} from "lucide-react";

export default function CreateForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState("edit"); 

  const { createForm } = useFormStore();
  const navigate = useNavigate();

  const addQuestion = () => {
    const newQuestion = { type: "categorise", question: "", marks: 1 };
    const newQuestions = [...questions, newQuestion];
    setQuestions(newQuestions);
    setCurrentQuestionIndex(newQuestions.length - 1);
    setViewMode("edit");
  };

  const removeQuestion = (index) => {
    if (questions.length <= 1) {
      setQuestions([]);
      setCurrentQuestionIndex(0);
      return;
    }
    
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
    
    if (currentQuestionIndex >= newQuestions.length) {
      setCurrentQuestionIndex(newQuestions.length - 1);
    } else if (currentQuestionIndex > index) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleFileChange = (index, file) => {
    const newQuestions = [...questions];
    newQuestions[index].imageFile = file;
    setQuestions(newQuestions);
  };

  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
    setViewMode("edit");
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const submitForm = async () => {
    if (!title.trim()) {
      toast.error("Please enter a form title");
      return;
    }
    
    if (questions.length === 0) {
      toast.error("Please add at least one question");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);

      const cleanQuestions = questions.map(q => {
        const { imageFile, ...rest } = q;
        return { ...rest };
      });

      formData.append("questions", JSON.stringify(cleanQuestions));

      questions.forEach((q, i) => {
        if (q.imageFile instanceof File) {
          formData.append(`image_${i}`, q.imageFile);
        }
      });

      await createForm(formData);
      toast.success("Form created successfully!");
      
      // Reset form
      setTitle("");
      setDescription("");
      setQuestions([]);
      setCurrentQuestionIndex(0);
      navigate('/')
    } catch (err) {
      console.error(err);
      toast.error("Error creating form");
    } finally {
      setIsLoading(false);
    }
  };

  const questionTypes = [
    { value: "categorise", label: "Categorise" },
    { value: "cloze", label: "Cloze" },
    { value: "comprehension", label: "Comprehension" }
  ];

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-xl">
              <Sparkles className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              QuizCraft
            </h1>
          </div>
          <h2 className="text-4xl font-bold text-white mb-2">Create New Form</h2>
          <p className="text-gray-300">Build engaging quizzes and assessments</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Left Sidebar - Form Info & Questions Overview */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 space-y-6 sticky top-6">
              
              {/* Form Title */}
              <div>
                <label className="block text-white font-medium mb-2  items-center gap-2">
                  <Type size={16} />
                  Form Title
                </label>
                <input
                  type="text"
                  placeholder="Enter title"
                  className="w-full bg-white/10 border border-white/20 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-purple-400 focus:bg-white/20 placeholder-gray-400 transition-all duration-300"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Form Description */}
              <div>
                <label className="block text-white font-medium mb-2  items-center gap-2">
                  <AlignLeft size={16} />
                  Description
                </label>
                <textarea
                  placeholder="Enter description"
                  rows={3}
                  className="w-full bg-white/10 border border-white/20 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-purple-400 focus:bg-white/20 placeholder-gray-400 transition-all duration-300 resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Add Question Button */}
              <button
                onClick={addQuestion}
                className="w-full group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                Add Question
              </button>

              {/* Questions Overview */}
              {questions.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-white font-medium mb-3">
                    <FileText size={16} />
                    Questions ({questions.length})
                  </div>
                  
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {questions.map((q, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-between group ${
                          currentQuestionIndex === index 
                            ? 'bg-purple-600/30 border border-purple-400/50' 
                            : 'bg-white/5 hover:bg-white/10 border border-white/10'
                        }`}
                        onClick={() => goToQuestion(index)}
                      >
                        <div className="flex items-center gap-2">
                          <Hash size={14} className="text-gray-400" />
                          <span className="text-white text-sm font-medium">Q{index + 1}</span>
                          <span className="text-gray-400 text-xs capitalize">{q.type}</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeQuestion(index);
                          }}
                          className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 p-1 rounded transition-all duration-200"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={submitForm}
                disabled={isLoading || !title.trim() || questions.length === 0}
                className="w-full group bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-4 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100 transition-all duration-300 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Create Form
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Main Content - Question Editor */}
          <div className="lg:col-span-3">
            {questions.length === 0 ? (
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-12 text-center">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <Plus className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">No Questions Yet</h3>
                <p className="text-gray-300 mb-6">Click the "Add Question" button to start creating your form</p>
                <button
                  onClick={addQuestion}
                  className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 mx-auto"
                >
                  <Plus size={18} />
                  Add Your First Question
                </button>
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden">
                
                {/* Question Header with Navigation */}
                <div className="bg-white/5 border-b border-white/10 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-lg">
                        <Hash className="text-white" size={18} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">Question {currentQuestionIndex + 1}</h3>
                        <p className="text-gray-400 text-sm capitalize">{currentQuestion?.type} Question</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {/* Navigation Buttons */}
                      <button
                        onClick={prevQuestion}
                        disabled={currentQuestionIndex === 0}
                        className="p-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      
                      <span className="text-white text-sm px-3 py-1 bg-white/10 rounded-lg">
                        {currentQuestionIndex + 1} of {questions.length}
                      </span>
                      
                      <button
                        onClick={nextQuestion}
                        disabled={currentQuestionIndex === questions.length - 1}
                        className="p-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Question Content */}
                <div className="p-6 space-y-6">
                  
                  {/* Question Type Selector */}
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">Question Type</label>
                    <select
                      value={currentQuestion?.type || "categorise"}
                      onChange={(e) => updateQuestion(currentQuestionIndex, "type", e.target.value)}
                      className="w-full bg-white/10 border border-white/20 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-purple-400 focus:bg-white/20"
                    >
                      {questionTypes.map(type => (
                        <option key={type.value} value={type.value} className="bg-slate-800">
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Question Text */}
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">Question Text</label>
                    <textarea
                      placeholder="Enter your question"
                      rows={3}
                      className="w-full bg-white/10 border border-white/20 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-purple-400 focus:bg-white/20 placeholder-gray-400 transition-all duration-300 resize-none"
                      value={currentQuestion?.question || ""}
                      onChange={(e) => updateQuestion(currentQuestionIndex, "question", e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Marks */}
                    <div>
                      <label className="block text-gray-300 font-medium mb-2">Marks</label>
                      <input
                        type="number"
                        placeholder="Enter marks"
                        min="1"
                        className="w-full bg-white/10 border border-white/20 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-purple-400 focus:bg-white/20 placeholder-gray-400 transition-all duration-300"
                        value={currentQuestion?.marks || 1}
                        onChange={(e) => updateQuestion(currentQuestionIndex, "marks", e.target.value)}
                      />
                    </div>

                    {/* Image Upload */}
                    <div>
                      <label className="block text-gray-300 font-medium mb-2  items-center gap-2">
                        <Upload size={16} />
                        Upload Image
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        className="w-full bg-white/10 border border-white/20 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-purple-400 focus:bg-white/20 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white file:text-sm file:cursor-pointer hover:file:bg-purple-700 transition-all duration-300"
                        onChange={(e) => handleFileChange(currentQuestionIndex, e.target.files[0])}
                      />
                    </div>
                  </div>

                  {/* Question-specific UI components */}
                  <div className="bg-white/5 rounded-xl p-6">
                    <h4 className="text-white font-medium mb-4 flex items-center gap-2">
                      <Edit size={16} />
                      Question Configuration
                    </h4>
                    {currentQuestion?.type === "categorise" && (
                      <CategoriseUI question={currentQuestion} index={currentQuestionIndex} updateQuestion={updateQuestion} />
                    )}
                    {currentQuestion?.type === "cloze" && (
                      <ClozeUI question={currentQuestion} index={currentQuestionIndex} updateQuestion={updateQuestion} />
                    )}
                    {currentQuestion?.type === "comprehension" && (
                      <ComprehensionUI question={currentQuestion} index={currentQuestionIndex} updateQuestion={updateQuestion} />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Help Text */}
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            Create engaging quizzes with multiple question types. Navigate between questions using the sidebar or arrow buttons.
          </p>
        </div>
      </div>
    </div>
  );
}