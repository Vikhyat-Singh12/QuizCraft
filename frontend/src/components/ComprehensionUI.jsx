import React from "react";
import { 
  Plus, 
  Trash2, 
  FileText, 
  HelpCircle,
  List,
  Target,
  BookOpen,
  CheckSquare,
  Edit3,
  MessageSquare
} from "lucide-react";

export default function ComprehensionUI({ question, index, updateQuestion }) {
  const updateComprehension = (comp) => {
    updateQuestion(index, "comprehension", comp);
  };

  const addSubQuestion = () => {
    updateComprehension({
      ...question.comprehension,
      questions: [
        ...(question.comprehension?.questions || []),
        { q: "", type: "short_answer", options: [], answer: "" }
      ]
    });
  };

  const removeSubQuestion = (subIndex) => {
    const newQuestions = (question.comprehension?.questions || []).filter((_, i) => i !== subIndex);
    updateComprehension({
      ...question.comprehension,
      questions: newQuestions
    });
  };

  const updateSubQuestion = (subIndex, field, value) => {
    const newQs = [...(question.comprehension?.questions || [])];
    newQs[subIndex][field] = value;
    
    if (field === "type") {
      if (value === "mcq" && !newQs[subIndex].options) {
        newQs[subIndex].options = [""];
        newQs[subIndex].answer = "";
      } else if (value === "short_answer") {
        newQs[subIndex].options = [];
      }
    }
    
    updateComprehension({ ...question.comprehension, questions: newQs });
  };

  const addOption = (subIndex) => {
    const newQs = [...(question.comprehension?.questions || [])];
    newQs[subIndex].options = [...(newQs[subIndex].options || []), ""];
    updateComprehension({ ...question.comprehension, questions: newQs });
  };

  const removeOption = (subIndex, optionIndex) => {
    const newQs = [...(question.comprehension?.questions || [])];
    newQs[subIndex].options = newQs[subIndex].options.filter((_, i) => i !== optionIndex);
    updateComprehension({ ...question.comprehension, questions: newQs });
  };

  const updateOption = (subIndex, optionIndex, value) => {
    const newQs = [...(question.comprehension?.questions || [])];
    newQs[subIndex].options[optionIndex] = value;
    updateComprehension({ ...question.comprehension, questions: newQs });
  };

  const questionTypes = [
    { value: "short_answer", label: "Short Answer", icon: MessageSquare },
    { value: "mcq", label: "Multiple Choice", icon: CheckSquare }
  ];

  return (
    <div className="space-y-6">
      
      <div className="bg-indigo-500/20 border border-indigo-400/30 rounded-xl p-4">
        <div className="flex items-center gap-2 text-indigo-300 font-medium mb-2">
          <BookOpen size={16} />
          Reading Comprehension Setup
        </div>
        <div className="text-indigo-200 text-sm space-y-1">
          <p>• Add a paragraph or passage for students to read</p>
          <p>• Create sub-questions based on the content</p>
          <p>• Choose between short answer or multiple choice questions</p>
          <p>• Students will read the passage and answer the questions</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-white font-medium">
          <FileText size={18} className="text-blue-400" />
          <h4 className="text-lg">Reading Passage</h4>
        </div>
        
        <div className="relative">
          <textarea
            placeholder="Enter the paragraph or passage that students will read and answer questions about..."
            rows={6}
            className="w-full bg-white/10 border border-white/20 text-white px-4 py-4 rounded-xl focus:outline-none focus:border-purple-400 focus:bg-white/20 placeholder-gray-400 transition-all duration-300 resize-y"
            value={question.comprehension?.paragraph || ""}
            onChange={(e) => updateComprehension({ ...question.comprehension, paragraph: e.target.value })}
          />
          <div className="absolute bottom-2 right-2 text-xs text-gray-400 bg-black/20 px-2 py-1 rounded">
            {(question.comprehension?.paragraph || "").length} characters
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <div className="flex-1 border-t border-white/20"></div>
        <span className="mx-4 text-gray-400 text-sm">Add Questions</span>
        <div className="flex-1 border-t border-white/20"></div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-medium">
            <HelpCircle size={18} className="text-green-400" />
            <h4 className="text-lg">Sub Questions</h4>
            <span className="text-sm text-gray-400">({(question.comprehension?.questions || []).length})</span>
          </div>
          
          <button
            onClick={addSubQuestion}
            className="group bg-gradient-to-r from-green-600/20 to-emerald-600/20 hover:from-green-600/30 hover:to-emerald-600/30 border border-green-500/30 hover:border-green-400/50 text-green-300 hover:text-green-200 py-2 px-4 rounded-xl font-medium transition-all duration-300 flex items-center gap-2"
          >
            <Plus size={16} />
            Add Sub Question
          </button>
        </div>

        {(question.comprehension?.questions || []).length === 0 ? (
          <div className="bg-white/5 border-2 border-dashed border-white/20 rounded-xl p-8 text-center">
            <HelpCircle size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-white font-medium mb-2">No Questions Yet</h3>
            <p className="text-gray-400 text-sm mb-4">Add your first question about the reading passage</p>
            <button
              onClick={addSubQuestion}
              className="group bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 mx-auto"
            >
              <Plus size={18} />
              Add First Question
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {(question.comprehension?.questions || []).map((sq, i) => {
              const TypeIcon = questionTypes.find(t => t.value === sq.type)?.icon || HelpCircle;
              
              return (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4 hover:bg-white/10 transition-all duration-300">
                  
                  {/* Sub Question Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-lg">
                        <TypeIcon className="text-white" size={16} />
                      </div>
                      <h5 className="text-white font-medium">Question {i + 1}</h5>
                      <span className="text-xs text-gray-400 capitalize px-2 py-1 bg-white/10 rounded-lg">
                        {sq.type.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => removeSubQuestion(i)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/20 p-2 rounded-lg transition-all duration-200"
                      title="Remove Question"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div>
                    <label className="block text-gray-300 font-medium mb-2">Question Text</label>
                    <input
                      type="text"
                      placeholder="Enter your sub-question"
                      className="w-full bg-white/10 border border-white/20 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-purple-400 focus:bg-white/20 placeholder-gray-400 transition-all duration-300"
                      value={sq.q || ""}
                      onChange={(e) => updateSubQuestion(i, "q", e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 font-medium mb-2">Question Type</label>
                    <select
                      className="w-full bg-white/10 border border-white/20 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-purple-400 focus:bg-white/20"
                      value={sq.type || "short_answer"}
                      onChange={(e) => updateSubQuestion(i, "type", e.target.value)}
                    >
                      {questionTypes.map(type => (
                        <option key={type.value} value={type.value} className="bg-slate-800">
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {sq.type === "mcq" && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-gray-300 font-medium">
                          <List size={16} />
                          Answer Options
                        </label>
                        <button
                          onClick={() => addOption(i)}
                          className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 p-2 rounded-lg transition-all duration-200"
                          title="Add Option"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      
                      <div className="space-y-2">
                        {(sq.options || []).map((opt, optIndex) => (
                          <div key={optIndex} className="group flex items-center gap-3">
                            <div className="flex-1">
                              <input
                                type="text"
                                placeholder={`Option ${optIndex + 1}`}
                                className="w-full bg-white/10 border border-white/20 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-purple-400 focus:bg-white/20 placeholder-gray-400 transition-all duration-300"
                                value={opt || ""}
                                onChange={(e) => updateOption(i, optIndex, e.target.value)}
                              />
                            </div>
                            <button
                              onClick={() => removeOption(i, optIndex)}
                              className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 hover:bg-red-500/20 p-1 rounded transition-all duration-200"
                              title="Remove Option"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-gray-300 font-medium mb-2  items-center gap-2">
                      <Target size={16} />
                      Correct Answer
                    </label>
                    <input
                      type="text"
                      placeholder={sq.type === "mcq" ? "Enter the correct option text" : "Enter the expected answer"}
                      className="w-full bg-white/10 border border-white/20 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-purple-400 focus:bg-white/20 placeholder-gray-400 transition-all duration-300"
                      value={sq.answer || ""}
                      onChange={(e) => updateSubQuestion(i, "answer", e.target.value)}
                    />
                    {sq.type === "mcq" && (
                      <div className="text-xs text-gray-400 mt-1">
                        This should match exactly one of the options above
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {question.comprehension?.paragraph && (question.comprehension?.questions || []).length > 0 && (
        <div className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 text-purple-300 font-medium mb-2">
            <BookOpen size={16} />
            Comprehension Summary
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Passage Length:</span>
              <span className="text-white ml-2 font-medium">
                {(question.comprehension?.paragraph || "").length} chars
              </span>
            </div>
            <div>
              <span className="text-gray-400">Total Questions:</span>
              <span className="text-white ml-2 font-medium">
                {(question.comprehension?.questions || []).length}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Question Types:</span>
              <span className="text-white ml-2 font-medium">
                {(() => {
                  const types = (question.comprehension?.questions || []).reduce((acc, q) => {
                    acc[q.type] = (acc[q.type] || 0) + 1;
                    return acc;
                  }, {});
                  return Object.entries(types).map(([type, count]) => 
                    `${count} ${type.replace('_', ' ')}`
                  ).join(', ') || 'None';
                })()}
              </span>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-400">
            Students will read the passage and answer the questions based on the content
          </div>
        </div>
      )}
    </div>
  );
}