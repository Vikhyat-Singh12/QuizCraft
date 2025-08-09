import React, { useState, useRef } from "react";
import { 
  Plus, 
  Trash2, 
  Target, 
  List,
  Lightbulb,
  CheckCircle,
  Type,
  Wand2
} from "lucide-react";

export default function ClozeUI({ question, index, updateQuestion }) {
  const [selectedText, setSelectedText] = useState("");
  const [showAddButton, setShowAddButton] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const questionTextRef = useRef(null);

  const updateCloze = (cloze) => {
    updateQuestion(index, "cloze", cloze);
  };

  const addOption = (optionText = "") => {
    const currentOptions = question.cloze?.options || [];
    updateCloze({
      ...question.cloze,
      options: [...currentOptions, optionText]
    });
  };

  const removeOption = (optionIndex) => {
    const newOptions = (question.cloze?.options || []).filter((_, i) => i !== optionIndex);
    updateCloze({
      ...question.cloze,
      options: newOptions
    });
  };

  const updateOption = (optionIndex, value) => {
    const newOptions = [...(question.cloze?.options || [])];
    newOptions[optionIndex] = value;
    updateCloze({
      ...question.cloze,
      options: newOptions
    });
  };

  const updateAnswer = (value) => {
    updateCloze({
      ...question.cloze,
      answer: value
    });
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const text = selection.toString().trim();
    
    if (text && questionTextRef.current && questionTextRef.current.contains(selection.anchorNode)) {
      setSelectedText(text);
      
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setButtonPosition({
        x: rect.left + rect.width / 2,
        y: rect.bottom + 10
      });
      setShowAddButton(true);
    } else {
      setShowAddButton(false);
      setSelectedText("");
    }
  };

  const addSelectedAsOption = () => {
    if (selectedText) {
      const currentOptions = question.cloze?.options || [];
      if (!currentOptions.includes(selectedText)) {
        addOption(selectedText);
      }
      
      updateAnswer(selectedText);
      
      const currentQuestion = question.question || "";
      const updatedQuestion = currentQuestion.replace(selectedText, "_____");
      updateQuestion(index, "question", updatedQuestion);
      
      // Clear selection
      window.getSelection().removeAllRanges();
      setShowAddButton(false);
      setSelectedText("");
    }
  };

  return (
    <div className="space-y-6 relative">
      
      <div className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-4">
        <div className="flex items-center gap-2 text-blue-300 font-medium mb-2">
          <Lightbulb size={16} />
          How to create Cloze questions
        </div>
        <div className="text-blue-200 text-sm space-y-1">
          <p>• Write your question text above</p>
          <p>• Select any part of the text - it will be replaced with _____ (blank)</p>
          <p>• The selected text becomes an option and the correct answer automatically</p>
          <p>• Add extra options manually to make the question more challenging</p>
          <p>• Students will choose from the options to fill in the blank</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-white font-medium">
          <Type size={18} className="text-purple-400" />
          <h4 className="text-lg">Question Text for Selection</h4>
        </div>
        
        <div 
          ref={questionTextRef}
          className="bg-white/10 border border-white/20 rounded-xl p-4 text-white min-h-[100px] cursor-text select-text"
          onMouseUp={handleTextSelection}
          suppressContentEditableWarning={true}
        >
          {question.question || (
            <span className="text-gray-400 italic">
              Your question text will appear here. Select any part to add as an option.
            </span>
          )}
        </div>
      </div>

      {showAddButton && (
        <button
          onClick={addSelectedAsOption}
          className="fixed z-50 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg shadow-xl transform -translate-x-1/2 flex items-center gap-2 text-sm font-medium transition-all duration-300 hover:scale-105"
          style={{ 
            left: `${buttonPosition.x}px`, 
            top: `${buttonPosition.y}px` 
          }}
        >
          <Wand2 size={14} />
          Replace with _____ & Add as Option
        </button>
      )}

      <div className="flex items-center">
        <div className="flex-1 border-t border-white/20"></div>
        <span className="mx-4 text-gray-400 text-sm">Configure Options</span>
        <div className="flex-1 border-t border-white/20"></div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-white font-medium">
          <List size={18} className="text-green-400" />
          <h4 className="text-lg">Answer Options</h4>
          <span className="text-sm text-gray-400">({(question.cloze?.options || []).length})</span>
        </div>
        
        <div className="space-y-3">
          {(question.cloze?.options || []).map((opt, i) => (
            <div key={i} className="group relative">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder={`Option ${i + 1}`}
                    className="w-full bg-white/10 border border-white/20 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-purple-400 focus:bg-white/20 placeholder-gray-400 transition-all duration-300"
                    value={opt}
                    onChange={(e) => updateOption(i, e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeOption(i)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all duration-200"
                  title="Remove Option"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => addOption()}
          className="group w-full bg-gradient-to-r from-green-600/20 to-emerald-600/20 hover:from-green-600/30 hover:to-emerald-600/30 border border-green-500/30 hover:border-green-400/50 text-green-300 hover:text-green-200 py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Add Manual Option
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-white font-medium">
          <Target size={18} className="text-yellow-400" />
          <h4 className="text-lg">Correct Answer</h4>
        </div>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Enter the correct answer"
            className="w-full bg-white/10 border border-white/20 text-white px-4 py-3 pr-12 rounded-xl focus:outline-none focus:border-purple-400 focus:bg-white/20 placeholder-gray-400 transition-all duration-300"
            value={question.cloze?.answer || ""}
            onChange={(e) => updateAnswer(e.target.value)}
          />
          {question.cloze?.answer && (
            <CheckCircle size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400" />
          )}
        </div>
        
        <div className="text-sm text-gray-400">
          This should match one of the options above for students to select as the correct answer.
        </div>
      </div>

      {/* Summary */}
      {(question.cloze?.options || []).length > 0 && question.cloze?.answer && (
        <div className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 text-purple-300 font-medium mb-2">
            <Target size={16} />
            Question Summary
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Total Options:</span>
              <span className="text-white ml-2 font-medium">{(question.cloze?.options || []).length}</span>
            </div>
            <div>
              <span className="text-gray-400">Correct Answer:</span>
              <span className="text-green-400 ml-2 font-medium">
                {question.cloze?.answer ? "✓ Set" : "✗ Not set"}
              </span>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-400">
            Students will select from the options to fill in the blank
          </div>
        </div>
      )}
    </div>
  );
}