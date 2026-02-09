'use client';

import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  SortableContext, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import QuestionNode from './QuestionNode';
import useSheetStore from '@/store/useSheetStore';
import { 
  GripVertical, 
  Trash2, 
  Plus, 
  Link as LinkIcon 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const SubTopicNode = ({ topicId, subTopic }) => {
  const { deleteSubTopic, updateSubTopicTitle, addQuestion } = useSheetStore();
  const [newQuestionTitle, setNewQuestionTitle] = useState("");
  const [newQuestionLink, setNewQuestionLink] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: subTopic.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (!newQuestionTitle.trim()) return;
    addQuestion(topicId, subTopic.id, {
        title: newQuestionTitle,
        link: newQuestionLink
    });
    setNewQuestionTitle("");
    setNewQuestionLink("");
    setIsAdding(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative pl-4 border-l-2 border-gray-200 dark:border-gray-700 transition-all",
        isDragging ? "opacity-50" : "opacity-100"
      )}
    >
      {/* SubTopic Header */}
      <div className="flex items-center gap-2 mb-2 group">
        <button 
          {...attributes} 
          {...listeners}
          className="touch-none text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical size={14} />
        </button>
        
        <input
          value={subTopic.title}
          onChange={(e) => updateSubTopicTitle(topicId, subTopic.id, e.target.value)}
          className="bg-transparent font-semibold text-gray-700 dark:text-gray-200 text-sm outline-none focus:text-blue-600 w-full"
        />
        
        <button 
          onClick={() => deleteSubTopic(topicId, subTopic.id)}
          className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Questions List */}
      <div className="space-y-2 mb-3">
        <SortableContext 
          items={subTopic.questions?.map(q => q.id) || []} 
          strategy={verticalListSortingStrategy}
        >
          {subTopic.questions?.map((question) => (
            <QuestionNode 
              key={question.id} 
              topicId={topicId} 
              subTopicId={subTopic.id} 
              question={question} 
            />
          ))}
        </SortableContext>
      </div>

      {/* Add Question Button / Form */}
      {isAdding ? (
        <form onSubmit={handleAddQuestion} className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-blue-200 dark:border-blue-900 shadow-sm animate-in fade-in zoom-in-95 duration-200">
           <div className="space-y-2">
             <input
               autoFocus
               placeholder="Question Title (e.g. 'Two Sum')"
               value={newQuestionTitle}
               onChange={(e) => setNewQuestionTitle(e.target.value)}
               className="w-full text-sm bg-transparent outline-none border-b border-gray-100 dark:border-gray-700 pb-1"
             />
             <div className="flex items-center gap-2">
               <LinkIcon size={12} className="text-gray-400" />
               <input
                 placeholder="Link (Optional)"
                 value={newQuestionLink}
                 onChange={(e) => setNewQuestionLink(e.target.value)}
                 className="flex-1 text-xs bg-transparent outline-none text-gray-500"
               />
             </div>
           </div>
           <div className="flex justify-end gap-2 mt-3">
             <button 
               type="button" 
               onClick={() => setIsAdding(false)}
               className="text-xs px-3 py-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
             >
               Cancel
             </button>
             <button 
               type="submit"
               className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-md shadow-blue-500/20"
             >
               Add
             </button>
           </div>
        </form>
      ) : (
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors ml-1 py-1"
        >
          <Plus size={14} /> Add Question
        </button>
      )}
    </div>
  );
};

export default SubTopicNode;