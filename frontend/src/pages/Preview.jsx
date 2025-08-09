import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Clock, CheckCircle, X, RotateCcw } from "lucide-react";
import useFormStore from "../store/useFormStore";
import { useParams } from "react-router-dom";


export default function Preview() {
  const [answers, setAnswers] = useState({});
  const [draggedItem, setDraggedItem] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [usedItems, setUsedItems] = useState({}); 

  const { formId } = useParams();
  const { form, fetchForms } = useFormStore();

  useEffect(() => {
    fetchForms({ id: formId });
  }, [fetchForms, formId]);


  if (!form) 
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-400 mx-auto mb-4"></div>
          <p className="text-white text-xl font-medium">Loading quiz...</p>
        </div>
      </div>
    );

  const currentQuestion = form.questions[currentQuestionIndex];

  const handleAnswerChange = (qId, value) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  const handleDragStart = (e, item, type, itemId) => {
    if (usedItems[currentQuestion._id]?.includes(itemId || item)) {
      e.preventDefault();
      return;
    }
    
    setDraggedItem({ item, type, itemId: itemId || item });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetId, targetType) => {
    e.preventDefault();
    if (!draggedItem) return;

    if (targetType === 'cloze') {
      // Remove previous answer if exists
      const prevAnswer = answers[targetId];
      if (prevAnswer) {
        setUsedItems(prev => ({
          ...prev,
          [currentQuestion._id]: (prev[currentQuestion._id] || []).filter(item => item !== prevAnswer)
        }));
      }
      
      handleAnswerChange(targetId, draggedItem.item);
      // Mark item as used
      setUsedItems(prev => ({
        ...prev,
        [currentQuestion._id]: [...(prev[currentQuestion._id] || []), draggedItem.itemId]
      }));
    } else if (targetType === 'category') {
      const currentAnswers = answers[targetId] || [];
      if (!currentAnswers.includes(draggedItem.item)) {
        handleAnswerChange(targetId, [...currentAnswers, draggedItem.item]);
        setUsedItems(prev => ({
          ...prev,
          [currentQuestion._id]: [...(prev[currentQuestion._id] || []), draggedItem.itemId]
        }));
      }
    }
    setDraggedItem(null);
  };

  const removeCategoryItem = (questionId, targetId, item) => {
    const currentAnswers = answers[targetId] || [];
    const newAnswers = currentAnswers.filter(i => i !== item);
    handleAnswerChange(targetId, newAnswers);
    
    const optionId = currentQuestion.options.find(opt => opt.text === item)?._id;
    
    setUsedItems(prev => ({
      ...prev,
      [questionId]: (prev[questionId] || []).filter(usedItem => usedItem !== optionId)
    }));
  };

  const removeClozeItem = (targetId) => {
    const prevAnswer = answers[targetId];
    if (prevAnswer) {
      handleAnswerChange(targetId, '');
      setUsedItems(prev => ({
        ...prev,
        [currentQuestion._id]: (prev[currentQuestion._id] || []).filter(item => item !== prevAnswer)
      }));
    }
  };

  const resetQuestion = () => {
    const questionId = currentQuestion._id;
    const newAnswers = { ...answers };
    
    if (currentQuestion.type === 'categorise') {
      currentQuestion.categories.forEach(cat => {
        delete newAnswers[`${questionId}-${cat}`];
      });
    } else if (currentQuestion.type === 'cloze') {
      Object.keys(newAnswers).forEach(key => {
        if (key.startsWith('cloze-')) {
          delete newAnswers[key];
        }
      });
    } else if (currentQuestion.type === 'comprehension') {
      currentQuestion.comprehension.questions.forEach(subQ => {
        delete newAnswers[subQ._id];
      });
    }
    
    setAnswers(newAnswers);
    setUsedItems(prev => ({ ...prev, [questionId]: [] }));
  };

  const parseClozeSentence = (sentence) => {
    const parts = sentence.split('_____');
    return parts.map((part, index) => (
      <React.Fragment key={index}>
        <span className="text-white">{part}</span>
        {index < parts.length - 1 && (
          <span className="relative inline-block">
            <span
              className={`inline-block min-w-32 h-12 mx-2 px-4 py-3 rounded-xl text-center font-medium transition-all duration-300 ${
                answers[`cloze-${index}`] 
                  ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-lg' 
                  : 'bg-white/20 backdrop-blur-sm border-2 border-dashed border-white/40 text-white/60 hover:border-purple-400 hover:bg-white/30'
              }`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, `cloze-${index}`, 'cloze')}
            >
              {answers[`cloze-${index}`] || 'Drop here'}
            </span>
            {answers[`cloze-${index}`] && (
              <button
                onClick={() => removeClozeItem(`cloze-${index}`)}
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm transition-colors duration-200"
              >
                <X size={12} />
              </button>
            )}
          </span>
        )}
      </React.Fragment>
    ));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < form.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const getQuestionStatus = (index) => {
    const question = form.questions[index];
    const questionId = question._id;
    
    if (question.type === 'categorise') {
      return question.categories.some(cat => answers[`${questionId}-${cat}`]?.length > 0);
    } else if (question.type === 'cloze') {
      return Object.keys(answers).some(key => key.startsWith('cloze-') && answers[key]);
    } else if (question.type === 'comprehension') {
      return question.comprehension.questions.some(subQ => answers[subQ._id]);
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{form.title}</h1>
              <p className="text-purple-200">{form.description}</p>
            </div>
            <div className="flex items-center gap-4 text-white">
              <Clock size={20} />
              <span className="text-lg font-medium">Question {currentQuestionIndex + 1} of {form.questions.length}</span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-white/10 rounded-full h-2 mb-4">
            <div 
              className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentQuestionIndex + 1) / form.questions.length) * 100}%` }}
            ></div>
          </div>

          {/* Question Navigator */}
          <div className="flex gap-2">
            {form.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-10 h-10 rounded-full font-medium transition-all duration-200 flex items-center justify-center ${
                  index === currentQuestionIndex
                    ? 'bg-purple-500 text-white shadow-lg scale-110'
                    : getQuestionStatus(index)
                    ? 'bg-green-500 text-white'
                    : 'bg-white/20 text-white/60 hover:bg-white/30'
                }`}
              >
                {getQuestionStatus(index) ? <CheckCircle size={16} /> : index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="max-w-6xl mx-auto p-8">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden shadow-2xl">
          {/* Question Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {currentQuestion.question}
              </h2>
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <span className="font-medium">{currentQuestion.marks} marks</span>
                </div>
                <button
                  onClick={resetQuestion}
                  className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors duration-200"
                  title="Reset Question"
                >
                  <RotateCcw size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="p-8">
            {currentQuestion.image && (
              <div className="mb-8 flex justify-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 max-w-4xl">
                  <img
                    src={currentQuestion.image}
                    alt="question"
                    className="w-full h-auto max-h-96 object-contain rounded-xl shadow-lg"
                  />
                </div>
              </div>
            )}

            {/* Categorise Question */}
            {currentQuestion.type === "categorise" && (
              <div className="space-y-8">
                {/* Draggable Options */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <h4 className="font-semibold text-white mb-4 text-lg">Available Items:</h4>
                  <div className="flex flex-wrap gap-4">
                    {currentQuestion.options.map((opt) => {
                      const isUsed = usedItems[currentQuestion._id]?.includes(opt._id);
                      return (
                        <div
                          key={opt._id}
                          draggable={!isUsed}
                          onDragStart={(e) => handleDragStart(e, opt.text, 'category', opt._id)}
                          className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                            isUsed
                              ? 'bg-gray-500/50 text-gray-300 cursor-not-allowed opacity-50'
                              : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white cursor-move hover:shadow-xl hover:scale-105 active:scale-95'
                          } select-none`}
                        >
                          {opt.text}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Categories */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {currentQuestion.categories.map((cat) => (
                    <div key={cat} className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
                      <h4 className="font-bold text-white mb-4 text-center text-xl">{cat}</h4>
                      <div
                        className="min-h-40 border-2 border-dashed border-white/30 rounded-xl p-4 hover:border-purple-400 hover:bg-white/10 transition-all duration-300"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, `${currentQuestion._id}-${cat}`, 'category')}
                      >
                        {(answers[`${currentQuestion._id}-${cat}`] || []).map((item, index) => (
                          <div
                            key={index}
                            className="bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-xl px-4 py-3 mb-3 shadow-lg flex items-center justify-between group hover:shadow-xl transition-all duration-200"
                          >
                            <span className="font-medium">{item}</span>
                            <button
                              onClick={() => removeCategoryItem(currentQuestion._id, `${currentQuestion._id}-${cat}`, item)}
                              className="text-white/80 hover:text-white bg-white/20 hover:bg-white/30 rounded-full w-6 h-6 flex items-center justify-center transition-all duration-200"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                        {(!answers[`${currentQuestion._id}-${cat}`] || answers[`${currentQuestion._id}-${cat}`].length === 0) && (
                          <div className="text-white/50 text-center text-lg mt-12">
                            Drop items here
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cloze Question */}
            {currentQuestion.type === "cloze" && (
              <div className="space-y-8">
                {/* Draggable Options */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <h4 className="font-semibold text-white mb-4 text-lg">Available Words:</h4>
                  <div className="flex flex-wrap gap-4">
                    {currentQuestion.cloze.options.map((opt, i) => {
                      const isUsed = usedItems[currentQuestion._id]?.includes(opt);
                      return (
                        <div
                          key={i}
                          draggable={!isUsed}
                          onDragStart={(e) => handleDragStart(e, opt, 'cloze', opt)}
                          className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                            isUsed
                              ? 'bg-gray-500/50 text-gray-300 cursor-not-allowed opacity-50'
                              : 'bg-gradient-to-r from-orange-400 to-pink-500 text-white cursor-move hover:shadow-xl hover:scale-105 active:scale-95'
                          } select-none`}
                        >
                          {opt}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Cloze Sentence */}
                <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <div className="text-2xl leading-relaxed font-medium">
                    {parseClozeSentence(currentQuestion.question)}
                  </div>
                </div>
              </div>
            )}

            {/* Comprehension Question */}
            {currentQuestion.type === "comprehension" && (
              <div className="space-y-8">
                <div className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <p className="text-white leading-relaxed text-lg">
                    {currentQuestion.comprehension.paragraph}
                  </p>
                </div>
                
                {currentQuestion.comprehension.questions.map((subQ, subIdx) => (
                  <div key={subQ._id} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                    <p className="font-medium text-white mb-6 text-lg">
                      {currentQuestionIndex + 1}.{subIdx + 1} {subQ.q}
                    </p>

                    {/* Short Answer */}
                    {subQ.type === "short_answer" && (
                      <input
                        type="text"
                        value={answers[subQ._id] || ""}
                        onChange={(e) => handleAnswerChange(subQ._id, e.target.value)}
                        className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl focus:border-purple-400 focus:outline-none transition-all duration-200 text-white placeholder-white/50 text-lg"
                        placeholder="Type your answer here..."
                      />
                    )}

                    {/* MCQ */}
                    {subQ.type === "mcq" && (
                      <div className="space-y-4">
                        {subQ.options.map((opt, i) => (
                          <label
                            key={i}
                            className={`block border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                              answers[subQ._id] === opt
                                ? 'border-purple-400 bg-purple-500/20 backdrop-blur-sm'
                                : 'border-white/20 hover:border-purple-300 hover:bg-white/10 backdrop-blur-sm'
                            }`}
                          >
                            <div className="flex items-center">
                              <input
                                type="radio"
                                name={subQ._id}
                                value={opt}
                                checked={answers[subQ._id] === opt}
                                onChange={(e) => handleAnswerChange(subQ._id, e.target.value)}
                                className="w-5 h-5 text-purple-500 mr-4"
                              />
                              <span className="text-white text-lg">{opt}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={prevQuestion}
            disabled={currentQuestionIndex === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              currentQuestionIndex === 0
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
            }`}
          >
            <ChevronLeft size={20} />
            Previous
          </button>

          <div className="text-white/60 text-lg">
            {currentQuestionIndex + 1} / {form.questions.length}
          </div>

          {currentQuestionIndex === form.questions.length - 1 ? (
            <button className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              Submit Quiz
              <CheckCircle size={20} />
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-medium hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Next
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}