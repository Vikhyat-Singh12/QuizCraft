import React, { useEffect, useState } from "react";
import { 
  Plus, 
  Eye, 
  Trash2, 
  Trophy, 
  FileText, 
  CheckCircle,
  Star,
  ArrowRight,
  Sparkles,
  Copy,
  Check,
  Search
} from "lucide-react";

import {useAuthStore} from "../store/useAuthStore";
import useFormStore from "../store/useFormStore";
import { useNavigate } from "react-router-dom"; 
import toast from "react-hot-toast";


export default function Home() {
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [quizId, setQuizId] = useState(""); 
  const { user, getMe } = useAuthStore();
  const { deleteForm } = useFormStore();
  const navigate = useNavigate();
  
  const handleDelete = async (formId) => {
    try {
      await deleteForm(formId);
    } catch (err) {
      console.error("Error deleting form:", err);
    }
  };

  const copyToClipboard = async (formId) => {
    try {
      await navigator.clipboard.writeText(formId);
      setCopiedId(formId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      const textArea = document.createElement('textarea');
      textArea.value = formId;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedId(formId);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleTakeQuiz = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    const alreadyTaken = user.testsGiven?.some(
      (test) => test.form.toString() === quizId.trim()
    );

    if (alreadyTaken) {
      toast.error("You have already taken this test!");
      return;
    }

    navigate(`/test/${quizId}`);
  };

  const handleQuizIdSubmit = (e) => {
    e.preventDefault();
    handleTakeQuiz();
  };

  useEffect(() => {
    getMe();
    setLoading(false);
  }, [getMe,handleDelete]);

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-400";
    if (score >= 75) return "text-yellow-400";
    return "text-orange-400";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-400 mx-auto mb-4"></div>
          <p className="text-white text-xl font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-purple-500/20 backdrop-blur-sm border border-purple-400/30 rounded-full px-6 py-2 mb-6">
              <Sparkles className="text-purple-400" size={16} />
              <span className="text-purple-200 text-sm font-medium">Welcome to the Future of Quizzing</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent leading-tight">
              QuizCraft
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-10 leading-relaxed">
              Create stunning interactive quizzes with drag-and-drop functionality, 
              advanced question types, and beautiful analytics. 
              <span className="text-purple-300 font-medium"> Transform learning into an engaging experience.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="/form"
                className="group bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
              >
                <Plus size={20} />
                Create Your Quiz
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
              </a>
              
              {/* Quiz ID Input Form */}
              <div className="flex flex-col sm:flex-row gap-2 items-center">
                <form onSubmit={handleQuizIdSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={quizId}
                    onChange={(e) => setQuizId(e.target.value)}
                    placeholder="Enter Quiz ID"
                    className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-4 rounded-xl font-medium placeholder-gray-400 focus:bg-white/20 focus:border-purple-400 focus:outline-none transition-all duration-300 min-w-48"
                  />
                  <button
                    type="submit"
                    disabled={!quizId.trim()}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-4 rounded-xl font-medium hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2"
                  >
                    <Search size={20} />
                    Take Quiz
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Section */}
      {user && (
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                Welcome back, <span className="text-purple-400">{user.name}</span>! 👋
              </h2>
              <p className="text-xl text-gray-300">Here's your dashboard overview</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Forms Created Section */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl">
                      <FileText className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">Forms Created</h3>
                      <p className="text-gray-300">Your quiz collection</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-purple-400">
                      {user.formsCreated?.length || 0}
                    </div>
                    <div className="text-gray-400 text-sm">Total forms</div>
                  </div>
                </div>

                <div className="space-y-4 max-h-80 overflow-y-auto custom-scrollbar">
                  {user.formsCreated?.length > 0 ? (
                    user.formsCreated.map((form) => (
                      <div
                        key={form._id}
                        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="text-white font-semibold text-lg group-hover:text-purple-300 transition-colors duration-200">
                              {form.heading}
                            </h4>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => copyToClipboard(form.form)}
                              className="bg-green-500/20 hover:bg-green-500/30 text-green-300 hover:text-green-200 p-2 rounded-lg transition-all duration-200 group/btn"
                              title={copiedId === form.form ? "Copied!" : "Copy Quiz ID"}
                            > 
                              {copiedId === form.form ? (
                                <Check size={16} className="group-hover/btn:scale-110 transition-transform duration-200" />
                              ) : (
                                <Copy size={16} className="group-hover/btn:scale-110 transition-transform duration-200" />
                              )}
                            </button>
                            <a
                              href={`/preview/${form.form}`}
                              className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 hover:text-blue-200 p-2 rounded-lg transition-all duration-200 group/btn"
                              title="Preview"
                            >
                              <Eye size={16} className="group-hover/btn:scale-110 transition-transform duration-200" />
                            </a>
                            <button
                              onClick={() => handleDelete(form.form)}
                              className="bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 p-2 rounded-lg transition-all duration-200 group/btn"
                              title="Delete"
                            >
                              <Trash2 size={16} className="group-hover/btn:scale-110 transition-transform duration-200" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="text-gray-500 mx-auto mb-4" size={48} />
                      <p className="text-gray-400 text-lg mb-4">No forms created yet</p>
                      <a
                        href="/form"
                        className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200"
                      >
                        <Plus size={16} />
                        Create Your First Form
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Tests Given Section */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
  <div className="flex items-center justify-between mb-8">
    <div className="flex items-center gap-4">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-xl">
        <Trophy className="text-white" size={24} />
      </div>
      <div>
        <h3 className="text-2xl font-bold text-white">Tests Completed</h3>
        <p className="text-gray-300">Your achievements</p>
      </div>
    </div>
    <div className="text-right">
      <div className="text-4xl font-bold text-green-400">
        {user.testsGiven?.length || 0}
      </div>
      <div className="text-gray-400 text-sm">Total tests</div>
    </div>
  </div>

  <div className="space-y-4 max-h-80 overflow-y-auto custom-scrollbar">
    {user.testsGiven?.length > 0 ? (
      user.testsGiven.map((test) => {
        const percentage = test.maxScore
          ? ((test.score / test.maxScore) * 100).toFixed(2)
          : 0;

        return (
          <div
            key={test._id}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-white font-semibold text-lg group-hover:text-green-300 transition-colors duration-200">
                    {test.heading || "Untitled Test"}
                  </h4>
                  <div className={`text-2xl font-bold ${getScoreColor(percentage)}`}>
                    {percentage}%
                  </div>
                </div>
                <div className="text-gray-300 text-sm mb-1">
                  Marks:{" "}
                  <span className="font-semibold text-white">
                    {test.score}
                  </span>{" "}
                  / {test.maxScore}
                </div>
                <div className="flex items-center gap-4 text-gray-400 text-sm">
                  <span>
                    Completed{" "}
                    {new Date(test.submittedAt).toLocaleString()}
                  </span>
                  <div className="flex items-center gap-1">
                    {percentage >= 90 ? (
                      <Star className="text-yellow-400" size={14} />
                    ) : percentage >= 75 ? (
                      <CheckCircle className="text-green-400" size={14} />
                    ) : null}
                    <span>
                      {percentage >= 90
                        ? "Excellent"
                        : percentage >= 75
                        ? "Good"
                        : "Needs Improvement"}
                    </span>
                  </div>
                </div>
              </div>
              <a
                href={`/form/${test.form}`}
                className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 hover:text-purple-200 px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 group/btn"
              >
                <Eye size={14} />
                <span className="text-sm font-medium">Review</span>
              </a>
            </div>
          </div>
        );
      })
    ) : (
      <div className="text-center py-12">
        <Trophy className="text-gray-500 mx-auto mb-4" size={48} />
        <p className="text-gray-400 text-lg mb-4">No tests completed yet</p>
        <p className="text-gray-500 text-sm">
          Start taking quizzes to see your progress here!
        </p>
      </div>
    )}
  </div>
</div>

            </div>

          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm"></div>
        <div className="relative max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Create Amazing Quizzes?
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Join thousands of educators and learners who are already using QuizCraft to transform their teaching and learning experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/form"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-4 rounded-xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
            >
              <Plus size={20} />
              Start Creating Now
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}