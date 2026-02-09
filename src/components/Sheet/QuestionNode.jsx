'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import useSheetStore from '@/store/useSheetStore';
import { 
  GripVertical, 
  Trash2, 
  ExternalLink,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

const QuestionNode = ({ topicId, subTopicId, question }) => {
  const { toggleQuestionDone, deleteQuestion } = useSheetStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-center gap-3 p-2.5 rounded-lg border transition-all duration-200",
        isDragging ? "opacity-50 bg-gray-50" : "bg-white dark:bg-gray-800/50 border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-sm"
      )}
    >
      {/* Drag Handle */}
      <button 
        {...attributes} 
        {...listeners}
        className="touch-none text-gray-300 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing hover:text-gray-500"
      >
        <GripVertical size={14} />
      </button>

      {/* Custom Checkbox */}
      <button
        onClick={() => toggleQuestionDone(topicId, subTopicId, question.id)}
        className={cn(
          "flex items-center justify-center h-5 w-5 rounded border transition-all duration-300",
          question.done 
            ? "bg-green-500 border-green-500 text-white shadow-[0_0_10px_rgba(34,197,94,0.4)]" 
            : "border-gray-300 dark:border-gray-600 hover:border-blue-400 bg-transparent"
        )}
      >
        {question.done && <Check size={12} strokeWidth={3} />}
      </button>

      {/* Title */}
      <div className="flex-1 min-w-0 flex items-center gap-2">
        <span className={cn(
          "text-sm transition-all duration-300 truncate",
          question.done 
            ? "text-gray-400 line-through decoration-gray-400" 
            : "text-gray-700 dark:text-gray-200 font-medium"
        )}>
          {question.title}
        </span>
        
        {/* External Link */}
        {question.link && (
          <a 
            href={question.link} 
            target="_blank" 
            rel="noreferrer"
            className="text-gray-400 hover:text-blue-500 transition-colors"
          >
            <ExternalLink size={12} />
          </a>
        )}
      </div>

      {/* Delete Action */}
      <button 
        onClick={() => deleteQuestion(topicId, subTopicId, question.id)}
        className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-all"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
};

export default QuestionNode;