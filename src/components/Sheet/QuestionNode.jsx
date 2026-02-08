import React from 'react';
import { ExternalLink, Check, Trash2 } from 'lucide-react';
import useSheetStore from '../../store/useSheetStore';
import { cn } from '../../lib/utils';
import confetti from 'canvas-confetti';

const QuestionNode = ({ question, topicId, subTopicId }) => {
  const { toggleQuestion } = useSheetStore();

  const handleToggle = () => {
    toggleQuestion(topicId, subTopicId, question.id);
    
    // Only fire confetti if we are marking it AS complete (not unchecking)
    if (!question.completed) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563EB', '#10B981', '#F59E0B']
      });
    }
  };

  const getDifficultyColor = (diff) => {
    switch(diff.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-700 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className={cn(
      "group flex items-center justify-between p-3 rounded-lg border transition-all duration-200 hover:shadow-sm",
      question.completed ? "bg-gray-50 border-gray-200 opacity-75" : "bg-white border-gray-200"
    )}>
      <div className="flex items-center gap-3 flex-1">
        {/* Custom Checkbox */}
        <button
          onClick={handleToggle}
          className={cn(
            "w-5 h-5 rounded border flex items-center justify-center transition-colors",
            question.completed 
              ? "bg-green-500 border-green-500 text-white" 
              : "border-gray-300 hover:border-blue-500 bg-white"
          )}
        >
          {question.completed && <Check size={14} strokeWidth={3} />}
        </button>

        <a 
          href={question.link} 
          target="_blank" 
          rel="noreferrer" 
          className={cn(
            "text-sm font-medium hover:text-blue-600 transition-colors flex items-center gap-2",
            question.completed ? "text-gray-500 line-through decoration-gray-400" : "text-gray-800"
          )}
        >
          {question.title}
          <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400" />
        </a>
      </div>

      <div className="flex items-center gap-3">
        <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-semibold border uppercase tracking-wide", getDifficultyColor(question.difficulty))}>
          {question.difficulty}
        </span>
      </div>
    </div>
  );
};

export default QuestionNode;