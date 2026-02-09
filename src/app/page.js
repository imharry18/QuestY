'use client';

import SheetContainer from '@/components/Sheet/SheetContainer';
import Sidebar from '@/components/ui/Sidebar';

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 bg-transparent">
        <div className="animate-in fade-in zoom-in-95 duration-500 ease-out">
          <SheetContainer />
        </div>
      </main>
    </div>
  );
}