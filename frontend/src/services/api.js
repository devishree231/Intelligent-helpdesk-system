import axios from 'axios';
import { INITIAL_TICKETS, INITIAL_KB_ARTICLES, WEEKLY_TREND, NOTIFICATIONS } from './mockData';

// Storage keys for persistent local fallback
const STORAGE_KEY_TICKETS = 'helpdesk_ai_tickets_v1';
const STORAGE_KEY_KB = 'helpdesk_ai_kb_v1';

// Initialize local storage if empty
const getStoredTickets = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TICKETS);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(STORAGE_KEY_TICKETS, JSON.stringify(INITIAL_TICKETS));
    return [...INITIAL_TICKETS];
  } catch (e) {
    return [...INITIAL_TICKETS];
  }
};

const saveStoredTickets = (tickets) => {
  try {
    localStorage.setItem(STORAGE_KEY_TICKETS, JSON.stringify(tickets));
  } catch (e) {
    console.error("Failed to save tickets to localStorage:", e);
  }
};

const getStoredKB = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_KB);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(STORAGE_KEY_KB, JSON.stringify(INITIAL_KB_ARTICLES));
    return [...INITIAL_KB_ARTICLES];
  } catch (e) {
    return [...INITIAL_KB_ARTICLES];
  }
};

const saveStoredKB = (articles) => {
  try {
    localStorage.setItem(STORAGE_KEY_KB, JSON.stringify(articles));
  } catch (e) {
    console.error("Failed to save KB to localStorage:", e);
  }
};

// Base axios instance with fast timeout for fallback
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 3000,
});

// Direct AI service client
const aiDirectClient = axios.create({
  baseURL: 'http://localhost:8000/api/ai',
  timeout: 3000,
});

export const apiService = {
  // Check if live backend is online
  async checkBackendHealth() {
    try {
      const res = await apiClient.get('/dashboard/stats');
      return { online: true, source: 'Spring Boot + PostgreSQL' };
    } catch (e) {
      return { online: false, source: 'Local Persistence (Demo Fallback)' };
    }
  },

  // Check if FastAPI AI service is directly online
  async checkAIHealth() {
    try {
      const res = await aiDirectClient.get('/health');
      return { online: true, details: res.data };
    } catch (e) {
      return { online: false };
    }
  },

  // Get tickets with search, filters, pagination
  async getTickets(params = {}) {
    const { query = '', status = 'All', category = 'All', priority = 'All', page = 1, limit = 5 } = params;
    
    try {
      const res = await apiClient.get('/tickets', {
        params: { query, status, category, priority, page: page - 1, size: limit }
      });
      if (res.data && res.data.content) {
        return {
          tickets: res.data.content,
          total: res.data.totalElements,
          totalPages: res.data.totalPages,
          currentPage: res.data.number + 1
        };
      }
    } catch (e) {
      // Fallback to local storage
    }

    // Local in-memory filtering
    let all = getStoredTickets();
    if (query && query.trim()) {
      const q = query.toLowerCase().trim();
      all = all.filter(t => 
        t.id.toLowerCase().includes(q) || 
        t.subject.toLowerCase().includes(q) || 
        t.description.toLowerCase().includes(q)
      );
    }
    if (status && status !== 'All') {
      all = all.filter(t => t.status.toLowerCase() === status.toLowerCase());
    }
    if (category && category !== 'All') {
      all = all.filter(t => t.category.toLowerCase() === category.toLowerCase());
    }
    if (priority && priority !== 'All') {
      all = all.filter(t => t.priority.toLowerCase() === priority.toLowerCase());
    }

    const total = all.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const validPage = Math.min(page, totalPages);
    const start = (validPage - 1) * limit;
    const paginated = all.slice(start, start + limit);

    return {
      tickets: paginated,
      total,
      totalPages,
      currentPage: validPage
    };
  },

  // Get single ticket by ID
  async getTicketById(id) {
    try {
      const res = await apiClient.get(`/tickets/${id}`);
      if (res.data) return res.data;
    } catch (e) {
      // Fallback
    }

    const tickets = getStoredTickets();
    const found = tickets.find(t => t.id === id);
    if (!found) throw new Error("Ticket not found: " + id);
    return found;
  },

  // Create new ticket
  async createTicket(ticketData) {
    try {
      const res = await apiClient.post('/tickets', ticketData);
      if (res.data) {
        // Also sync local
        const local = getStoredTickets();
        saveStoredTickets([res.data, ...local]);
        return res.data;
      }
    } catch (e) {
      // Fallback
    }

    const all = getStoredTickets();
    const nextNum = 1000 + all.length + 1;
    const newId = `#HD-${nextNum}`;

    // Local AI prediction fallback if not provided
    const aiPrediction = this.localPredictAI(ticketData.subject, ticketData.description);

    const newTicket = {
      id: newId,
      subject: ticketData.subject,
      description: ticketData.description,
      category: ticketData.category || aiPrediction.category,
      priority: ticketData.priority || aiPrediction.priority,
      rootCause: ticketData.rootCause || aiPrediction.probable_root_cause,
      rootCausePath: ticketData.rootCausePath || aiPrediction.root_cause_path,
      status: "Open",
      createdBy: ticketData.createdBy || "Shreenithi",
      assignedTo: null,
      createdOn: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }),
      lastUpdated: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }),
      aiConfidence: aiPrediction.confidence_score,
      suggestedSolution: aiPrediction.suggested_solution,
      suggestedTeam: aiPrediction.suggested_support_team,
      similarTicketCount: aiPrediction.similar_ticket_count || 1,
      similarTickets: aiPrediction.similar_tickets || [],
      comments: [
        {
          id: Date.now(),
          author: "HelpDesk AI",
          role: "AI Assistant",
          text: `Automated Root-Cause Mapping: ${aiPrediction.root_cause_path} (${Math.round(aiPrediction.confidence_score * 100)}% confidence). Recommended solution: ${aiPrediction.suggested_solution}`,
          date: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }),
          isAi: true
        }
      ]
    };

    saveStoredTickets([newTicket, ...all]);
    return newTicket;
  },

  // Update ticket status
  async updateTicketStatus(id, newStatus) {
    try {
      const res = await apiClient.patch(`/tickets/${id}/status`, { status: newStatus });
      if (res.data) return res.data;
    } catch (e) {
      // Fallback
    }

    const all = getStoredTickets();
    const updated = all.map(t => {
      if (t.id === id) {
        return {
          ...t,
          status: newStatus,
          lastUpdated: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })
        };
      }
      return t;
    });
    saveStoredTickets(updated);
    return updated.find(t => t.id === id);
  },

  // Assign ticket
  async assignTicket(id, assignee) {
    try {
      const res = await apiClient.patch(`/tickets/${id}/assign`, { assignedTo: assignee });
      if (res.data) return res.data;
    } catch (e) {
      // Fallback
    }

    const all = getStoredTickets();
    const updated = all.map(t => {
      if (t.id === id) {
        return {
          ...t,
          assignedTo: assignee,
          status: t.status === 'Open' ? 'In Progress' : t.status,
          lastUpdated: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })
        };
      }
      return t;
    });
    saveStoredTickets(updated);
    return updated.find(t => t.id === id);
  },

  // Add comment to ticket
  async addComment(ticketId, commentData) {
    try {
      const res = await apiClient.post(`/tickets/${ticketId}/comments`, commentData);
      if (res.data) return res.data;
    } catch (e) {
      // Fallback
    }

    const all = getStoredTickets();
    let createdComment = null;
    const updated = all.map(t => {
      if (t.id === ticketId) {
        const comments = t.comments || [];
        createdComment = {
          id: Date.now(),
          author: commentData.authorName || 'Shreenithi',
          role: commentData.authorRole || 'Employee',
          text: commentData.commentText,
          date: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }),
          isAi: Boolean(commentData.isAiGenerated)
        };
        return {
          ...t,
          comments: [...comments, createdComment],
          lastUpdated: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })
        };
      }
      return t;
    });
    saveStoredTickets(updated);
    return createdComment;
  },

  // AI Prediction service
  async analyzeWithAI(subject, description, ticketId = null) {
    // 1. Try direct FastAPI AI microservice
    try {
      const res = await aiDirectClient.post('/predict', { subject, description, ticket_id: ticketId });
      if (res.data) return res.data;
    } catch (e) {
      // 2. Try via Spring Boot proxy
      try {
        const res2 = await apiClient.post('/ai/analyze', { subject, description, ticketId });
        if (res2.data) return res2.data;
      } catch (e2) {
        // Fallback to local NLP logic
      }
    }

    return this.localPredictAI(subject, description, ticketId);
  },

  // Local NLP Heuristic Engine for fallback
  localPredictAI(subject, description, ticketId = null) {
    const text = `${subject || ''} ${description || ''}`.toLowerCase();
    
    let category = "IT Support";
    let probable_root_cause = "General Workstation Setup";
    let root_cause_path = "IT Support > General > Workstation Support";
    let predicted_priority = "Medium";
    let suggested_solution = "Review workstation configuration and verify connected cables.";
    let suggested_support_team = "IT Helpdesk";
    let confidence_score = 0.88;

    if (text.includes("vpn") || text.includes("network") || text.includes("wifi") || text.includes("connect") || text.includes("internet") || text.includes("gateway")) {
      category = "Network";
      probable_root_cause = "VPN server issue";
      root_cause_path = "Network > VPN > VPN server issue";
      predicted_priority = "High";
      suggested_solution = "Restart VPN client / check server status";
      suggested_support_team = "Network Operations";
      confidence_score = 0.94;
    } else if (text.includes("laptop") || text.includes("turn") || text.includes("battery") || text.includes("hardware") || text.includes("keyboard") || text.includes("screen") || text.includes("power") || text.includes("charger")) {
      category = "Hardware Issue";
      probable_root_cause = "Power supply or Motherboard failure";
      root_cause_path = "Hardware > Laptop > Power / Motherboard Failure";
      predicted_priority = "Medium";
      suggested_solution = "Hold power button 30s for flea-power discharge; schedule battery diagnostic";
      suggested_support_team = "End-User Hardware Support";
      confidence_score = 0.91;
    } else if (text.includes("password") || text.includes("reset") || text.includes("okta") || text.includes("login") || text.includes("account") || text.includes("mfa") || text.includes("permission") || text.includes("email")) {
      category = "Account Access";
      probable_root_cause = text.includes("password") ? "Password expired / locked account" : "Corrupted OAuth token in Intune Company Portal";
      root_cause_path = text.includes("password") ? "Account Access > Active Directory > Expired Credentials" : "Account Access > Microsoft 365 > Modern Auth Token";
      predicted_priority = "Low";
      suggested_solution = text.includes("password") ? "Trigger SSPR reset link and manager authorization" : "Re-enroll via MS Authenticator after clearing company portal cache";
      suggested_support_team = "Identity & Access Management";
      confidence_score = 0.96;
    } else if (text.includes("docker") || text.includes("software") || text.includes("install") || text.includes("error") || text.includes("teams") || text.includes("crash") || text.includes("intellij") || text.includes("excel")) {
      category = "Software Issue";
      probable_root_cause = "WSL2 Linux kernel update package required";
      root_cause_path = "Software Issue > Developer Tools > Missing WSL2 Kernel";
      predicted_priority = "Medium";
      suggested_solution = "Run 'wsl --update' in elevated PowerShell and enable Virtual Machine Platform";
      suggested_support_team = "Application Support";
      confidence_score = 0.89;
    }

    const similar_tickets = [
      { id: "#HD-1018", subject: "Cisco AnyConnect Gateway timeout", similarity: 94, status: "Resolved", solution: "Switched to secondary failover gateway IP" },
      { id: "#HD-1012", subject: "VPN keeps disconnecting after 5 minutes", similarity: 88, status: "Resolved", solution: "Adjusted MTU packet size to 1350" },
      { id: "#HD-0995", subject: "VPN authentication loop error", similarity: 79, status: "Resolved", solution: "Reinstalled client profile certificate" }
    ];

    return {
      ticket_id: ticketId,
      category,
      probable_root_cause,
      root_cause_path,
      predicted_priority,
      suggested_solution,
      suggested_support_team,
      confidence_score,
      similar_ticket_count: 3,
      similar_tickets
    };
  },

  // Knowledge base retrieval
  async getKnowledgeBase(query = '', category = 'All') {
    try {
      const res = await apiClient.get('/kb/articles', { params: { query, category } });
      if (res.data) return res.data;
    } catch (e) {
      // Fallback
    }

    let articles = getStoredKB();
    if (query && query.trim()) {
      const q = query.toLowerCase().trim();
      articles = articles.filter(a => 
        a.title.toLowerCase().includes(q) || 
        a.content.toLowerCase().includes(q) || 
        a.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    if (category && category !== 'All') {
      articles = articles.filter(a => a.category.toLowerCase() === category.toLowerCase());
    }
    return articles;
  },

  // Dashboard stats calculation
  async getDashboardStats() {
    try {
      const res = await apiClient.get('/dashboard/stats');
      if (res.data) return res.data;
    } catch (e) {
      // Fallback
    }

    const tickets = getStoredTickets();
    const total = tickets.length;
    const resolved = tickets.filter(t => t.status === 'Resolved').length;
    const inProgress = tickets.filter(t => t.status === 'In Progress').length;
    const open = tickets.filter(t => t.status === 'Open').length;

    // Categories breakdown
    const catCounts = {};
    tickets.forEach(t => {
      catCounts[t.category] = (catCounts[t.category] || 0) + 1;
    });

    const categoryDistribution = Object.entries(catCounts).map(([name, count]) => ({
      name,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0
    })).sort((a, b) => b.count - a.count);

    return {
      totalTickets: total,
      resolvedTickets: resolved,
      inProgressTickets: inProgress,
      openTickets: open,
      totalTrend: "+ 12% from last week",
      resolvedTrend: "+ 20% from last week",
      inProgressTrend: "+ 17% from last week",
      openTrend: "- 25% from last week",
      categoryDistribution,
      weeklyTrend: WEEKLY_TREND,
      priorityDistribution: [
        { priority: "High", count: 22, percentage: 18 },
        { priority: "Medium", count: 56, percentage: 45 },
        { priority: "Low", count: 46, percentage: 37 }
      ]
    };
  },

  // Reports data
  async getReportsData(period = '7d') {
    try {
      const res = await apiClient.get('/dashboard/reports', { params: { period } });
      if (res.data) return res.data;
    } catch (e) {
      // Fallback
    }

    return {
      totalTickets: 124,
      resolvedTickets: 98,
      avgResolutionHours: 4.2,
      csatScore: 4.6,
      slaComplianceRate: 94.8,
      ticketsByPriority: [
        { name: "High", value: 22, percentage: "18%" },
        { name: "Medium", value: 56, percentage: "45%" },
        { name: "Low", value: 46, percentage: "37%" }
      ],
      categoryDistribution: [
        { category: "IT Support", count: 32 },
        { category: "Software Issue", count: 28 },
        { category: "Hardware Issue", count: 20 },
        { category: "Account Access", count: 15 },
        { category: "Network", count: 12 },
        { category: "Others", count: 7 }
      ]
    };
  },

  // Reset demo data
  resetDemoData() {
    localStorage.removeItem(STORAGE_KEY_TICKETS);
    localStorage.removeItem(STORAGE_KEY_KB);
    return getStoredTickets();
  }
};
