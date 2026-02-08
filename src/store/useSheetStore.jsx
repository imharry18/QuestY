'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { arrayMove } from '@dnd-kit/sortable';

// Initial Data to ensure the app doesn't look empty on first load
const INITIAL_DATA = [
  {
    id: 'topic-1',
    title: 'Arrays & Hashing',
    progress: 0,
    subTopics: [
      {
        id: 'sub-1',
        title: 'Core Concepts',
        questions: [
          { id: 'q-1', title: 'Two Sum', difficulty: 'Easy', completed: false, link: 'https://leetcode.com/problems/two-sum/' },
          { id: 'q-2', title: 'Contains Duplicate', difficulty: 'Easy', completed: false, link: 'https://leetcode.com/problems/contains-duplicate/' }
        ]
      }
    ]
  }
];

export const useSheetStore = create(
  persist(
    (set, get) => ({
      sheetData: INITIAL_DATA,
      
      // --- TOPIC ACTIONS ---
      addTopic: (title) => set((state) => ({
        sheetData: [...state.sheetData, { 
          id: crypto.randomUUID(), 
          title, 
          progress: 0,
          subTopics: [] 
        }]
      })),

      deleteTopic: (id) => set((state) => ({
        sheetData: state.sheetData.filter((t) => t.id !== id)
      })),

      reorderTopics: (activeId, overId) => set((state) => {
        const oldIndex = state.sheetData.findIndex((t) => t.id === activeId);
        const newIndex = state.sheetData.findIndex((t) => t.id === overId);
        return { sheetData: arrayMove(state.sheetData, oldIndex, newIndex) };
      }),

      // --- SUB-TOPIC ACTIONS ---
      addSubTopic: (topicId, title) => set((state) => ({
        sheetData: state.sheetData.map((topic) => {
          if (topic.id !== topicId) return topic;
          return {
            ...topic,
            subTopics: [...topic.subTopics, { 
              id: crypto.randomUUID(), 
              title, 
              questions: [] 
            }]
          };
        })
      })),

      deleteSubTopic: (topicId, subTopicId) => set((state) => ({
        sheetData: state.sheetData.map((topic) => {
          if (topic.id !== topicId) return topic;
          return {
            ...topic,
            subTopics: topic.subTopics.filter((st) => st.id !== subTopicId)
          };
        })
      })),

      // --- QUESTION ACTIONS (The Complex Part) ---
      addQuestion: (topicId, subTopicId, questionData) => set((state) => ({
        sheetData: state.sheetData.map((topic) => {
          if (topic.id !== topicId) return topic;
          return {
            ...topic,
            subTopics: topic.subTopics.map((sub) => {
              if (sub.id !== subTopicId) return sub;
              return {
                ...sub,
                questions: [...sub.questions, { 
                  id: crypto.randomUUID(), 
                  ...questionData, 
                  completed: false 
                }]
              };
            })
          };
        })
      })),

      toggleQuestion: (topicId, subTopicId, questionId) => {
        set((state) => {
          // 1. Update the question status
          const newData = state.sheetData.map((topic) => {
            if (topic.id !== topicId) return topic;
            return {
              ...topic,
              subTopics: topic.subTopics.map((sub) => {
                if (sub.id !== subTopicId) return sub;
                return {
                  ...sub,
                  questions: sub.questions.map((q) => 
                    q.id === questionId ? { ...q, completed: !q.completed } : q
                  )
                };
              })
            };
          });

          // 2. Recalculate Progress for the Topic (Bonus Feature)
          const updatedTopic = newData.find(t => t.id === topicId);
          const allQuestions = updatedTopic.subTopics.flatMap(st => st.questions);
          const completedCount = allQuestions.filter(q => q.completed).length;
          const totalCount = allQuestions.length;
          updatedTopic.progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

          return { sheetData: newData };
        });
      },
    }),
    {
      name: 'questy-storage', // This key saves data to localStorage
      skipHydration: true,    // Fixes Next.js hydration mismatch errors
    }
  )
);

export default useSheetStore;