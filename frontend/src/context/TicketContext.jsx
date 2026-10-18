import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { NOTIFICATIONS } from '../services/mockData';

const TicketContext = createContext();

export const TicketProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTicketId, setSelectedTicketId] = useState('#HD-1024');
  const [tickets, setTickets] = useState([]);
  const [currentTicket, setCurrentTicket] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [globalSearch, setGlobalSearch] = useState('');
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [backendStatus, setBackendStatus] = useState({ online: false, source: 'Connecting...' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Current logged in user (with role switcher support)
  const [currentUser, setCurrentUser] = useState({
    name: 'Shreenithi',
    role: 'Employee',
    email: 'shreenithi@company.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Load backend status and initial data
  const refreshData = async () => {
    setLoading(true);
    try {
      const status = await apiService.checkBackendHealth();
      setBackendStatus(status);

      const stats = await apiService.getDashboardStats();
      setDashboardStats(stats);

      const ticketRes = await apiService.getTickets({ limit: 50 });
      setTickets(ticketRes.tickets || []);

      if (selectedTicketId) {
        try {
          const detail = await apiService.getTicketById(selectedTicketId);
          setCurrentTicket(detail);
        } catch (e) {
          // fallback
        }
      }
    } catch (err) {
      console.error("Error refreshing data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Open ticket detail
  const openTicketDetail = async (ticketId) => {
    setSelectedTicketId(ticketId);
    setLoading(true);
    try {
      const ticket = await apiService.getTicketById(ticketId);
      setCurrentTicket(ticket);
      setActiveTab('ticket-detail');
    } catch (e) {
      showToast("Unable to load ticket details", "error");
    } finally {
      setLoading(false);
    }
  };

  // Create ticket
  const createNewTicket = async (ticketData) => {
    setLoading(true);
    try {
      const created = await apiService.createTicket({
        ...ticketData,
        createdBy: currentUser.name
      });
      showToast(`Ticket ${created.id} created successfully! Automated root-cause mapped.`);
      await refreshData();
      openTicketDetail(created.id);
      return created;
    } catch (err) {
      showToast("Failed to create ticket", "error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update ticket status
  const updateStatus = async (ticketId, newStatus) => {
    try {
      const updated = await apiService.updateTicketStatus(ticketId, newStatus);
      showToast(`Ticket status updated to ${newStatus}`);
      if (currentTicket && currentTicket.id === ticketId) {
        setCurrentTicket({ ...currentTicket, status: newStatus });
      }
      await refreshData();
      return updated;
    } catch (err) {
      showToast("Failed to update status", "error");
    }
  };

  // Assign ticket
  const assignTicket = async (ticketId, assignee) => {
    try {
      const updated = await apiService.assignTicket(ticketId, assignee);
      showToast(`Assigned ${ticketId} to ${assignee}`);
      if (currentTicket && currentTicket.id === ticketId) {
        setCurrentTicket({ ...currentTicket, assignedTo: assignee, status: currentTicket.status === 'Open' ? 'In Progress' : currentTicket.status });
      }
      await refreshData();
      return updated;
    } catch (err) {
      showToast("Failed to assign ticket", "error");
    }
  };

  // Add comment
  const addTicketComment = async (ticketId, commentText, isAi = false) => {
    try {
      const newComment = await apiService.addComment(ticketId, {
        commentText,
        authorName: isAi ? "HelpDesk AI" : currentUser.name,
        authorRole: isAi ? "AI Assistant" : currentUser.role,
        isAiGenerated: isAi
      });
      showToast("Comment posted");
      if (currentTicket && currentTicket.id === ticketId) {
        const comments = currentTicket.comments || [];
        setCurrentTicket({ ...currentTicket, comments: [...comments, newComment] });
      }
      return newComment;
    } catch (err) {
      showToast("Failed to post comment", "error");
    }
  };

  // Switch user role (Employee, Support Engineer, Administrator)
  const switchUserRole = (newRole) => {
    const roles = {
      Employee: {
        name: 'Shreenithi',
        role: 'Employee',
        email: 'shreenithi@company.com',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
      },
      'Support Engineer': {
        name: 'Alex Rivera',
        role: 'Support Engineer',
        email: 'alex.r@company.com',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
      },
      Administrator: {
        name: 'Sarah Connor',
        role: 'Administrator',
        email: 'sarah.c@company.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
      }
    };
    setCurrentUser(roles[newRole] || roles.Employee);
    showToast(`Switched active user to ${newRole}`);
  };

  // Mark notification read
  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <TicketContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedTicketId,
        openTicketDetail,
        tickets,
        currentTicket,
        dashboardStats,
        globalSearch,
        setGlobalSearch,
        notifications,
        markNotificationRead,
        currentUser,
        switchUserRole,
        backendStatus,
        loading,
        toast,
        showToast,
        createNewTicket,
        updateStatus,
        assignTicket,
        addTicketComment,
        refreshData
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};

export const useTickets = () => useContext(TicketContext);
