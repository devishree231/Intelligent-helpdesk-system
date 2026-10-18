import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, GitBranch, Layers, ShieldCheck, Copy, Database } from 'lucide-react';
import { apiService } from '../services/api';
import { CategoryBadge, PriorityBadge } from '../components/Badges';
import { useTickets } from '../context/TicketContext';

export const AIAnalysisPage = () => {
  const { createNewTicket, setActiveTab, showToast } = useTickets();

  const [prompt, setPrompt] = useState('I am unable to connect to the office VPN. It keeps disconnecting after a few seconds. Tried restarting the system but the issue persists.');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const samplePrompts = [
    "I am unable to connect to the office VPN. It keeps disconnecting after a few seconds.",
    "Laptop not turning on. Power LED blinks twice then stays black, charger plugged in.",
    "Password reset request for corporate active directory and email login.",
    "Software installation error: Docker Desktop fails with Hyper-V WSL2 kernel missing.",
    "Conference room Zoom audio is echoing and loud screeching noise.",
    "Air conditioning in server room is leaking water and temperature is 83F."
  ];

  const handleAnalyze = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const data = await apiService.analyzeWithAI("Inquiry", prompt);
      setResult(data);
    } catch (e) {
      showToast("Error running AI inference", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicketFromAnalysis = async () => {
    if (!result) return;
    try {
      await createNewTicket({
        subject: prompt.slice(0, 50) + "...",
        description: prompt,
        category: result.category,
        priority: result.predicted_priority,
        rootCause: result.probable_root_cause,
        rootCausePath: result.root_cause_path,
        aiConfidence: result.confidence_score,
        suggestedSolution: result.suggested_solution
      });
    } catch (e) {
      //
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <span>AI Root-Cause & Semantic Mapping Playground</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Real-time NLP model evaluation: Category prediction, hierarchical root cause tree, priority suggestion, and semantic duplicate detection.
        </p>
      </div>

      {/* Input Box */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-card space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Enter Any Support Problem Description:
          </label>
          <textarea
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-slate-50 text-xs text-slate-800 p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            placeholder="Type any helpdesk problem..."
          />
        </div>

        {/* Quick sample chips */}
        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Quick Test Cases:
          </span>
          <div className="flex flex-wrap gap-2">
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setPrompt(p)}
                className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 border border-slate-200 transition-colors text-left truncate max-w-xs"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Running NLP Pipeline...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze with AI</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Results View */}
      {result && (
        <div className="bg-white border border-blue-200 rounded-2xl p-7 shadow-card space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Model Inference Results</h3>
              <p className="text-xs text-slate-500">TF-IDF Vectorizer + Hierarchical Multi-Class Classifier</p>
            </div>
            <div className="flex items-center gap-2 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-blue-900">
                Confidence: {Math.round(result.confidence_score * 100)}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] text-slate-400 font-semibold uppercase block mb-1">
                Predicted Category
              </span>
              <CategoryBadge category={result.category} />
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] text-slate-400 font-semibold uppercase block mb-1">
                Suggested Priority
              </span>
              <PriorityBadge priority={result.predicted_priority} />
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] text-slate-400 font-semibold uppercase block mb-1">
                Assigned Team
              </span>
              <span className="font-bold text-xs text-slate-800">{result.suggested_support_team}</span>
            </div>
          </div>

          {/* Hierarchical Mapping */}
          <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-900 mb-2">
              <GitBranch className="w-4 h-4 text-purple-600" />
              <span>Hierarchical Root-Cause Path</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-800">
              {result.root_cause_path.split('>').map((step, i, arr) => (
                <React.Fragment key={i}>
                  <span className="bg-white px-2.5 py-1 rounded-lg border border-purple-200 shadow-2xs">
                    {step.trim()}
                  </span>
                  {i < arr.length - 1 && <span className="text-purple-400">➔</span>}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Suggested Resolution */}
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Intelligent Solution Recommendation</span>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed font-medium">
              {result.suggested_solution}
            </p>
          </div>

          {/* Semantic Duplicates */}
          {result.similar_tickets && result.similar_tickets.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-800">
                Semantic Duplicate Candidates ({result.similar_tickets.length} found):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.similar_tickets.map((sim) => (
                  <div key={sim.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-600">{sim.id}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                        {sim.similarity || 90}% similarity
                      </span>
                    </div>
                    <p className="text-slate-700 mt-1 font-medium">{sim.subject}</p>
                    {sim.solution && (
                      <p className="text-[10px] text-emerald-700 mt-1">Resolution: {sim.solution}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleCreateTicketFromAnalysis}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center gap-2"
            >
              <span>Convert this Analysis into a Real Ticket</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
