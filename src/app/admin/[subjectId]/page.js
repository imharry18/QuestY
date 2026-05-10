'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Folder, ChevronRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuest } from '../../context/QuestContext';

export default function SubjectAdminPage() {
  const { subjectId } = useParams();
  const { data, addTopic, deleteTopic, isLoaded } = useQuest();
  const [newTopicName, setNewTopicName] = useState('');

  if (!isLoaded) return <div className="p-20 text-center text-white/40">Loading Subject...</div>;

  const subject = data.subjects.find(s => s.id === subjectId);
  const topics = data.topics[subjectId] || [];

  if (!subject) return <div className="p-20 text-center text-white/40">Subject not found.</div>;

  const handleAddTopic = (e) => {
    e.preventDefault();
    if (newTopicName.trim()) {
      addTopic(subjectId, newTopicName);
      setNewTopicName('');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 md:p-12">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-12 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Admin
        </Link>

        <header className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Manage Topics: {subject.name}</h1>
          <p className="text-white/40">Create and organize learning paths for this subject.</p>
        </header>

        {/* Add Topic Section */}
        <section className="premium-glass p-8 border border-white/5 mb-12">
          <h2 className="text-xl font-bold mb-6">Create New Topic</h2>
          <form onSubmit={handleAddTopic} className="flex gap-4">
            <input 
              type="text" 
              value={newTopicName}
              onChange={(e) => setNewTopicName(e.target.value)}
              placeholder="Topic Name (e.g., Recursion, DP)" 
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 transition-all"
            />
            <button 
              type="submit"
              className="bg-white text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-white/90 transition-all"
            >
              <Plus className="w-5 h-5" /> Create Topic
            </button>
          </form>
        </section>

        {/* Topic List */}
        <div className="grid gap-4">
          {topics.length === 0 ? (
            <div className="text-center py-12 text-white/10 italic">No topics created yet.</div>
          ) : (
            topics.map((topic) => (
              <div 
                key={topic.id} 
                className="premium-glass p-6 border border-white/5 flex items-center justify-between group hover:bg-white/5 transition-all"
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                    <Folder className="w-6 h-6 text-white/40" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{topic.name}</h3>
                    <p className="text-xs text-white/20 uppercase tracking-widest font-bold">Items: {topic.items?.length || 0}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Link 
                    href={`/admin/${subjectId}/${topic.id}`}
                    className="px-4 py-2 rounded-lg bg-white/5 text-sm font-bold hover:bg-white/10 transition-all flex items-center gap-2"
                  >
                    Manage Items <ChevronRight className="w-4 h-4" />
                  </Link>
                  <button 
                    onClick={() => {
                      if(confirm(`Are you sure you want to delete ${topic.name}?`)) {
                        deleteTopic(subjectId, topic.id);
                      }
                    }}
                    className="p-2 rounded-lg text-red-500/40 hover:text-red-500 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
