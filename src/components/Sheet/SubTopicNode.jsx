import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import useSheetStore from '../../store/useSheetStore';
import QuestionNode from './QuestionNode';

const SubTopicNode = ({ subTopic, topicId }) => {
  const { deleteSubTopic, addQuestion } = useSheetStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newQTitle, setNewQTitle] = useState("");
  const [newQLink, setNewQLink] = useState("");

  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (!newQTitle.trim()) return;
    addQuestion(topicId, subTopic.id, { 
      title: newQTitle, 
      link: newQLink || '#' 
    });
    setNewQTitle("");
    setNewQLink("");
    setIsAdding(false);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* SubTopic Header */}
      <div className="px-4 py-3 bg-gray-50/80 border-b border-gray-100 flex items-center justify-between group">
        <h3 className="font-semibold text-gray-700 text-sm flex items-center gap-2">
          {subTopic.title}
          <span className="text-xs font-normal text-gray-400 bg-white px-1.5 py-0.5 rounded border border-gray-200">
            {subTopic.questions.length}
          </span>
        </h3>
        
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors"
          >
            <Plus size={14} /> Add Question
          </button>
          <button 
            onClick={() => deleteSubTopic(topicId, subTopic.id)}
            className="text-gray-400 hover:text-red-500 p-1"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Add Question Form */}
      {isAdding && (
        <form onSubmit={handleAddQuestion} className="p-3 bg-blue-50/30 border-b border-blue-100">
          <div className="flex gap-2 mb-2">
            <input 
              autoFocus
              type="text" 
              placeholder="Question Title (e.g. Invert Binary Tree)" 
              className="flex-1 text-sm border border-gray-300 rounded px-2 py-1.5 focus:ring-1 focus:ring-blue-500 outline-none"
              value={newQTitle}
              onChange={e => setNewQTitle(e.target.value)}
            />
            <select className="text-sm border border-gray-300 rounded px-2 py-1.5 bg-white text-gray-600 outline-none">
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>
          <div className="flex gap-2">
             <input 
              type="text" 
              placeholder="Link (Optional)" 
              className="flex-1 text-sm border border-gray-300 rounded px-2 py-1.5 focus:ring-1 focus:ring-blue-500 outline-none"
              value={newQLink}
              onChange={e => setNewQLink(e.target.value)}
            />
            <div className="flex gap-1">
              <button type="submit" className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded font-medium hover:bg-blue-700">Add</button>
              <button type="button" onClick={() => setIsAdding(false)} className="bg-white border text-gray-600 text-xs px-3 py-1.5 rounded font-medium hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </form>
      )}

      {/* Questions List */}
      <div className="p-2 space-y-2">
        {subTopic.questions.length === 0 && !isAdding ? (
          <p className="text-center text-xs text-gray-400 py-4 italic">No questions added yet.</p>
        ) : (
          subTopic.questions.map((q) => (
            <QuestionNode key={q.id} question={q} topicId={topicId} subTopicId={subTopic.id} />
          ))
        )}
      </div>
    </div>
  );
};

export default SubTopicNode;