'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, FileJson, Play, Zap, FileText, 
  Trophy, ArrowLeft, Terminal, AlertCircle, Save, Check, X
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuest } from '../../../context/QuestContext';

export default function TopicAdminPage() {
  const { subjectId, topicId } = useParams();
  const { data, importItems, deleteItem, isLoaded } = useQuest();
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  // Individual Add State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ type: 'video', name: '', url: '', difficulty: 'Medium' });

  if (!isLoaded) return <div className="p-20 text-center text-white/40">Loading Topic...</div>;

  const subject = data.subjects.find(s => s.id === subjectId);
  const topic = (data.topics[subjectId] || []).find(t => t.id === topicId);

  if (!subject || !topic) return <div className="p-20 text-center text-white/40">Topic not found.</div>;

  const handleImport = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      const itemsToImport = Array.isArray(parsed) ? parsed : [parsed];
      importItems(subjectId, topicId, itemsToImport);
      setJsonInput('');
      setError('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      setError('Invalid JSON: ' + e.message);
    }
  };

  const handleAddIndividual = () => {
    if (!newItem.name) return setError('Name is required');
    
    const item = { ...newItem };
    // For Quiz/Note, we'll initialize with empty arrays if added manually
    if (item.type === 'quiz') item.questions = [];
    if (item.type === 'note') item.content = [];
    
    importItems(subjectId, topicId, [item]);
    setNewItem({ type: 'video', name: '', url: '', difficulty: 'Medium' });
    setShowAddForm(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleDeleteItem = (itemId) => {
    if (confirm('Remove this item?')) {
      deleteItem(subjectId, topicId, itemId);
    }
  };

  const TYPE_ICONS = {
    video: <Play className="w-4 h-4 text-red-400" />,
    problem: <Zap className="w-4 h-4 text-yellow-400" />,
    note: <FileText className="w-4 h-4 text-blue-400" />,
    quiz: <Trophy className="w-4 h-4 text-purple-400" />
  };

  const SCHEMA_EXAMPLES = {
    FullList: `[
  { "type": "video", "name": "Video 1", "url": "..." },
  { "type": "quiz", "name": "Quick Quiz", "questions": [...] },
  { "type": "problem", "name": "Hard Problem", "difficulty": "Hard", "url": "..." },
  { "type": "note", "name": "Topic Summary", "content": [...] }
]`,
    Note: `{
  "type": "note",
  "name": "Arrays Overview",
  "content": [
    { "type": "heading", "text": "What is an Array?" },
    { "type": "paragraph", "text": "An array is a linear data structure..." },
    { "type": "code", "text": "int arr[] = {1, 2, 3};" },
    { "type": "image", "url": "https://...", "alt": "Array diagram" }
  ]
}`,
    Quiz: `{
  "type": "quiz",
  "name": "Basics of DS",
  "questions": [
    {
      "question": "What is the time complexity of Array access?",
      "options": ["O(n)", "O(1)", "O(log n)", "O(n^2)"],
      "correct": 1
    }
  ]
}`
  };


  return (
    <>
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
            style={{ backgroundColor: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(20px)' }}
          >
            <div className="w-full max-w-4xl h-[80vh] flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-blue-400" />
                  <h2 className="text-2xl font-bold">JSON Structure Guide</h2>
                </div>
                <button 
                  onClick={() => setShowHelp(false)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-white/50" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pr-4 space-y-10 custom-scrollbar">
                <div>
                  <h3 className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-4">1. Bulk Import (Array)</h3>
                  <p className="text-sm text-white/40 mb-4">Wrap multiple items in brackets `[]` to import everything at once.</p>
                  <pre className="p-5 rounded-xl bg-white/[0.03] border border-white/5 text-xs font-mono text-green-300/70 overflow-x-auto">
                    {SCHEMA_EXAMPLES.FullList}
                  </pre>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-purple-400 uppercase tracking-widest mb-4">2. Quiz Structure</h3>
                  <pre className="p-5 rounded-xl bg-white/[0.03] border border-white/5 text-xs font-mono text-purple-300/70 overflow-x-auto">
                    {SCHEMA_EXAMPLES.Quiz}
                  </pre>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-4">3. Note Structure</h3>
                  <p className="text-sm text-white/40 mb-4">Note content uses blocks: heading, paragraph, code, or image.</p>
                  <pre className="p-5 rounded-xl bg-white/[0.03] border border-white/5 text-xs font-mono text-blue-300/70 overflow-x-auto">
                    {SCHEMA_EXAMPLES.Note}
                  </pre>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-black text-white p-8 md:p-12">
      <div className="max-w-5xl mx-auto">
        <Link href={`/admin/${subjectId}`} className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-12 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Subject
        </Link>

        <header className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-white/40 uppercase tracking-widest border border-white/5">{subject.name}</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Item Management: {topic.name}</h1>
          <div className="flex items-center justify-between">
            <p className="text-white/40">Add videos, problems, notes, and quizzes using JSON import.</p>
            <button 
              onClick={() => setShowHelp(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold hover:bg-blue-500/20 transition-all"
            >
              <AlertCircle className="w-4 h-4" /> View Schema Guide
            </button>
          </div>
        </header>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: JSON Import */}
          <section>
            <div className="premium-glass p-8 border border-white/5 sticky top-12">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Terminal className="w-5 h-5 text-green-400" />
                  <h2 className="text-xl font-bold">JSON Import</h2>
                </div>
                <button 
                  onClick={() => setJsonInput(JSON.stringify([
                    { type: "video", name: "Tutorial 1", url: "https://..." },
                    { type: "problem", name: "Problem 1", difficulty: "Medium", url: "https://..." }
                  ], null, 2))}
                  className="text-[10px] font-bold text-white/20 hover:text-white transition-colors uppercase tracking-widest"
                >
                  Load Example
                </button>
              </div>

              <textarea 
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='Paste your items JSON here... [ { "type": "video", "name": "...", ... }, ... ]'
                className="w-full h-80 bg-black/50 border border-white/10 rounded-xl p-4 font-mono text-sm focus:outline-none focus:border-white/30 transition-all mb-4 resize-none"
              />

              {error && (
                <div className="flex items-center gap-2 text-red-400 text-xs mb-4 bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                  <AlertCircle className="w-4 h-4" /> {error}
                </div>
              )}

              {success && (
                <div className="flex items-center gap-2 text-green-400 text-xs mb-4 bg-green-400/10 p-3 rounded-lg border border-green-400/20">
                  <Check className="w-4 h-4" /> Items imported successfully!
                </div>
              )}

              <button 
                onClick={handleImport}
                className="w-full bg-white text-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/90 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]"
              >
                <Save className="w-5 h-5" /> Import & Append Items
              </button>
            </div>
          </section>

          {/* Right: Current Items List */}
          <section>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold">Current Items ({topic.items?.length || 0})</h2>
              <button 
                onClick={() => setShowAddForm(!showAddForm)}
                className={`p-3 rounded-xl transition-all duration-300 flex items-center gap-2 font-bold text-xs
                  ${showAddForm ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.1)]'}`}
              >
                {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {showAddForm ? 'Cancel' : 'Add Item'}
              </button>
            </div>

            <AnimatePresence>
              {showAddForm && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mb-8"
                >
                  <div className="premium-glass p-6 border border-white/10 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest block mb-2">Type</label>
                        <select 
                          value={newItem.type}
                          onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30 text-white [&>option]:bg-black [&>option]:text-white"
                        >
                          <option value="video">Video</option>
                          <option value="problem">Problem</option>
                          <option value="note">Note</option>
                          <option value="quiz">Quiz</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest block mb-2">Name</label>
                        <input 
                          type="text" 
                          value={newItem.name}
                          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                          placeholder="e.g., Intro to Arrays"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30"
                        />
                      </div>
                    </div>

                    {(newItem.type === 'video' || newItem.type === 'problem') && (
                      <div>
                        <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest block mb-2">URL / Link</label>
                        <input 
                          type="text" 
                          value={newItem.url}
                          onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
                          placeholder="https://..."
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30"
                        />
                      </div>
                    )}

                    {newItem.type === 'problem' && (
                      <div>
                        <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest block mb-2">Difficulty</label>
                        <div className="flex gap-2">
                          {['Easy', 'Medium', 'Hard'].map(d => (
                            <button
                              key={d}
                              onClick={() => setNewItem({ ...newItem, difficulty: d })}
                              className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all
                                ${newItem.difficulty === d ? 'bg-white text-black border-white' : 'bg-white/5 text-white/40 border-white/5 hover:border-white/20'}`}
                            >
                              {d}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <button 
                      onClick={handleAddIndividual}
                      className="w-full bg-white text-black py-3 rounded-xl font-bold text-sm hover:bg-white/90 transition-all mt-4"
                    >
                      Save Item to Topic
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-4">
              {topic.items?.length === 0 ? (
                <div className="text-center py-20 bg-white/[0.02] border border-dashed border-white/10 rounded-2xl text-white/20">
                  No items in this topic yet.
                </div>
              ) : (
                topic.items.map((item, idx) => (
                  <div 
                    key={item.id} 
                    className="premium-glass p-5 border border-white/5 flex items-center gap-4 group"
                  >
                    <span className="w-6 text-center text-xs font-bold text-white/10">{idx + 1}</span>
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                      {TYPE_ICONS[item.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm truncate">{item.name}</h4>
                      <p className="text-[10px] text-white/20 uppercase tracking-widest font-bold mt-1">{item.type}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-2 rounded-lg text-white/10 hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
      </div>
    </>
  );
}
