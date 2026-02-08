"use client"; // Important for Next.js

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
import useSheetStore from '../../store/useSheetStore';
import TopicNode from './TopicNode';
import { Plus, Layout } from 'lucide-react';

const SheetContainer = () => {
  const { sheetData, reorderTopics, addTopic } = useSheetStore();
  const [newTopicName, setNewTopicName] = useState("");

  // Sensors for accessibility (Keyboard + Mouse/Touch)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Prevents accidental drags when clicking
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
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <Layout className="text-blue-600" size={32} />
            QuestY Tracker
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            Master your technical interviews, one block at a time.
          </p>
        </div>

        {/* Add Topic Form */}
        <form onSubmit={handleCreateTopic} className="flex gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="e.g. Dynamic Programming"
            value={newTopicName}
            onChange={(e) => setNewTopicName(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2.5 w-full md:w-64 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none shadow-sm"
          />
          <button 
            type="submit"
            className="bg-gray-900 text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-all font-medium flex items-center gap-2 shadow-lg shadow-gray-200 active:scale-95"
          >
            <Plus size={18} /> Add
          </button>
        </form>
      </div>

      {/* Drag & Drop Area */}
      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCenter} 
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={sheetData.map(t => t.id)} 
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-6">
            {sheetData.map((topic) => (
              <TopicNode key={topic.id} topic={topic} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default SheetContainer;