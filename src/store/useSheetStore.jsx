'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { arrayMove } from '@dnd-kit/sortable';

const DEFAULT_WORKSPACE_ID = 'ws-default';

// Helper: Calculate progress for a specific topic
const calculateTopicProgress = (topic) => {
  if (!topic.subTopics?.length) return 0;
  
  let totalQuestions = 0;
  let completedQuestions = 0;

  topic.subTopics.forEach(sub => {
    if (sub.questions) {
      totalQuestions += sub.questions.length;
      completedQuestions += sub.questions.filter(q => q.done).length;
    }
  });

  return totalQuestions === 0 ? 0 : Math.round((completedQuestions / totalQuestions) * 100);
};

export const useSheetStore = create(
  persist(
    (set, get) => ({
      // --- STATE ---
      workspaces: [
        {
          id: DEFAULT_WORKSPACE_ID,
          title: 'My First Workspace',
          topics: []
        }
      ],
      activeWorkspaceId: DEFAULT_WORKSPACE_ID,
      
      // UI STATE
      isSidebarOpen: false,

      // --- ACTIONS ---
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),

      // --- IMPORT / EXPORT ACTIONS (NEW) ---
      importWorkspaces: (data) => {
        // Basic validation to ensure it's a valid backup
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error("Invalid backup file format.");
        }
        
        set({
          workspaces: data,
          activeWorkspaceId: data[0].id // Switch to first workspace after import
        });
      },

      // --- WORKSPACE ACTIONS ---
      addWorkspace: (title) => set((state) => {
        const newId = crypto.randomUUID();
        return {
          workspaces: [...state.workspaces, { id: newId, title, topics: [] }],
          activeWorkspaceId: newId 
        };
      }),

      deleteWorkspace: (id) => set((state) => {
        const newWorkspaces = state.workspaces.filter(w => w.id !== id);
        let newActiveId = state.activeWorkspaceId;
        if (id === state.activeWorkspaceId) {
          newActiveId = newWorkspaces.length > 0 ? newWorkspaces[0].id : '';
        }
        return { workspaces: newWorkspaces, activeWorkspaceId: newActiveId };
      }),

      setActiveWorkspace: (id) => set({ activeWorkspaceId: id }),

      updateWorkspaceTitle: (id, newTitle) => set((state) => ({
        workspaces: state.workspaces.map(w => w.id === id ? { ...w, title: newTitle } : w)
      })),

      // --- TOPIC ACTIONS (Scoped to Active Workspace) ---
      _updateActiveWorkspaceTopics: (updateFn) => set((state) => ({
        workspaces: state.workspaces.map(ws => {
          if (ws.id !== state.activeWorkspaceId) return ws;
          return { ...ws, topics: updateFn(ws.topics) };
        })
      })),

      getActiveWorkspace: () => {
        const state = get();
        return state.workspaces.find(w => w.id === state.activeWorkspaceId) || null;
      },

      addTopic: (title) => {
        get()._updateActiveWorkspaceTopics((topics) => [
          ...topics, 
          { id: crypto.randomUUID(), title, progress: 0, subTopics: [] }
        ]);
      },

      deleteTopic: (id) => {
        get()._updateActiveWorkspaceTopics((topics) => topics.filter(t => t.id !== id));
      },

      updateTopicTitle: (id, newTitle) => {
        get()._updateActiveWorkspaceTopics((topics) => 
          topics.map(t => t.id === id ? { ...t, title: newTitle } : t)
        );
      },

      reorderTopics: (activeId, overId) => {
        get()._updateActiveWorkspaceTopics((topics) => {
          const oldIndex = topics.findIndex((t) => t.id === activeId);
          const newIndex = topics.findIndex((t) => t.id === overId);
          return arrayMove(topics, oldIndex, newIndex);
        });
      },

      // --- SUB-TOPIC ACTIONS ---
      addSubTopic: (topicId, title) => {
        get()._updateActiveWorkspaceTopics((topics) => 
          topics.map(topic => {
            if (topic.id !== topicId) return topic;
            return {
              ...topic,
              subTopics: [...topic.subTopics, { id: crypto.randomUUID(), title, questions: [] }]
            };
          })
        );
      },

      deleteSubTopic: (topicId, subTopicId) => {
        get()._updateActiveWorkspaceTopics((topics) => 
          topics.map(topic => {
            if (topic.id !== topicId) return topic;
            const updatedTopic = { 
              ...topic, 
              subTopics: topic.subTopics.filter(st => st.id !== subTopicId) 
            };
            updatedTopic.progress = calculateTopicProgress(updatedTopic);
            return updatedTopic;
          })
        );
      },

      updateSubTopicTitle: (topicId, subTopicId, newTitle) => {
        get()._updateActiveWorkspaceTopics((topics) => 
          topics.map(topic => {
            if (topic.id !== topicId) return topic;
            return {
              ...topic,
              subTopics: topic.subTopics.map(st => st.id === subTopicId ? { ...st, title: newTitle } : st)
            };
          })
        );
      },

      // --- QUESTION ACTIONS ---
      addQuestion: (topicId, subTopicId, questionData) => {
        get()._updateActiveWorkspaceTopics((topics) => 
          topics.map(topic => {
            if (topic.id !== topicId) return topic;
            const updatedTopic = {
              ...topic,
              subTopics: topic.subTopics.map(st => {
                if (st.id !== subTopicId) return st;
                return {
                  ...st,
                  questions: [...st.questions, { 
                    id: crypto.randomUUID(), 
                    ...questionData, 
                    done: false 
                  }]
                };
              })
            };
            updatedTopic.progress = calculateTopicProgress(updatedTopic);
            return updatedTopic;
          })
        );
      },

      deleteQuestion: (topicId, subTopicId, questionId) => {
        get()._updateActiveWorkspaceTopics((topics) => 
          topics.map(topic => {
            if (topic.id !== topicId) return topic;
            const updatedTopic = {
              ...topic,
              subTopics: topic.subTopics.map(st => {
                if (st.id !== subTopicId) return st;
                return {
                  ...st,
                  questions: st.questions.filter(q => q.id !== questionId)
                };
              })
            };
            updatedTopic.progress = calculateTopicProgress(updatedTopic);
            return updatedTopic;
          })
        );
      },

      toggleQuestionDone: (topicId, subTopicId, questionId) => {
        get()._updateActiveWorkspaceTopics((topics) => 
          topics.map(topic => {
            if (topic.id !== topicId) return topic;
            const updatedTopic = {
              ...topic,
              subTopics: topic.subTopics.map(st => {
                if (st.id !== subTopicId) return st;
                return {
                  ...st,
                  questions: st.questions.map(q => q.id === questionId ? { ...q, done: !q.done } : q)
                };
              })
            };
            updatedTopic.progress = calculateTopicProgress(updatedTopic);
            return updatedTopic;
          })
        );
      },
    }),
    {
      name: 'questy-storage-v4', // Version bump to force fresh storage structure
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useSheetStore;