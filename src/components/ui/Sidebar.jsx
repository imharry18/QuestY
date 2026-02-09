'use client';

import React, { useState } from 'react';
import { useSheetStore } from '@/store/useSheetStore';
import { 
  Plus, Layout, Terminal, Monitor, Trash2, X, PieChart, ChevronRight, Pencil, Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const { 
    workspaces, 
    activeWorkspaceId, 
    setActiveWorkspace, 
    addWorkspace, 
    deleteWorkspace,
    updateWorkspaceTitle, // Get the update function
    isSidebarOpen,      
    setSidebarOpen      
  } = useSheetStore();

  const [isCreating, setIsCreating] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  
  // State for Editing
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newWorkspaceName.trim()) return;
    addWorkspace(newWorkspaceName);
    setNewWorkspaceName("");
    setIsCreating(false);
  };

  const startEditing = (e, ws) => {
    e.stopPropagation(); // Prevent switching workspace when clicking edit
    setEditingId(ws.id);
    setEditingName(ws.title);
  };

  const saveEditing = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (editingName.trim()) {
      updateWorkspaceTitle(editingId, editingName);
    }
    setEditingId(null);
  };

  // Calculate Total Stats for the Footer
  const activeWS = workspaces.find(w => w.id === activeWorkspaceId);
  const totalQs = activeWS?.topics?.reduce((acc, t) => acc + t.subTopics.reduce((sAcc, s) => sAcc + s.questions.length, 0), 0) || 0;
  const doneQs = activeWS?.topics?.reduce((acc, t) => acc + t.subTopics.reduce((sAcc, s) => sAcc + s.questions.filter(q => q.done).length, 0), 0) || 0;
  const percentage = totalQs === 0 ? 0 : Math.round((doneQs / totalQs) * 100);

  return (
    <>
      {/* Mobile Overlay (Backdrop) */}
      {isSidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden animate-in fade-in"
        />
      )}

      {/* Sidebar Container - NOW STICKY */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-r border-gray-200 dark:border-white/10 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:w-64 flex flex-col",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-white/5 flex items-center justify-between flex-shrink-0">
          <h2 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Workspaces</h2>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setIsCreating(true)}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-md transition-colors text-gray-500 hover:text-blue-600"
            >
              <Plus size={16} />
            </button>
            {/* Mobile Close Button */}
            <button 
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1.5 text-gray-500 hover:text-red-500"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Workspace List - SCROLLABLE */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {/* Creation Form */}
          {isCreating && (
            <form onSubmit={handleCreate} className="mb-2 p-3 bg-white dark:bg-white/5 rounded-xl border border-blue-200 dark:border-blue-500/30 shadow-sm animate-in zoom-in-95">
              <input
                autoFocus
                placeholder="Name (e.g. 'System Design')"
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
                className="w-full bg-transparent border-b border-gray-200 dark:border-white/10 pb-1 text-sm outline-none text-gray-900 dark:text-white placeholder-gray-400 mb-3"
              />
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setIsCreating(false)} className="text-xs text-gray-500 hover:text-gray-700 px-2">Cancel</button>
                <button type="submit" className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 font-medium">Create</button>
              </div>
            </form>
          )}

          {workspaces.map((ws) => (
            <div 
              key={ws.id}
              className={cn(
                "group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200",
                activeWorkspaceId === ws.id 
                  ? "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 shadow-sm" 
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
              )}
              onClick={() => {
                setActiveWorkspace(ws.id);
                setSidebarOpen(false); // Close on mobile after selection
              }}
            >
              {editingId === ws.id ? (
                // EDIT MODE
                <div className="flex items-center gap-2 w-full" onClick={(e) => e.stopPropagation()}>
                  <input 
                    autoFocus
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && saveEditing(e)}
                    className="flex-1 bg-white dark:bg-black/20 border border-blue-300 rounded px-1.5 py-0.5 text-sm outline-none"
                  />
                  <button onClick={saveEditing} className="text-green-600 hover:bg-green-100 p-1 rounded"><Check size={14} /></button>
                </div>
              ) : (
                // VIEW MODE
                <>
                  <div className="flex items-center gap-3">
                    {ws.title.toLowerCase().includes('web') ? <Monitor size={18} /> :
                     ws.title.toLowerCase().includes('dsa') ? <Terminal size={18} /> :
                     <Layout size={18} />}
                    <span className="truncate max-w-[100px]">{ws.title}</span>
                  </div>
                  
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* EDIT BUTTON */}
                    <button 
                      onClick={(e) => startEditing(e, ws)}
                      className="p-1 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded"
                    >
                      <Pencil size={12} />
                    </button>
                    
                    {/* DELETE BUTTON */}
                    {workspaces.length > 1 && activeWorkspaceId !== ws.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if(confirm(`Delete "${ws.title}"?`)) deleteWorkspace(ws.id);
                        }}
                        className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Stats Footer - STICKY AT BOTTOM OF SIDEBAR */}
        <div className="p-4 border-t border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-black/20 flex-shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
              <PieChart size={18} />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Progress</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{percentage}% Complete</p>
            </div>
          </div>
          <div className="h-1.5 w-full bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-[10px] text-gray-400 mt-2 text-center">
            {doneQs} / {totalQs} Questions Solved
          </p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;