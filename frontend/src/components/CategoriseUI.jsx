import React from "react";
import { 
  Plus, 
  Trash2, 
  Tag, 
  List,
  Move,
  Target
} from "lucide-react";

export default function CategoriseUI({ question, index, updateQuestion }) {
  const updateCategories = (categories) => {
    updateQuestion(index, "categories", categories);
  };

  const updateOptions = (options) => {
    updateQuestion(index, "options", options);
  };

  const addCategory = () => {
    updateCategories([...(question.categories || []), ""]);
  };

  const addOption = () => {
    updateOptions([...(question.options || []), { text: "", correctCategory: "" }]);
  };

  const removeCategory = (categoryIndex) => {
    const newCategories = (question.categories || []).filter((_, i) => i !== categoryIndex);
    const categoryToRemove = (question.categories || [])[categoryIndex];
    
    const newOptions = (question.options || []).map(opt => ({
      ...opt,
      correctCategory: opt.correctCategory === categoryToRemove ? "" : opt.correctCategory
    }));
    
    updateCategories(newCategories);
    updateOptions(newOptions);
  };

  const removeOption = (optionIndex) => {
    const newOptions = (question.options || []).filter((_, i) => i !== optionIndex);
    updateOptions(newOptions);
  };

  const updateCategory = (categoryIndex, value) => {
    const newCats = [...(question.categories || [])];
    const oldCategory = newCats[categoryIndex];
    newCats[categoryIndex] = value;
    
    const newOptions = (question.options || []).map(opt => ({
      ...opt,
      correctCategory: opt.correctCategory === oldCategory ? value : opt.correctCategory
    }));
    
    updateCategories(newCats);
    updateOptions(newOptions);
  };

  const updateOption = (optionIndex, field, value) => {
    const newOpts = [...(question.options || [])];
    newOpts[optionIndex][field] = value;
    updateOptions(newOpts);
  };

  return (
    <div className="space-y-6">
      
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-white font-medium">
          <Tag size={18} className="text-purple-400" />
          <h4 className="text-lg">Categories</h4>
          <span className="text-sm text-gray-400">({(question.categories || []).length})</span>
        </div>
        
        <div className="space-y-3">
          {(question.categories || []).map((cat, i) => (
            <div key={i} className="group relative">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder={`Category ${i + 1}`}
                    className="w-full bg-white/10 border border-white/20 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-purple-400 focus:bg-white/20 placeholder-gray-400 transition-all duration-300"
                    value={cat}
                    onChange={(e) => updateCategory(i, e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeCategory(i)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all duration-200"
                  title="Remove Category"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addCategory}
          className="group w-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30 border border-blue-500/30 hover:border-blue-400/50 text-blue-300 hover:text-blue-200 py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      <div className="flex items-center">
        <div className="flex-1 border-t border-white/20"></div>
        <span className="mx-4 text-gray-400 text-sm">Configure Options</span>
        <div className="flex-1 border-t border-white/20"></div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-white font-medium">
          <List size={18} className="text-green-400" />
          <h4 className="text-lg">Options</h4>
          <span className="text-sm text-gray-400">({(question.options || []).length})</span>
        </div>

        {(question.categories || []).length === 0 && (
          <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-xl p-4 flex items-center gap-3">
            <Target className="text-yellow-400" size={20} />
            <p className="text-yellow-300 text-sm">Add at least one category before creating options</p>
          </div>
        )}
        
        <div className="space-y-4">
          {(question.options || []).map((opt, i) => (
            <div key={i} className="group bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center gap-2 mb-3">
                <Move size={14} className="text-gray-400" />
                <span className="text-white font-medium text-sm">Option {i + 1}</span>
                <button
                  type="button"
                  onClick={() => removeOption(i)}
                  className="ml-auto opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all duration-200"
                  title="Remove Option"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1">Option Text</label>
                  <input
                    type="text"
                    placeholder="Enter option text"
                    className="w-full bg-white/10 border border-white/20 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-purple-400 focus:bg-white/20 placeholder-gray-400 transition-all duration-300"
                    value={opt.text || ""}
                    onChange={(e) => updateOption(i, "text", e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1">Correct Category</label>
                  <select
                    className="w-full bg-white/10 border border-white/20 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-purple-400 focus:bg-white/20"
                    value={opt.correctCategory || ""}
                    onChange={(e) => updateOption(i, "correctCategory", e.target.value)}
                    disabled={(question.categories || []).length === 0}
                  >
                    <option value="" className="bg-slate-800">Select Category</option>
                    {(question.categories || []).map((cat, idx) => (
                      <option key={idx} value={cat} className="bg-slate-800">
                        {cat || `Category ${idx + 1}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addOption}
          disabled={(question.categories || []).length === 0}
          className="group w-full bg-gradient-to-r from-green-600/20 to-emerald-600/20 hover:from-green-600/30 hover:to-emerald-600/30 disabled:from-gray-600/20 disabled:to-gray-700/20 border border-green-500/30 hover:border-green-400/50 disabled:border-gray-500/20 text-green-300 hover:text-green-200 disabled:text-gray-400 py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Add Option
        </button>
      </div>

      {/* Summary */}
      {(question.categories || []).length > 0 && (question.options || []).length > 0 && (
        <div className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 text-purple-300 font-medium mb-2">
            <Target size={16} />
            Question Summary
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Categories:</span>
              <span className="text-white ml-2 font-medium">{(question.categories || []).length}</span>
            </div>
            <div>
              <span className="text-gray-400">Options:</span>
              <span className="text-white ml-2 font-medium">{(question.options || []).length}</span>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-400">
            Students will drag options to their correct categories
          </div>
        </div>
      )}
    </div>
  );
}