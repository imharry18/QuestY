'use client';

import React from 'react';
import Link from 'next/link';
import { useSheetStore } from '@/store/useSheetStore';

const Navbar = () => {
  // Access the data from your store
  const { sheetData } = useSheetStore();

  // Handle the JSON export
  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sheetData, null, 2));
    
    // Create a temporary link to trigger the download
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "sheet_data.json");
    document.body.appendChild(downloadAnchorNode); // Required for Firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-800 text-white border-b border-gray-700">
      {/* Brand / Logo */}
      <div className="text-xl font-bold">
        <Link href="/">Codolio</Link>
      </div>

      {/* Export Button */}
      <div className="flex gap-4">
        <button 
          onClick={handleExport}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition font-medium"
        >
          Export JSON
        </button>
      </div>
    </nav>
  );
};

export default Navbar;