'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'next/navigation';
import {
  Play, ExternalLink, FileText, Zap, CheckCircle2, ChevronRight,
  Check, X, Trophy, RotateCcw, Folder, ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { useQuest } from '../../../../context/QuestContext';

/* ── difficulty badge styles ── */
const DIFF = {
  Easy:   { text: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/20'  },
  Medium: { text: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
  Hard:   { text: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/20'    },
};

/* ── type meta (icon, colors) ── */
const TYPE_META = {
  video:   { label: 'VIDEO',   iconBg: 'bg-red-500/10',    iconColor: 'text-red-400',    borderHover: 'hover:border-red-500/20'    },
  problem: { label: 'PROBLEM', iconBg: 'bg-yellow-500/10', iconColor: 'text-yellow-400', borderHover: 'hover:border-yellow-500/20' },
  note:    { label: 'NOTES',   iconBg: 'bg-blue-500/10',   iconColor: 'text-blue-400',   borderHover: 'hover:border-blue-500/20'   },
  quiz:    { label: 'QUIZ',    iconBg: 'bg-purple-500/10', iconColor: 'text-purple-400', borderHover: 'hover:border-purple-500/20' },
};

function TypeIcon({ type, done }) {
  const meta = TYPE_META[type];
  if (done) return (
    <div className="w-10 h-10 rounded-xl bg-green-500/15 flex items-center justify-center flex-shrink-0">
      <Check className="w-4 h-4 text-green-400" />
    </div>
  );
  return (
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${meta.iconBg}`}>
      {type === 'video'   && <Play      className={`w-4 h-4 ml-0.5 ${meta.iconColor}`} />}
      {type === 'problem' && <Zap       className={`w-4 h-4 ${meta.iconColor}`} />}
      {type === 'note'    && <FileText  className={`w-4 h-4 ${meta.iconColor}`} />}
      {type === 'quiz'    && <Trophy    className={`w-4 h-4 ${meta.iconColor}`} />}
    </div>
  );
}

/* ── per-item Complete toggle button ── */
function CompleteBtn({ done, onToggle }) {
  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggle(); }}
      title={done ? 'Mark as incomplete' : 'Mark as complete'}
      className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
        done
          ? 'bg-green-500 border-green-500 text-white'
          : 'border-white/15 bg-transparent hover:border-white/40 text-transparent hover:text-white/30'
      }`}
    >
      <Check className="w-3.5 h-3.5" strokeWidth={3} />
    </button>
  );
}

/* ═══════════════════════════════════════
   QUIZ OVERLAY
═══════════════════════════════════════ */
function QuizOverlay({ questions, name, onClose, onComplete }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [phase, setPhase] = useState('question');

  const q = questions[current];
  const score = answers.filter(Boolean).length;

  const handleOption = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    const correct = idx === q.correct;
    setTimeout(() => {
      const newAnswers = [...answers, correct];
      if (current + 1 < questions.length) {
        setAnswers(newAnswers);
        setSelected(null);
        setCurrent(current + 1);
      } else {
        setAnswers(newAnswers);
        setPhase('result');
        onComplete(newAnswers);
      }
    }, 900);
  };

  const percent = phase === 'result' ? Math.round((score / questions.length) * 100) : 0;
  const grade   = percent >= 80 ? 'Excellent!' : percent >= 60 ? 'Good Job!' : 'Keep Practicing!';
  const gradeColor = percent >= 80 ? 'text-green-400' : percent >= 60 ? 'text-yellow-400' : 'text-red-400';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.96)', backdropFilter: 'blur(24px)' }}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
      >
        <X className="w-5 h-5 text-white/50" />
      </button>

      <AnimatePresence mode="wait">
        {phase === 'question' ? (
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.28 }}
            className="w-full max-w-xl"
          >
            {/* Progress header */}
            <div className="mb-8">
              <div className="flex justify-between text-[11px] font-bold text-white/25 uppercase tracking-widest mb-3">
                <span>Question {current + 1} of {questions.length}</span>
                <span>{score} correct</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${(current / questions.length) * 100}%` }}
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                />
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-10 leading-snug">
              {q.question}
            </h2>

            <div className="space-y-3">
              {q.options.map((opt, idx) => {
                let cls = 'border-white/8 bg-white/3 hover:border-white/20 hover:bg-white/8 cursor-pointer';
                if (selected !== null) {
                  if (idx === q.correct)                       cls = 'border-green-500/60 bg-green-500/15 text-green-300';
                  else if (idx === selected && idx !== q.correct) cls = 'border-red-500/60 bg-red-500/15 text-red-300';
                  else                                         cls = 'border-white/5 bg-white/2 opacity-40';
                }
                return (
                  <motion.button
                    key={idx}
                    whileHover={selected === null ? { x: 6 } : {}}
                    whileTap={selected === null ? { scale: 0.98 } : {}}
                    onClick={() => handleOption(idx)}
                    disabled={selected !== null}
                    className={`w-full text-left p-4 rounded-xl border font-medium transition-all duration-200 flex items-center gap-4 ${cls}`}
                  >
                    <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1">{opt}</span>
                    {selected !== null && idx === q.correct && (
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm text-center"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
              <Trophy className={`w-12 h-12 ${gradeColor}`} />
            </div>
            <h2 className={`text-5xl font-bold mb-2 ${gradeColor}`}>{percent}%</h2>
            <p className="text-white/40 text-lg mb-1">{grade}</p>
            <p className="text-white/20 text-sm mb-10">{score} / {questions.length} correct</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => { setCurrent(0); setSelected(null); setAnswers([]); setPhase('question'); }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/8 hover:bg-white/12 font-bold text-sm transition-colors"
              >
                <RotateCcw className="w-4 h-4" /> Retake
              </button>
              <button
                onClick={onClose}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-bold text-sm hover:bg-white/90 transition-colors"
              >
                Done
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ═══════════════════════════════════════
   MAIN TOPIC PAGE
═══════════════════════════════════════ */
export default function TopicPage() {
  const { id, topicId } = useParams();
  const {
    data, isLoaded,
    markItemComplete, unmarkItemComplete,
    markTopicComplete, unmarkTopicComplete,
    addQuiz,
  } = useQuest();

  const [quizOpen, setQuizOpen] = useState(false);
  const [tab, setTab] = useState('learning'); // 'learning' | 'all'
  const [activeQuiz, setActiveQuiz] = useState(null);

  const subject = data.subjects.find(s => s.id === id);
  const topic   = (data.topics?.[id] || []).find(t => t.id === topicId);

  // ── Auto-complete topic when all items are checked ──
  useEffect(() => {
    if (!isLoaded || !topic) return;
    const doneMap = (data.completedItems?.[id] || {})[topicId] || {};
    const allItems = (topic.items || []).map(it => `${it.type}_${it.id}`);
    
    const allChecked = allItems.length > 0 && allItems.every(k => doneMap[k]);
    const topicDoneNow = !!(data.completedTopics?.[id]?.[topicId]);
    if (allChecked && !topicDoneNow) markTopicComplete(id, topicId);
    if (!allChecked && topicDoneNow)  unmarkTopicComplete(id, topicId);
  }, [data.completedItems, isLoaded, topic, id, topicId, markTopicComplete, unmarkTopicComplete]);

  if (!isLoaded) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-12 h-12 bg-white/10 rounded-xl" />
        <p className="text-sm font-bold text-white/40 uppercase tracking-widest">Loading Topic...</p>
      </div>
    </div>
  );

  if (!subject || !topic) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white">
      <p className="text-white/40">Topic not found.</p>
    </div>
  );

  const doneMap = (data.completedItems?.[id] || {})[topicId] || {};

  const isItemDone = (key) => !!doneMap[key];
  const toggleItem = (key) => {
    if (isItemDone(key)) unmarkItemComplete(id, topicId, key);
    else                 markItemComplete(id, topicId, key);
  };

  /* ── flat ordered list ── */
  const items = (topic.items || []).map(it => ({
    ...it,
    key: `${it.type}_${it.id}`,
    // quiz handling
    questions: it.type === 'quiz' ? it.questions : undefined,
    count: it.type === 'quiz' ? it.questions?.length : (it.type === 'note' ? it.content?.length : undefined)
  }));

  const completedCount = items.filter(it => isItemDone(it.key)).length;
  const allDone = items.length > 0 && completedCount === items.length;
  const topicDone = !!(data.completedTopics?.[id]?.[topicId]);

  // Items shown depend on active tab
  const displayItems = tab === 'learning'
    ? items.filter(it => !isItemDone(it.key))
    : items;

  const handleQuizComplete = (answers) => {
    answers.forEach(correct => addQuiz(correct));
    if (activeQuiz && !isItemDone(activeQuiz.key)) markItemComplete(id, topicId, activeQuiz.key);
  };

  return (
    <>
      <AnimatePresence>
        {activeQuiz && (
          <QuizOverlay
            questions={activeQuiz.questions}
            name={activeQuiz.name}
            onClose={() => setActiveQuiz(null)}
            onComplete={handleQuizComplete}
          />
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-black text-white selection:bg-white/10">
        {/* ambient */}
        <div className="fixed top-0 right-0 w-[600px] h-[500px] bg-purple-600/4 blur-[180px] pointer-events-none" />
        <div className="fixed bottom-0 left-0 w-[400px] h-[300px] bg-blue-600/4 blur-[140px] pointer-events-none" />

        <div className="max-w-3xl mx-auto px-6 md:px-12 py-12">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-white/25 mb-12 flex-wrap">
            <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/subject/${id}`} className="hover:text-white transition-colors">{subject.name}</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/60">{topic.name}</span>
          </div>

          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${allDone ? 'bg-green-500/15' : 'bg-white/5'}`}>
                {allDone
                  ? <CheckCircle2 className="w-7 h-7 text-green-400" />
                  : <Folder className="w-7 h-7 text-white/30" />
                }
              </div>
              <div>
                <p className="text-[11px] font-bold text-white/20 uppercase tracking-[0.3em] mb-2">{subject.name}</p>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">{topic.name}</h1>
              </div>
            </div>

            {/* Progress bar */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: items.length > 0 ? `${(completedCount / items.length) * 100}%` : '0%' }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
                />
              </div>
              <span className="text-xs font-bold text-white/30 flex-shrink-0">
                {completedCount} / {items.length} done
              </span>
            </div>
          </motion.header>

          {/* ── Tab switcher ── */}
          <div className="flex items-center gap-1 p-1 bg-white/4 rounded-xl w-fit mb-6 border border-white/5">
            {[
              { key: 'learning', label: 'Learning', count: items.filter(it => !isItemDone(it.key)).length },
              { key: 'all',      label: 'All',      count: items.length },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`relative px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
                  tab === t.key
                    ? 'bg-white text-black shadow-sm'
                    : 'text-white/35 hover:text-white/70'
                }`}
              >
                {t.label}
                <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
                  tab === t.key ? 'bg-black/10 text-black/50' : 'bg-white/8 text-white/30'
                }`}>
                  {t.count}
                </span>
              </button>
            ))}
          </div>

          {/* ── Item list ── */}
          {displayItems.length === 0 && tab === 'learning' ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-16 text-center"
            >
              <CheckCircle2 className="w-12 h-12 text-green-400/40 mx-auto mb-4" />
              <p className="text-white/30 font-bold">All items completed!</p>
              <button onClick={() => setTab('all')} className="mt-3 text-xs text-white/20 hover:text-white/50 transition-colors underline underline-offset-2">
                View all
              </button>
            </motion.div>
          ) : (
          <div className="space-y-3">
            {displayItems.map((item) => {
              // Use original index for serial number
              const idx = items.indexOf(item);
              const done = isItemDone(item.key);
              const meta = TYPE_META[item.type];

              /* ── QUIZ ITEM ── */
              if (item.type === 'quiz') {
                return (
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.045 }}
                    className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 cursor-pointer
                      ${done ? 'border-green-500/20 bg-green-500/5' : `border-white/5 bg-white/[0.02] hover:bg-purple-500/5 hover:border-purple-500/20`}`}
                    onClick={() => setActiveQuiz(item)}
                  >
                    {/* Serial number */}
                    <span className="w-7 text-center text-[13px] font-bold text-white/15 flex-shrink-0">{idx + 1}</span>

                    {/* Icon */}
                    <TypeIcon type="quiz" done={done} />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold transition-colors ${done ? 'text-white/50 line-through decoration-white/20' : 'text-white/85 group-hover:text-white'}`}>
                        {item.name}
                      </p>
                      <p className="text-xs text-white/25 mt-0.5">{item.count} multiple-choice questions</p>
                    </div>

                    {/* Type badge */}
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${meta.iconBg} ${meta.iconColor} flex-shrink-0`}>
                      {meta.label}
                    </span>

                    {/* Open quiz arrow */}
                    <ChevronRight className={`w-4 h-4 text-white/15 group-hover:text-purple-400 flex-shrink-0 transition-colors`} />

                    {/* Complete toggle */}
                    <CompleteBtn done={done} onToggle={() => toggleItem(item.key)} />
                  </motion.div>
                );
              }

              /* ── NOTE ITEM ── */
              if (item.type === 'note') {
                return (
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.045 }}
                    className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200
                      ${done ? 'border-green-500/20 bg-green-500/5' : `border-white/5 bg-white/[0.02] hover:bg-blue-500/5 hover:border-blue-500/20`}`}
                  >
                    <span className="w-7 text-center text-[13px] font-bold text-white/15 flex-shrink-0">{idx + 1}</span>
                    <TypeIcon type="note" done={done} />
                    <Link
                      href={`/notes/${id}/${topicId}/${item.id}`}
                      className="flex-1 min-w-0 flex items-center gap-3"
                    >
                      <div className="min-w-0">
                        <p className={`font-semibold transition-colors ${done ? 'text-white/50 line-through decoration-white/20' : 'text-white/85 group-hover:text-white'}`}>
                          {item.name}
                        </p>
                        <p className="text-xs text-white/25 mt-0.5">{item.content?.length || 0} sections</p>
                      </div>
                    </Link>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${meta.iconBg} ${meta.iconColor} flex-shrink-0`}>
                      {meta.label}
                    </span>
                    <Link href={`/notes/${id}/${topicId}/${item.id}`}>
                      <ChevronRight className="w-4 h-4 text-white/15 group-hover:text-blue-400 transition-colors flex-shrink-0" />
                    </Link>
                    <CompleteBtn done={done} onToggle={() => toggleItem(item.key)} />
                  </motion.div>
                );
              }

              /* ── VIDEO / PROBLEM ITEM (external link) ── */
              return (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.045 }}
                  className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200
                    ${done ? 'border-green-500/20 bg-green-500/5' : `border-white/5 bg-white/[0.02] ${meta.borderHover} hover:bg-white/[0.04]`}`}
                >
                  <span className="w-7 text-center text-[13px] font-bold text-white/15 flex-shrink-0">{idx + 1}</span>

                  <TypeIcon type={item.type} done={done} />

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-0 flex items-center gap-3"
                  >
                    <div className="min-w-0">
                      <p className={`font-semibold transition-colors ${done ? 'text-white/50 line-through decoration-white/20' : 'text-white/85 group-hover:text-white'}`}>
                        {item.name}
                      </p>
                    </div>
                  </a>

                  {/* difficulty badge for problems */}
                  {item.type === 'problem' && item.difficulty && (() => {
                    const ds = DIFF[item.difficulty] || DIFF.Easy;
                    return (
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border flex-shrink-0 ${ds.text} ${ds.bg} ${ds.border}`}>
                        {item.difficulty}
                      </span>
                    );
                  })()}

                  {/* type label for videos */}
                  {item.type === 'video' && (
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full flex-shrink-0 ${meta.iconBg} ${meta.iconColor}`}>
                      {meta.label}
                    </span>
                  )}

                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 text-white/15 group-hover:text-white/50 flex-shrink-0 transition-colors" />
                  </a>

                  <CompleteBtn done={done} onToggle={() => toggleItem(item.key)} />
                </motion.div>
              );
            })}
          </div>
          )}

          {/* ── Progress footer ── */}
          <div className="mt-14 pt-8 border-t border-white/5 flex items-center justify-between">
            <p className="text-[11px] font-bold text-white/20 uppercase tracking-widest">
              {completedCount} of {items.length} items completed
            </p>
            {allDone && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 text-[11px] font-bold text-green-400 uppercase tracking-widest"
              >
                <CheckCircle2 className="w-4 h-4" /> Topic Complete
              </motion.span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
