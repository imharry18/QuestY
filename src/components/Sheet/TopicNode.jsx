'use client';

import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  SortableContext, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import SubTopicNode from './SubTopicNode';
import useSheetStore from '@/store/useSheetStore';
import { 
  GripVertical, 
  Trash2, 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  FolderOpen 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const TopicNode = ({ topic }) => {
  const { deleteTopic, updateTopicTitle, addSubTopic } = useSheetStore();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newSubTopicTitle, setNewSubTopicTitle] = useState("");

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: topic.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
  };

  const handleAddSubTopic = (e) => {
    e.preventDefault();
    if (!newSubTopicTitle.trim()) return;
    addSubTopic(topic.id, newSubTopicTitle);
    setNewSubTopicTitle("");
    setIsExpanded(true);
  };

  // Calculate Progress
  const totalQuestions = topic.subTopics?.reduce((acc, st) => acc + (st.questions?.length || 0), 0) || 0;
  const completedQuestions = topic.subTopics?.reduce((acc, st) => acc + (st.questions?.filter(q => q.done).length || 0), 0) || 0;
  const progress = totalQuestions === 0 ? 0 : Math.round((completedQuestions / totalQuestions) * 100);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative rounded-2xl border transition-all duration-300",
        isDragging 
          ? "bg-blue-50/80 border-blue-200 shadow-xl scale-105 rotate-1 z-50" 
          : "bg-white dark:bg-gray-900 border-gray-200 dark:border-white/10 hover:border-blue-400/50 hover:shadow-lg"
      )}
    >
      {/* Topic Header */}
      <div className="flex items-center gap-3 p-4">
        {/* Drag Handle */}
        <button 
          {...attributes} 
          {...listeners}
          className="touch-none p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-grab active:cursor-grabbing rounded-md hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
        >
          <GripVertical size={18} />
        </button>

        {/* Expand/Collapse */}
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
        >
          {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </button>

        {/* Title & Progress */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <input
              value={topic.title}
              onChange={(e) => updateTopicTitle(topic.id, e.target.value)}
              className="bg-transparent font-bold text-lg text-gray-900 dark:text-white outline-none focus:text-blue-600 dark:focus:text-blue-400 w-full"
              placeholder="Topic Name"
            />
          </div>
          {/* Subtle Progress Bar */}
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-24 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-500" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-gray-400 font-medium">{progress}% Done</span>
          </div>
        </div>

        {/* Delete Button */}
        <button 
          onClick={() => deleteTopic(topic.id)}
          className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-black/20 p-4 rounded-b-2xl space-y-4">
          
          <SortableContext 
            items={topic.subTopics?.map(st => st.id) || []} 
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {topic.subTopics?.map((subTopic) => (
                <SubTopicNode key={subTopic.id} topicId={topic.id} subTopic={subTopic} />
              ))}
            </div>
          </SortableContext>

          {/* Add SubTopic Input */}
          <form onSubmit={handleAddSubTopic} className="flex items-center gap-2 pl-2 group/input">
             <div className="p-1.5 bg-gray-200 dark:bg-gray-800 rounded-md text-gray-500">
               <FolderOpen size={14} />
             </div>
             <input
               type="text"
               placeholder="Add a sub-topic (e.g. 'Standard Problems')"
               value={newSubTopicTitle}
               onChange={(e) => setNewSubTopicTitle(e.target.value)}
               className="flex-1 bg-transparent text-sm px-2 py-1.5 outline-none text-gray-700 dark:text-gray-300 placeholder-gray-400"
             />
             <button 
               type="submit" 
               disabled={!newSubTopicTitle.trim()}
               className="p-1.5 bg-gray-900 dark:bg-white text-white dark:text-black rounded-md opacity-0 group-focus-within/input:opacity-100 transition-all disabled:opacity-0 scale-90 hover:scale-100"
             >
               <Plus size={14} />
             </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default TopicNode;