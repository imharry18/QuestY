'use client';

import { motion } from 'framer-motion';
import { 
  Flame, CheckCircle2, TrendingUp, Calendar, Book, Trophy, Search, Bell, Info, ChevronDown, FileText
} from 'lucide-react';
import Link from 'next/link';

import { useQuest } from '../context/QuestContext';

export default function Dashboard() {
  const { data, isLoaded } = useQuest();

  if (!isLoaded) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-12 h-12 bg-white/10 rounded-xl"></div>
        <p className="text-sm font-bold text-white/40 uppercase tracking-widest">Entering Battlefield...</p>
      </div>
    </div>
  );

  const { stats, subjects, activity, user } = data;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 premium-glass border-b border-white/5 py-4 px-8 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-black font-bold">Q</div>
            <span className="text-xl font-bold tracking-tighter">QuestY</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/dashboard" className="text-sm font-bold text-white">Dashboard</Link>
            <Link href="#" className="text-sm font-medium text-white/40 hover:text-white transition-colors">Subjects</Link>
            <Link href="#" className="text-sm font-medium text-white/40 hover:text-white transition-colors">Resources</Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-6">
          <Bell className="w-5 h-5 text-white/40 hover:text-white cursor-pointer transition-colors" />
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full border border-white/20 cursor-pointer overflow-hidden">
            <img src={user.avatar} alt="Avatar" className="w-full h-full" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Welcome Back 👋</h1>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {stats.map((stat) => {
              const Icon = { Flame, CheckCircle2, Trophy, FileText }[stat.icon] || Flame;
              return (
                <motion.div
                  key={stat.id}
                  whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.05)' }}
                  className="premium-glass p-6 border border-white/5 flex items-center justify-between group"
                >
                  <div>
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1">{stat.label}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold tracking-tighter">{stat.value}</span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </motion.div>
              );
            })}
          </div>
          <div className="grid grid-cols-1 gap-8 mb-16">
            {/* Heatmap Column (Full Width) */}
            <div className="w-full">
              <section className="premium-glass p-6 h-full flex flex-col justify-between">
                {(() => {
                  // Build a proper LeetCode-style continuous calendar for the last ~26 weeks
                  const today = new Date();
                  const totalDays = 26 * 7; // ~6 months
                  const startDate = new Date(today);
                  startDate.setDate(today.getDate() - totalDays + 1);
                  // Rewind to the previous Sunday so columns start on Sunday
                  const dayOfWeek = startDate.getDay(); // 0=Sun
                  startDate.setDate(startDate.getDate() - dayOfWeek);

                  // Build weeks array: each week is an array of 7 day-objects
                  const weeks = [];
                  let cur = new Date(startDate);
                  while (cur <= today) {
                    const week = [];
                    for (let d = 0; d < 7; d++) {
                      const dayIndex = Math.floor((new Date(cur) - new Date(startDate)) / 86400000);
                      week.push({ date: new Date(cur), val: activity[dayIndex] ?? 0, future: cur > today });
                      cur.setDate(cur.getDate() + 1);
                    }
                    weeks.push(week);
                  }

                  // Determine where each month label should appear (first week of each month)
                  const monthLabels = {};
                  weeks.forEach((week, wIdx) => {
                    const firstVisible = week.find(d => !d.future);
                    if (firstVisible) {
                      const m = firstVisible.date.getMonth();
                      const y = firstVisible.date.getFullYear();
                      const key = `${y}-${m}`;
                      if (!Object.values(monthLabels).some(v => v.key === key)) {
                        monthLabels[wIdx] = { label: firstVisible.date.toLocaleString('default', { month: 'short' }), key };
                      }
                    }
                  });

                  return (
                    <div>
                      <div className="flex justify-end gap-2 text-[9px] text-white/20 items-center font-bold mb-4">
                        <span>LESS</span>
                        {[1,2,3,4,5].map(i => <div key={i} className="w-2 h-2 rounded-[2px]" style={{ backgroundColor: `rgba(34, 197, 94, ${i * 0.2})` }}></div>)}
                        <span>MORE</span>
                      </div>

                      {/* Month labels row */}
                      <div className="flex w-full mb-1">
                        {weeks.map((_, wIdx) => (
                          <div key={wIdx} className="flex-1 text-[9px] font-bold text-white/25 uppercase overflow-hidden">
                            {monthLabels[wIdx]?.label || ''}
                          </div>
                        ))}
                      </div>

                      {/* Grid: 7 rows × N week-columns */}
                      <div className="flex w-full gap-1">
                        {weeks.map((week, wIdx) => (
                          <div key={wIdx} className="flex-1 flex flex-col gap-1">
                            {week.map((day, dIdx) => (
                              <div
                                key={dIdx}
                                title={`${day.date.toDateString()}: ${day.future ? '—' : day.val + ' contributions'}`}
                                className="w-full aspect-square rounded-[2px] cursor-pointer transition-all hover:ring-1 hover:ring-white/40"
                                style={{
                                  backgroundColor: day.future
                                    ? 'transparent'
                                    : day.val > 0
                                    ? `rgba(34, 197, 94, ${Math.min(day.val * 0.25 + 0.2, 1)})`
                                    : 'rgba(255,255,255,0.06)'
                                }}
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                <div className="mt-5 pt-4 border-t border-white/5 flex justify-center items-center text-[9px] text-white/10 font-bold uppercase tracking-[0.2em]">
                  <span>Activity tracked for last 6 months</span>
                </div>
              </section>
            </div>
          </div>

          {/* Subject Grid */}
          <section>
            <div className="flex justify-between items-end mb-8">
              <div>
                <h3 className="text-2xl font-bold mb-2">My Learning Paths</h3>
                <p className="text-white/40">Track your progress across core subjects.</p>
              </div>
              <button className="text-sm font-bold hover:text-blue-400 transition-colors">View All Subjects →</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {subjects.map((subject) => (
                <Link key={subject.name} href={`/subject/${subject.id}`}>
                  <motion.div
                    whileHover={{ y: -8, backgroundColor: 'rgba(255,255,255,0.05)' }}
                    className="premium-glass p-6 group cursor-pointer border border-white/5"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Book className="w-5 h-5 text-white/60" />
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-white/20 block uppercase tracking-tighter">SOLVED</span>
                        <span className="text-sm font-bold text-white">{subject.solved}</span>
                      </div>
                    </div>
                    <h4 className="text-lg font-bold mb-4 tracking-tight">{subject.name}</h4>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mb-4">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${subject.progress}%` }}
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-400"
                      ></motion.div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/40">{subject.progress}% Complete</span>
                      <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <TrendingUp className="w-3 h-3" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
