import React, { useState } from 'react';
import { Settings as SettingsIcon, Database, Cpu, RotateCcw, Shield, Check, Info } from 'lucide-react';
import { useTickets } from '../context/TicketContext';
import { apiService } from '../services/api';

export const Settings = () => {
  const { currentUser, switchUserRole, backendStatus, refreshData, showToast } = useTickets();

  const [aiConfidenceThreshold, setAiConfidenceThreshold] = useState(0.70);
  const [similarityThreshold, setSimilarityThreshold] = useState(0.40);
  const [springBootUrl, setSpringBootUrl] = useState('http://localhost:8080');
  const [fastApiUrl, setFastApiUrl] = useState('http://localhost:8000');

  const handleResetData = () => {
    apiService.resetDemoData();
    refreshData();
    showToast("Reset all tickets to original 24 seeded records matching the reference image!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-slate-700" />
          <span>System Settings & Architecture Status</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure microservice connections, view database persistence, and switch user roles.
        </p>
      </div>

      {/* Service Health Card */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-card space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Database className="w-4 h-4 text-blue-600" />
          <span>Integration & Persistence Status</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[11px] text-slate-400 font-semibold uppercase block mb-1">
              Backend Mode
            </span>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${backendStatus.online ? 'bg-emerald-500' : 'bg-blue-500'}`}></span>
              <span className="font-bold text-slate-800">{backendStatus.source}</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1.5">
              {backendStatus.online ? "Connected to Spring Boot REST API." : "Using persistent browser storage fallback (zero setup needed)."}
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[11px] text-slate-400 font-semibold uppercase block mb-1">
              AI NLP Service
            </span>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="font-bold text-slate-800">FastAPI + Scikit-Learn</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1.5">
              Port 8000: TF-IDF + Hierarchical Classifier & Cosine Similarity.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[11px] text-slate-400 font-semibold uppercase block mb-1">
              Active User Role
            </span>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-600" />
              <span className="font-bold text-slate-800">{currentUser.role}</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1.5">
              Current user: {currentUser.name}
            </p>
          </div>
        </div>
      </div>

      {/* Role Switcher */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-card space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Role-Based View Simulation
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { role: 'Employee', name: 'Shreenithi', desc: 'Can submit tickets, view own tickets, and browse Knowledge Base.' },
            { role: 'Support Engineer', name: 'Alex Rivera', desc: 'Can assign tickets, update status, and manage resolution notes.' },
            { role: 'Administrator', name: 'Sarah Connor', desc: 'Full permissions including adding Knowledge Base articles and analytics.' },
          ].map((item) => (
            <button
              key={item.role}
              onClick={() => switchUserRole(item.role)}
              className={`p-4 rounded-xl text-left border transition-all ${
                currentUser.role === item.role
                  ? 'border-blue-600 bg-blue-50/50 shadow-2xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-900">{item.role}</span>
                {currentUser.role === item.role && (
                  <Check className="w-4 h-4 text-blue-600" />
                )}
              </div>
              <span className="text-[11px] text-blue-600 font-semibold block mb-1">{item.name}</span>
              <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* AI Thresholds */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-card space-y-4 text-xs">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Cpu className="w-4 h-4 text-blue-600" />
          <span>AI Model Tuning Parameters</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between mb-1.5 font-semibold text-slate-700">
              <span>Confidence Threshold</span>
              <span>{Math.round(aiConfidenceThreshold * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.4"
              max="0.95"
              step="0.05"
              value={aiConfidenceThreshold}
              onChange={(e) => setAiConfidenceThreshold(parseFloat(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Confidence score required before highlighting root-cause mapping automatically.
            </span>
          </div>

          <div>
            <div className="flex justify-between mb-1.5 font-semibold text-slate-700">
              <span>Duplicate Detection Similarity Threshold</span>
              <span>{Math.round(similarityThreshold * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.3"
              max="0.9"
              step="0.05"
              value={similarityThreshold}
              onChange={(e) => setSimilarityThreshold(parseFloat(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Cosine similarity cutoff for flagging potentially duplicate tickets.
            </span>
          </div>
        </div>
      </div>

      {/* Danger Zone: Reset Data */}
      <div className="bg-white border border-rose-100 rounded-2xl p-6 shadow-card space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-rose-600 uppercase tracking-wider">
              Reset Application State
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Restores the exact initial 24 tickets and metrics from the reference UI image.
            </p>
          </div>
          <button
            onClick={handleResetData}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
