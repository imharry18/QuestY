'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSheetStore } from '@/store/useSheetStore';
import { Download, Upload, Moon, Sun, LayoutGrid, Github, Menu, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const Navbar = () => {
  // Grab workspaces (for export) and importWorkspaces (for import)
  const { workspaces, importWorkspaces, toggleSidebar } = useSheetStore();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Hidden input ref
  const fileInputRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // EXPORT ALL WORKSPACES
  const handleExport = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(workspaces, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `questy_full_backup_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      toast.success("Full Backup Exported", { description: "All workspaces saved successfully." });
    } catch (error) {
      toast.error("Export Failed");
    }
  };

  // TRIGGER IMPORT
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // HANDLE FILE SELECTION
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        importWorkspaces(json); // Call store action
        toast.success("Import Successful", { description: "Your workspaces have been restored." });
      } catch (error) {
        console.error(error);
        toast.error("Import Failed", { description: "Invalid file format." });
      }
    };
    reader.readAsText(file);
    // Reset input so same file can be selected again if needed
    e.target.value = null; 
  };

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 border-b",
        isScrolled 
          ? "bg-white/80 dark:bg-black/80 backdrop-blur-md border-gray-200 dark:border-white/10" 
          : "bg-transparent border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20 transition-transform group-hover:scale-105">
              <LayoutGrid className="h-5 w-5 text-white" />
            </div>
            <Link href="/" className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
              QuestY
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10 transition-colors"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            )}

            <div className="h-4 w-[1px] bg-gray-200 dark:bg-white/10" />

            {/* IMPORT BUTTON */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="application/json" 
              className="hidden" 
            />
            <button 
              className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              onClick={handleImportClick}
            >
              <Upload size={16} />
              Import
            </button>

            <button 
              onClick={handleExport}
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gray-900 dark:bg-white px-5 py-2 text-sm font-medium text-white dark:text-black transition-all duration-300 hover:bg-gray-700 dark:hover:bg-gray-200 hover:shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] active:scale-95"
            >
              <span>Export All</span>
              <Download className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </button>
          </div>

          <div className="md:hidden flex items-center gap-4">
             {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 rounded-md"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            )}
            
            <button 
              onClick={toggleSidebar}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-md transition-colors"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;