import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, ChevronDown, CheckCircle2, AlertCircle, Database, Sparkles, User, Shield, Wrench } from 'lucide-react';
import { useTickets } from '../context/TicketContext';

export const Header = () => {
  const { 
    globalSearch, 
    setGlobalSearch, 
    currentUser, 
    switchUserRole, 
    notifications, 
    markNotificationRead,
    backendStatus,
    setActiveTab,
    openTicketDetail
  } = useTickets();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifRef = useRef(null);
  const userRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (globalSearch.trim()) {
      setActiveTab('my-tickets');
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Global Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative w-96">
        <input
          type="text"
          value={globalSearch}
          onChange={(e) => setGlobalSearch(e.target.value)}
          placeholder="Search tickets, keywords, or ID..."
          className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-sm text-slate-800 placeholder-slate-400 pl-4 pr-10 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />
        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600">
          <Search className="w-4 h-4" />
        </button>
      </form>

      {/* Right Controls */}
      <div className="flex items-center gap-5">
        {/* Backend / AI Status Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
          <span className={`w-2 h-2 rounded-full ${backendStatus.online ? 'bg-emerald-500' : 'bg-blue-500 animate-pulse'}`}></span>
          <span className="text-[11px] text-slate-500">Service:</span>
          <span className="font-semibold text-slate-700">{backendStatus.source}</span>
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-800 uppercase tracking-wider">Notifications</span>
                <span className="text-xs text-blue-600 font-medium">{unreadCount} unread</span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                {notifications.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => {
                      markNotificationRead(item.id);
                      if (item.message.includes('#HD-1024')) openTicketDetail('#HD-1024');
                      setShowNotifications(false);
                    }}
                    className={`px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors ${!item.read ? 'bg-blue-50/40' : ''}`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 w-2 h-2 rounded-full bg-blue-600 shrink-0"></div>
                      <div>
                        <p className="text-xs font-medium text-slate-800">{item.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{item.message}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">{item.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative" ref={userRef}>
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 pl-2 py-1 pr-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover border border-slate-200"
            />
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-slate-800 leading-tight">{currentUser.name}</div>
              <div className="text-[11px] text-slate-400 font-medium">{currentUser.role}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </button>

          {/* User Role Switcher Menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-800">{currentUser.name}</p>
                <p className="text-[11px] text-slate-500">{currentUser.email}</p>
              </div>

              <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Switch Role View
              </div>

              <button
                onClick={() => { switchUserRole('Employee'); setShowUserMenu(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left hover:bg-slate-50 ${currentUser.role === 'Employee' ? 'text-blue-600 font-semibold' : 'text-slate-700'}`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Employee View (Default)</span>
              </button>

              <button
                onClick={() => { switchUserRole('Support Engineer'); setShowUserMenu(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left hover:bg-slate-50 ${currentUser.role === 'Support Engineer' ? 'text-blue-600 font-semibold' : 'text-slate-700'}`}
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Support Engineer View</span>
              </button>

              <button
                onClick={() => { switchUserRole('Administrator'); setShowUserMenu(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left hover:bg-slate-50 ${currentUser.role === 'Administrator' ? 'text-blue-600 font-semibold' : 'text-slate-700'}`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Administrator View</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
