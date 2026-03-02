'use client';

import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import {
  ArrowLeft, Folder, CheckCircle2, Play, FileText, Zap, ChevronRight, BarChart3, BookOpen
} from 'lucide-react';
import Link from 'next/link';
import { useQuest } from '../../context/QuestContext';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function SubjectPage() {
  const { id } = useParams();
  const { data, isLoaded } = useQuest();

  if (!isLoaded) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-12 h-12 bg-white/10 rounded-xl" />
        <p className="text-sm font-bold text-white/40 uppercase tracking-widest">Loading Topics...</p>
      </div>
    </div>
  );

  const subject = data.subjects.find(s => s.id === id);
  if (!subject) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white">
      <p className="text-white/40">Subject not found.</p>
    </div>
  );

  const topics = data.topics?.[id] || [];
  const completedMap = data.completedTopics?.[id] || {};
  const completedCount = Object.keys(completedMap).length;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* Ambient glow */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[400px] bg-blue-600/5 blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[400px] h-[300px] bg-purple-600/5 blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 md:px-12 py-12">
        {/* Breadcrumb */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-white/30 hover:text-white transition-colors mb-12 group text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Dashboard
          <ChevronRight className="w-3 h-3 text-white/20" />
          <span className="text-white/60">{subject.name}</span>
        </Link>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <p className="text-[11px] font-bold text-white/20 uppercase tracking-[0.3em] mb-3">Subject</p>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">{subject.name}</h1>
            </div>
            <div className="flex flex-col items-start md:items-end gap-3">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-white/40">
                  <BarChart3 className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium">{subject.progress}% Complete</span>
                </div>
                <div className="flex items-center gap-2 text-white/40">
                  <BookOpen className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-medium">{topics.length} Topics</span>
                </div>
              </div>
              {/* Progress bar */}
              <div className="w-48 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${subject.progress}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Topic completion summary */}
          {topics.length > 0 && (
            <div className="flex items-center gap-4 p-4 premium-glass border border-white/5 w-fit">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-white/20 uppercase tracking-wider mb-0.5">Topics Completed</p>
                <p className="text-xl font-bold">{completedCount} <span className="text-white/20 text-sm font-normal">/ {topics.length}</span></p>
              </div>
            </div>
          )}
        </motion.header>

        {/* Topic Folder Grid */}
        {topics.length === 0 ? (
          <div className="text-center py-24 text-white/20">
            <Folder className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-bold">No topics yet</p>
            <p className="text-sm mt-2">Topics will be added soon.</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {topics.map((topic) => {
              const isDone = !!completedMap[topic.id];
              return (
                <motion.div key={topic.id} variants={cardVariants}>
                  <Link href={`/subject/${id}/topic/${topic.id}`}>
                    <div className={`relative group premium-glass border transition-all duration-300 hover:border-white/15 hover:bg-white/[0.06] cursor-pointer overflow-hidden ${isDone ? 'border-green-500/20' : 'border-white/5'}`}>
                      {/* Done indicator line */}
                      {isDone && (
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500/60 to-emerald-500/60" />
                      )}

                      <div className="p-6">
                        {/* Top row */}
                        <div className="flex items-start justify-between mb-5">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${isDone ? 'bg-green-500/10' : 'bg-white/5'}`}>
                            {isDone
                              ? <CheckCircle2 className="w-6 h-6 text-green-400" />
                              : <Folder className="w-6 h-6 text-white/40" />
                            }
                          </div>
                          <ChevronRight className="w-4 h-4 text-white/15 group-hover:text-white/40 group-hover:translate-x-1 transition-all" />
                        </div>

                        {/* Topic name */}
                        <h3 className="text-lg font-bold tracking-tight mb-4 group-hover:text-white transition-colors">
                          {topic.name}
                        </h3>

                        {/* Resource pills */}
                        <div className="flex flex-wrap gap-2">
                          {topic.items?.filter(it => it.type === 'video').length > 0 && (
                            <Pill icon={<Play className="w-3 h-3" />} count={topic.items.filter(it => it.type === 'video').length} label="Videos" color="text-red-400" bg="bg-red-500/10" />
                          )}
                          {topic.items?.filter(it => it.type === 'problem').length > 0 && (
                            <Pill icon={<Zap className="w-3 h-3" />} count={topic.items.filter(it => it.type === 'problem').length} label="Problems" color="text-yellow-400" bg="bg-yellow-500/10" />
                          )}
                          {topic.items?.filter(it => it.type === 'note').length > 0 && (
                            <Pill icon={<FileText className="w-3 h-3" />} count={topic.items.filter(it => it.type === 'note').length} label="Notes" color="text-blue-400" bg="bg-blue-500/10" />
                          )}
                          {topic.items?.filter(it => it.type === 'quiz').length > 0 && (
                            <Pill icon={<Zap className="w-3 h-3" />} count={topic.items.filter(it => it.type === 'quiz').length} label="Q&A" color="text-purple-400" bg="bg-purple-500/10" />
                          )}
                        </div>
                      </div>

                      {/* Bottom status */}
                      <div className={`px-6 py-3 border-t text-[11px] font-bold uppercase tracking-wider ${isDone ? 'border-green-500/10 text-green-400/60' : 'border-white/5 text-white/15'}`}>
                        {isDone ? '✓ Completed' : 'Click to Open →'}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}

function Pill({ icon, count, label, color, bg }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${color} ${bg}`}>
      {icon}{count} {label}
    </span>
  );
}
