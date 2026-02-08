import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  GripVertical, 
  Trash2, 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  FolderOpen 
} from 'lucide-react';
import useSheetStore from '../../store/useSheetStore';
import { cn } from '../../lib/utils';
import SubTopicNode from './SubTopicNode';

const TopicNode = ({ topic }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { deleteTopic, addSubTopic } = useSheetStore();
  
  // --- dnd-kit Hook for Dragging ---
  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    transition,
    isDragging 
  } = useSortable({ id: topic.id });

  // Apply drag styles (transform + transition)
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto", 
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={cn(
        "bg-white rounded-xl border border-gray-200 shadow-sm transition-all duration-200 group",
        isDragging && "shadow-xl ring-2 ring-blue-500/20 rotate-1"
      )}
    >
      {/* --- Topic Header --- */}
      <div className="p-4 flex items-center gap-3">
        {/* Drag Handle */}
        <div 
          {...attributes} 
          {...listeners} 
          className="cursor-grab text-gray-300 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors focus:outline-none"
          aria-label="Drag topic"
        >
          <GripVertical size={20} />
        </div>

        {/* Expand/Collapse Toggle */}
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-400 hover:text-blue-600 p-1 rounded hover:bg-blue-50 transition-colors focus:outline-none"
        >
          {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </button>

        {/* Title & Progress Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-lg font-bold text-gray-800 truncate select-none">
              {topic.title}
            </h2>
            <span className={cn(
              "text-[10px] px-2 py-0.5 rounded-full font-bold border uppercase tracking-wider",
              topic.progress === 100 
                ? "bg-green-100 text-green-700 border-green-200" 
                : "bg-gray-100 text-gray-600 border-gray-200"
            )}>
              {topic.progress}% Done
            </span>
          </div>
          
          {/* Animated Progress Bar */}
          <div className="h-1.5 w-full max-w-xs bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full transition-all duration-700 ease-out",
                topic.progress === 100 ? "bg-green-500" : "bg-blue-600"
              )}
              style={{ width: `${topic.progress}%` }}
            />
          </div>
        </div>

        {/* Actions (Visible on Group Hover) */}
        <div className="flex items-center gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => addSubTopic(topic.id, "New Sub-Topic")}
            className="flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Plus size={14} /> 
            <span className="hidden sm:inline">Add Sub-Topic</span>
          </button>
          
          <button 
            onClick={() => deleteTopic(topic.id)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Topic"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* --- Sub-Topics Container --- */}
      {isExpanded && (
        <div className="border-t border-gray-100 bg-gray-50/50 p-4 min-h-[100px] flex flex-col gap-3 animate-in slide-in-from-top-2 duration-200">
          {topic.subTopics.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg bg-white/50">
              <FolderOpen size={32} className="mb-2 opacity-30" />
              <p className="text-sm font-medium">No sub-topics yet</p>
              <button 
                onClick={() => addSubTopic(topic.id, "Core Concepts")}
                className="mt-1 text-xs text-blue-500 hover:underline"
              >
                Create one now
              </button>
            </div>
          ) : (
            topic.subTopics.map((sub) => (
              <SubTopicNode 
                key={sub.id} 
                subTopic={sub} 
                topicId={topic.id} 
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default TopicNode;