'use client';

import React, { useState } from 'react';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors 
} from '@dnd-kit/core';
import { 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import { useSheetStore } from '@/store/useSheetStore'; // Fixed named import
import TopicNode from './TopicNode';
import { Plus, Layout, Sparkles, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const SheetContainer = () => {
  const { getActiveWorkspace, reorderTopics, addTopic } = useSheetStore();
  const [newTopicName, setNewTopicName] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // Get the data from the ACTIVE workspace
  const activeWorkspace = getActiveWorkspace();
  const sheetData = activeWorkspace ? activeWorkspace.topics : [];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      reorderTopics(active.id, over.id);
    }
  };

  const handleCreateTopic = (e) => {
    e.preventDefault();
    if (!newTopicName.trim()) return;
    addTopic(newTopicName);
    setNewTopicName("");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      
      {/* Hero Section & Input */}
      <div className="flex flex-col items-center text-center mb-16 space-y-8">
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider border border-blue-500/20">
            <Sparkles size={12} />
            <span>{activeWorkspace ? activeWorkspace.title : "Workspace"}</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-gray-900 via-gray-700 to-gray-500 dark:from-white dark:via-gray-200 dark:to-gray-500">
            Master Your Craft
          </h1>
          
          <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-lg mx-auto leading-relaxed">
            Organize your interview prep, project tasks, and learning goals in one fluid workspace.
          </p>
        </div>

        {/* Input Field */}
        <form 
          onSubmit={handleCreateTopic} 
          className={cn(
            "relative w-full max-w-md group transition-all duration-300",
            isFocused ? "scale-105" : "scale-100"
          )}
        >
          <div className={cn(
            "absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 opacity-20 blur-xl transition-opacity duration-500",
            isFocused ? "opacity-40" : "opacity-0"
          )} />
          
          <div className="relative flex items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden p-2">
            <div className="pl-4 text-gray-400">
              <Layout size={20} />
            </div>
            <input
              type="text"
              placeholder="What do you want to learn next?"
              value={newTopicName}
              onChange={(e) => setNewTopicName(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 font-medium"
            />
            <button 
              type="submit"
              disabled={!newTopicName.trim()}
              className="bg-gray-900 dark:bg-white text-white dark:text-black p-3 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={20} />
            </button>
          </div>
        </form>
      </div>

      {/* Drag & Drop Content */}
      <div className="min-h-[400px]">
        {sheetData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-gray-200 dark:border-white/5 rounded-3xl bg-gray-50/50 dark:bg-white/5 backdrop-blur-sm">
            <div className="h-16 w-16 bg-gray-100 dark:bg-white/10 rounded-2xl flex items-center justify-center mb-6 text-gray-400 dark:text-gray-500">
              <Layout size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {activeWorkspace ? "Workspace is empty" : "No Workspace Selected"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-xs mb-8">
              Start by adding a topic above.
            </p>
          </div>
        ) : (
          <DndContext 
            sensors={sensors} 
            collisionDetection={closestCenter} 
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={sheetData.map(t => t.id)} 
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                {sheetData.map((topic) => (
                  <TopicNode key={topic.id} topic={topic} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
};

export default SheetContainer;