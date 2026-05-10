'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { ArrowLeft, ChevronRight, BookOpen, Clock } from 'lucide-react';
import Link from 'next/link';
import { useQuest } from '../../../../context/QuestContext';

/* ─────────────────────────────────────────────
   CONTENT BLOCK RENDERER
───────────────────────────────────────────── */
function ContentBlock({ block, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: 'easeOut' }}
    >
      {block.type === 'heading' && (
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mt-12 mb-4 text-white first:mt-0">
          {block.text}
        </h2>
      )}
      {block.type === 'paragraph' && (
        <p className="text-white/65 leading-[1.85] text-[17px] mb-6">
          {block.text}
        </p>
      )}
      {block.type === 'code' && (
        <div className="mb-6 rounded-xl overflow-hidden border border-white/8">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-white/4 border-b border-white/5">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/50" />
            <span className="ml-2 text-[11px] font-bold text-white/20 uppercase tracking-widest">Code</span>
          </div>
          <pre className="p-5 overflow-x-auto text-sm leading-relaxed font-mono text-green-300/80 bg-black/40">
            <code>{block.text}</code>
          </pre>
        </div>
      )}
      {block.type === 'image' && (
        <div className="mb-8 rounded-xl overflow-hidden border border-white/8">
          <img
            src={block.url}
            alt={block.alt || 'Note image'}
            className="w-full object-cover"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          {block.alt && (
            <p className="text-center text-xs text-white/25 py-3 bg-white/2 font-medium">{block.alt}</p>
          )}
        </div>
      )}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   NOTES PAGE
───────────────────────────────────────────── */
export default function NotesPage() {
  const { subjectId, topicId, noteId } = useParams();
  const { data, isLoaded } = useQuest();
  const [readProgress, setReadProgress] = useState(0);
  const contentRef = useRef(null);

  // Read progress tracker
  useEffect(() => {
    const onScroll = () => {
      const el = contentRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY - el.offsetTop + window.innerHeight;
      setReadProgress(Math.min(100, Math.max(0, (scrolled / (el.scrollHeight)) * 100)));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!isLoaded) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-12 h-12 bg-white/10 rounded-xl" />
        <p className="text-sm font-bold text-white/40 uppercase tracking-widest">Loading Notes...</p>
      </div>
    </div>
  );

  const subject = data.subjects.find(s => s.id === subjectId);
  const topics = data.topics?.[subjectId] || [];
  const topic = topics.find(t => t.id === topicId);
  const note = topic?.items?.filter(it => it.type === 'note').find(n => n.id === noteId);

  if (!subject || !topic || !note) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white">
      <p className="text-white/40">Note not found.</p>
    </div>
  );

  const estimatedReadTime = Math.max(1, Math.ceil(
    note.content.filter(b => b.type === 'paragraph').reduce((acc, b) => acc + b.text.split(' ').length, 0) / 200
  ));

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/40 selection:text-white">
      {/* Reading progress bar — fixed at top */}
      <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-white/5">
        <motion.div
          animate={{ width: `${readProgress}%` }}
          transition={{ duration: 0.1 }}
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
        />
      </div>

      {/* Ambient */}
      <div className="fixed top-0 left-1/3 w-[700px] h-[500px] bg-blue-600/4 blur-[180px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 md:px-12 py-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-white/25 mb-12 flex-wrap">
          <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
          <ChevronRight className="w-3 h-3 flex-shrink-0" />
          <Link href={`/subject/${subjectId}`} className="hover:text-white transition-colors">{subject.name}</Link>
          <ChevronRight className="w-3 h-3 flex-shrink-0" />
          <Link href={`/subject/${subjectId}/topic/${topicId}`} className="hover:text-white transition-colors">{topic.name}</Link>
          <ChevronRight className="w-3 h-3 flex-shrink-0" />
          <span className="text-white/50">{note.name}</span>
        </div>

        {/* Note Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-14"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex items-center gap-3 text-white/30 text-sm">
              <span className="font-medium">{subject.name}</span>
              <span>·</span>
              <span>{topic.name}</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6 leading-tight">
            {note.name}
          </h1>

          <div className="flex items-center gap-5 text-[13px] text-white/25 pb-8 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{estimatedReadTime} min read</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>{note.content.length} sections</span>
            </div>
          </div>
        </motion.header>

        {/* Note Content */}
        <article ref={contentRef} className="prose-like">
          {note.content.map((block, i) => (
            <ContentBlock key={i} block={block} index={i} />
          ))}
        </article>

        {/* Footer navigation */}
        <div className="mt-20 pt-8 border-t border-white/5 flex items-center justify-between">
          <Link
            href={`/subject/${subjectId}/topic/${topicId}`}
            className="inline-flex items-center gap-2 text-white/30 hover:text-white transition-colors text-sm font-medium group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to {topic.name}
          </Link>
          <div className="text-[11px] font-bold text-white/15 uppercase tracking-widest">
            {readProgress >= 80 ? '✓ Read' : `${Math.round(readProgress)}% read`}
          </div>
        </div>
      </div>
    </div>
  );
}
