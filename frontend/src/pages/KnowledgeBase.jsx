import React, { useState, useEffect } from 'react';
import { Search, BookOpen, ThumbsUp, Eye, Tag, Plus, ExternalLink, Sparkles, X } from 'lucide-react';
import { CategoryBadge } from '../components/Badges';
import { apiService } from '../services/api';
import { useTickets } from '../context/TicketContext';

export const KnowledgeBase = () => {
  const { currentUser, showToast } = useTickets();
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New article form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Network');
  const [newRootCause, setNewRootCause] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('');

  const loadArticles = async () => {
    try {
      const data = await apiService.getKnowledgeBase(search, selectedCategory);
      setArticles(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadArticles();
  }, [search, selectedCategory]);

  const handleLike = (id) => {
    setArticles(prev => prev.map(a => a.id === id ? { ...a, likes: (a.likes || 0) + 1 } : a));
    showToast("Thank you for your feedback!");
  };

  const handleCreateArticle = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newArt = {
      id: `KB-${100 + articles.length + 1}`,
      title: newTitle,
      category: newCategory,
      rootCause: newRootCause || 'General',
      content: newContent,
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
      views: 1,
      likes: 0,
      createdAt: 'Just now'
    };

    setArticles([newArt, ...articles]);
    setShowCreateModal(false);
    setNewTitle('');
    setNewContent('');
    setNewRootCause('');
    setNewTags('');
    showToast("Knowledge article published to AI corpus!");
  };

  const categories = ['All', 'Network', 'Hardware Issue', 'Software Issue', 'Account Access', 'IT Support'];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Knowledge Base</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified technical resolutions and troubleshooting documentation for AI solution recommendations.
          </p>
        </div>

        {currentUser.role === 'Administrator' || currentUser.role === 'Support Engineer' ? (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Article</span>
          </button>
        ) : null}
      </div>

      {/* Search and Category Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-card flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search solutions, symptoms, or error codes..."
            className="w-full bg-slate-50 text-xs text-slate-800 placeholder-slate-400 pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {articles.map((article) => (
          <div
            key={article.id}
            onClick={() => setSelectedArticle(article)}
            className="bg-white border border-slate-100 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-slate-400">{article.id}</span>
                <CategoryBadge category={article.category} />
              </div>

              <h3 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                {article.title}
              </h3>

              {article.rootCause && (
                <div className="mb-3">
                  <span className="text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md font-medium border border-purple-100">
                    Root Cause: {article.rootCause}
                  </span>
                </div>
              )}

              <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                {article.content}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {article.views || 120}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(article.id);
                  }}
                  className="flex items-center gap-1 hover:text-blue-600"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  {article.likes || 15}
                </button>
              </div>

              <span className="text-blue-600 font-semibold text-[11px] flex items-center gap-1">
                Read guide ➔
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl space-y-4 max-h-[85vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold text-slate-400">{selectedArticle.id}</span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{selectedArticle.title}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <CategoryBadge category={selectedArticle.category} />
                  {selectedArticle.rootCause && (
                    <span className="text-xs text-purple-700 bg-purple-50 px-2 py-0.5 rounded font-medium">
                      {selectedArticle.rootCause}
                    </span>
                  )}
                </div>
              </div>
              <button onClick={() => setSelectedArticle(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-800 font-mono leading-relaxed whitespace-pre-wrap border border-slate-100">
              {selectedArticle.content}
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-slate-400">Used by AI Solution Engine</span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Article Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Add Knowledge Base Article</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateArticle} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Resolving Cisco AnyConnect Gateway timeout"
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200"
                  >
                    <option value="Network">Network</option>
                    <option value="Hardware Issue">Hardware Issue</option>
                    <option value="Software Issue">Software Issue</option>
                    <option value="Account Access">Account Access</option>
                    <option value="IT Support">IT Support</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Probable Root Cause</label>
                  <input
                    type="text"
                    value={newRootCause}
                    onChange={(e) => setNewRootCause(e.target.value)}
                    placeholder="e.g. VPN server issue"
                    className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Troubleshooting Content</label>
                <textarea
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Step-by-step resolution procedure..."
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="vpn, timeout, anyconnect"
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold"
                >
                  Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
