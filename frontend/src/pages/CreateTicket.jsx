import React, { useState, useEffect } from 'react';
import { UploadCloud, Sparkles, CheckCircle2, ArrowRight, X, AlertCircle } from 'lucide-react';
import { useTickets } from '../context/TicketContext';
import { apiService } from '../services/api';

export const CreateTicket = () => {
  const { createNewTicket, setActiveTab, showToast } = useTickets();

  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('');
  const [fileList, setFileList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // AI Prediction Assistant State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiPrediction, setAiPrediction] = useState(null);

  // Debounced auto-prediction when description is typed
  useEffect(() => {
    if (description.trim().length > 15) {
      const timer = setTimeout(async () => {
        setIsAnalyzing(true);
        try {
          const res = await apiService.analyzeWithAI(subject, description);
          setAiPrediction(res);
        } catch (e) {
          console.error("AI auto-predict error:", e);
        } finally {
          setIsAnalyzing(false);
        }
      }, 700);
      return () => clearTimeout(timer);
    } else {
      setAiPrediction(null);
    }
  }, [subject, description]);

  const handleApplyAISuggestions = () => {
    if (aiPrediction) {
      if (aiPrediction.category) setCategory(aiPrediction.category);
      if (aiPrediction.predicted_priority) setPriority(aiPrediction.predicted_priority);
      showToast("Applied AI suggested Category and Priority!");
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFileList(prev => [...prev, ...files]);
  };

  const removeFile = (idx) => {
    setFileList(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      showToast("Please fill in both Subject and Description", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      await createNewTicket({
        subject,
        description,
        category: category || (aiPrediction ? aiPrediction.category : 'IT Support'),
        priority: priority || (aiPrediction ? aiPrediction.predicted_priority : 'Medium'),
        rootCause: aiPrediction ? aiPrediction.probable_root_cause : null,
        rootCausePath: aiPrediction ? aiPrediction.root_cause_path : null,
        aiConfidence: aiPrediction ? aiPrediction.confidence_score : null,
        suggestedSolution: aiPrediction ? aiPrediction.suggested_solution : null
      });
    } catch (err) {
      // handled in context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Create New Ticket</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Ticket Form (2 columns) */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-7 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Subject */}
              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Subject <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter a short summary"
                  className="w-full bg-slate-50 text-xs text-slate-800 placeholder-slate-400 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  required
                />
              </div>

              {/* Category */}
              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 text-xs text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  required
                >
                  <option value="">Select category</option>
                  <option value="Network">Network</option>
                  <option value="Hardware Issue">Hardware Issue</option>
                  <option value="Software Issue">Software Issue</option>
                  <option value="Account Access">Account Access</option>
                  <option value="IT Support">IT Support</option>
                  <option value="Others">Others</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Priority */}
              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Priority <span className="text-rose-500">*</span>
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full bg-slate-50 text-xs text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  required
                >
                  <option value="">Select priority</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Description <span className="text-rose-500">*</span>
                </label>
                {isAnalyzing && (
                  <span className="text-[11px] font-medium text-blue-600 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 animate-spin" />
                    AI Analyzing description...
                  </span>
                )}
              </div>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your issue in detail..."
                className="w-full bg-slate-50 text-xs text-slate-800 placeholder-slate-400 p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                required
              />
            </div>

            {/* Drag and Drop Attachment Upload Area */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Attachments (Optional)
              </label>
              <label className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-xs font-medium text-slate-700">
                  Drag and drop files here, or <span className="text-blue-600 font-semibold underline">click to upload</span>
                </span>
                <span className="text-[11px] text-slate-400 mt-1">(Max 5MB each)</span>
                <input 
                  type="file" 
                  multiple 
                  onChange={handleFileUpload}
                  className="hidden" 
                />
              </label>

              {fileList.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {fileList.map((file, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 border border-slate-200">
                      <span className="truncate max-w-[180px]">{file.name}</span>
                      <button type="button" onClick={() => removeFile(idx)} className="text-slate-400 hover:text-rose-500">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    <span>Submitting Ticket...</span>
                  </>
                ) : (
                  <span>Submit</span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* AI Predictive Assistant Sidebar (1 column) */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-blue-50/70 to-indigo-50/40 border border-blue-200/80 rounded-2xl p-5 shadow-card">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Automated AI Root-Cause Preview
              </h3>
            </div>

            {aiPrediction ? (
              <div className="space-y-3.5 text-xs animate-in fade-in duration-200">
                <div className="bg-white/90 p-3 rounded-xl border border-blue-100 shadow-2xs">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                    Hierarchical Root Cause
                  </span>
                  <p className="font-semibold text-purple-700">
                    {aiPrediction.root_cause_path}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white/90 p-2.5 rounded-xl border border-blue-100">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Category</span>
                    <span className="font-semibold text-blue-600">{aiPrediction.category}</span>
                  </div>
                  <div className="bg-white/90 p-2.5 rounded-xl border border-blue-100">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Priority</span>
                    <span className="font-semibold text-rose-600">{aiPrediction.predicted_priority}</span>
                  </div>
                </div>

                <div className="bg-white/90 p-3 rounded-xl border border-blue-100 shadow-2xs">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                    Instant Solution Suggestion
                  </span>
                  <p className="text-slate-700 text-[11px] leading-relaxed">
                    {aiPrediction.suggested_solution}
                  </p>
                </div>

                {/* Similarity warning if duplicates exist */}
                {aiPrediction.similar_ticket_count > 0 && (
                  <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-[11px] text-amber-800 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>{aiPrediction.similar_ticket_count} similar tickets</strong> found in historical records. Check before submitting to avoid duplicate tickets.
                    </span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleApplyAISuggestions}
                  className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Apply AI Category & Priority</span>
                </button>
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400 text-xs">
                <p className="font-medium text-slate-600 mb-1">No prediction yet</p>
                <p className="text-[11px] text-slate-400">
                  Type an issue description (e.g. "Unable to connect to office VPN...") to see real-time root-cause mapping and priority suggestion.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
