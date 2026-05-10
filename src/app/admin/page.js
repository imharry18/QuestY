'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Book, ChevronRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useQuest } from '../context/QuestContext';

export default function AdminPage() {
  const { data, addSubject, deleteSubject, isLoaded } = useQuest();
  const [newSubjectName, setNewSubjectName] = useState('');

  if (!isLoaded) return <div className="p-20 text-center text-white/40">Loading Admin...</div>;

  const handleAdd = (e) => {
    e.preventDefault();
    if (newSubjectName.trim()) {
      addSubject(newSubjectName);
      setNewSubjectName('');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 md:p-12">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-12 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Admin Control Center</h1>
            <p className="text-white/40">Manage your learning battlefield subjects and topics.</p>
          </div>
        </header>

        {/* Add Subject Section */}
        <section className="premium-glass p-8 border border-white/5 mb-12">
          <h2 className="text-xl font-bold mb-6">Add New Subject</h2>
          <form onSubmit={handleAdd} className="flex gap-4">
            <input 
              type="text" 
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
              placeholder="Enter subject name (e.g., Python, ML)" 
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 transition-all"
            />
            <button 
              type="submit"
              className="bg-white text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-white/90 transition-all"
            >
              <Plus className="w-5 h-5" /> Add Subject
            </button>
          </form>
        </section>

        {/* Subject List */}
        <div className="grid gap-4">
          {data.subjects.map((subject) => (
            <div 
              key={subject.id} 
              className="premium-glass p-6 border border-white/5 flex items-center justify-between group hover:bg-white/5 transition-all"
            >
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                  <Book className="w-6 h-6 text-white/40" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{subject.name}</h3>
                  <p className="text-xs text-white/20 uppercase tracking-widest font-bold">ID: {subject.id}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Link 
                  href={`/admin/${subject.id}`}
                  className="px-4 py-2 rounded-lg bg-white/5 text-sm font-bold hover:bg-white/10 transition-all flex items-center gap-2"
                >
                  Manage Topics <ChevronRight className="w-4 h-4" />
                </Link>
                <button 
                  onClick={() => {
                    if(confirm(`Are you sure you want to delete ${subject.name}?`)) {
                      deleteSubject(subject.id);
                    }
                  }}
                  className="p-2 rounded-lg text-red-500/40 hover:text-red-500 hover:bg-red-500/10 transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
