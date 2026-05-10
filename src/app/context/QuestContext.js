'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_CONTENT } from '../data/content';
import { db } from '../../lib/firebase';
import { doc, setDoc, onSnapshot } from "firebase/firestore";

const QuestContext = createContext();

const genId = () => Math.random().toString(36).substr(2, 9);

const INITIAL_PROGRESS = {
  user: {
    name: '',
    rank: 'Unranked',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Explorer'
  },
  stats: [
    { id: 'streak', label: 'CURRENT STREAK', value: 0, icon: 'Flame', color: 'text-orange-500' },
    { id: 'solved', label: 'PROBLEMS SOLVED', value: 0, icon: 'CheckCircle2', color: 'text-green-500' },
    { id: 'quizzes', label: 'QUIZZES GIVEN', value: 0, icon: 'Trophy', color: 'text-yellow-500' },
    { id: 'docs', label: 'DOCS READ', value: 0, icon: 'FileText', color: 'text-blue-400' },
  ],
  completedTopics: {},
  completedItems: {},
  quizPerformance: { correct: 0, total: 0 },
  activity: Array.from({ length: 365 }).map(() => 0)
};

export function QuestProvider({ children }) {
  const [data, setData] = useState({ ...INITIAL_CONTENT, ...INITIAL_PROGRESS });
  const [isLoaded, setIsLoaded] = useState(false);

  // ── 1. Listen to Cloud Content (Real-time) ──
  useEffect(() => {
    const contentRef = doc(db, "app", "content");
    const unsubContent = onSnapshot(contentRef, (docSnap) => {
      if (docSnap.exists()) {
        const cloudContent = docSnap.data();
        setData(prev => ({ 
          ...prev, 
          subjects: cloudContent.subjects || INITIAL_CONTENT.subjects,
          topics: cloudContent.topics || INITIAL_CONTENT.topics
        }));
      } else {
        // Initialize cloud with local if empty
        setDoc(contentRef, { 
          subjects: INITIAL_CONTENT.subjects, 
          topics: INITIAL_CONTENT.topics 
        });
      }
    });

    return () => unsubContent();
  }, []);

  // ── 2. Load Progress from LocalStorage (Private) ──
  useEffect(() => {
    const savedProgress = localStorage.getItem('questy_user_progress_cloud');
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        setData(prev => ({ ...prev, ...parsed }));
      } catch (e) { console.error('Progress parse error', e); }
    }
    setIsLoaded(true);
  }, []);

  // ── 3. Save Progress to LocalStorage on Change ──
  useEffect(() => {
    if (isLoaded) {
      const progressToSave = {
        user: data.user,
        stats: data.stats,
        completedTopics: data.completedTopics,
        completedItems: data.completedItems,
        quizPerformance: data.quizPerformance,
        activity: data.activity
      };
      localStorage.setItem('questy_user_progress_cloud', JSON.stringify(progressToSave));
    }
  }, [data.user, data.stats, data.completedTopics, data.completedItems, data.quizPerformance, data.activity, isLoaded]);

  // ── Cloud Content Sync Helper ──
  const syncCloudContent = async (updatedData) => {
    try {
      await setDoc(doc(db, "app", "content"), {
        subjects: updatedData.subjects,
        topics: updatedData.topics
      });
    } catch (e) { console.error("Cloud Sync Error (Content):", e); }
  };

  // ── Admin Actions (Updates Cloud Content) ──
  const addSubject = (name) => {
    const id = name.toLowerCase().replace(/\s+/g, '-');
    const updated = {
      ...data,
      subjects: [...data.subjects, { id, name, progress: 0, solved: 0, total: 0 }],
      topics: { ...data.topics, [id]: [] }
    };
    setData(updated); // Immediate UI update
    syncCloudContent(updated);
  };

  const deleteSubject = (id) => {
    const newSubjects = data.subjects.filter(s => s.id !== id);
    const newTopics = { ...data.topics };
    delete newTopics[id];
    const updated = { ...data, subjects: newSubjects, topics: newTopics };
    setData(updated);
    syncCloudContent(updated);
  };

  const addTopic = (subjectId, name) => {
    const updated = {
      ...data,
      topics: {
        ...data.topics,
        [subjectId]: [...(data.topics[subjectId] || []), { id: genId(), name, items: [] }]
      }
    };
    setData(updated);
    syncCloudContent(updated);
  };

  const deleteTopic = (subjectId, topicId) => {
    const updated = {
      ...data,
      topics: {
        ...data.topics,
        [subjectId]: data.topics[subjectId].filter(t => t.id !== topicId)
      }
    };
    setData(updated);
    syncCloudContent(updated);
  };

  const importItems = (subjectId, topicId, newItems) => {
    const subjectTopics = [...(data.topics[subjectId] || [])];
    const topicIdx = subjectTopics.findIndex(t => t.id === topicId);
    if (topicIdx === -1) return;

    const itemsWithIds = newItems.map(it => ({ ...it, id: it.id || genId() }));
    subjectTopics[topicIdx] = {
      ...subjectTopics[topicIdx],
      items: [...subjectTopics[topicIdx].items, ...itemsWithIds]
    };

    const updated = { ...data, topics: { ...data.topics, [subjectId]: subjectTopics } };
    setData(updated);
    syncCloudContent(updated);
  };

  const deleteItem = (subjectId, topicId, itemId) => {
    const subjectTopics = [...(data.topics[subjectId] || [])];
    const topicIdx = subjectTopics.findIndex(t => t.id === topicId);
    if (topicIdx === -1) return;

    subjectTopics[topicIdx] = {
      ...subjectTopics[topicIdx],
      items: subjectTopics[topicIdx].items.filter(it => it.id !== itemId)
    };

    const updated = { ...data, topics: { ...data.topics, [subjectId]: subjectTopics } };
    setData(updated);
    syncCloudContent(updated);
  };

  // ── Progress Actions (Updates LocalStorage) ──
  const markItemComplete = (subjectId, topicId, itemId) => {
    setData(prev => {
      // 1. Mark Item Complete
      const newCompletedItems = {
        ...prev.completedItems,
        [subjectId]: {
          ...(prev.completedItems[subjectId] || {}),
          [topicId]: {
            ...((prev.completedItems[subjectId] || {})[topicId] || {}),
            [itemId]: true,
          },
        },
      };

      // 2. Determine Item Type for Stats
      const topic = (prev.topics[subjectId] || []).find(t => t.id === topicId);
      const item = topic?.items?.find(it => it.id === itemId);

      // 3. Update Activity Dot (Increment today's score)
      const newActivity = [...prev.activity];
      newActivity[newActivity.length - 1] += 1;

      // 4. Update Header Stats
      const newStats = prev.stats.map(s => {
        if (item?.type === 'problem' && s.id === 'solved') return { ...s, value: s.value + 1 };
        if (item?.type === 'note' && s.id === 'docs') return { ...s, value: s.value + 1 };
        return s;
      });

      return {
        ...prev,
        completedItems: newCompletedItems,
        activity: newActivity,
        stats: newStats
      };
    });
  };

  const unmarkItemComplete = (subjectId, topicId, itemKey) => {
    setData(prev => {
      const itemMap = { ...((prev.completedItems[subjectId] || {})[topicId] || {}) };
      delete itemMap[itemKey];
      return {
        ...prev,
        completedItems: {
          ...prev.completedItems,
          [subjectId]: { ...(prev.completedItems[subjectId] || {}), [topicId]: itemMap },
        },
      };
    });
  };

  const markTopicComplete = (subjectId, topicId) => {
    setData(prev => ({
      ...prev,
      completedTopics: {
        ...prev.completedTopics,
        [subjectId]: { ...(prev.completedTopics[subjectId] || {}), [topicId]: true },
      },
    }));
  };

  const unmarkTopicComplete = (subjectId, topicId) => {
    setData(prev => {
      const topicMap = { ...(prev.completedTopics[subjectId] || {}) };
      delete topicMap[topicId];
      return { ...prev, completedTopics: { ...prev.completedTopics, [subjectId]: topicMap } };
    });
  };

  const addQuiz = (isCorrect = true) => {
    setData(prev => ({
      ...prev,
      stats: prev.stats.map(s => s.id === 'quizzes' ? { ...s, value: s.value + 1 } : s),
      quizPerformance: {
        correct: prev.quizPerformance.correct + (isCorrect ? 1 : 0),
        total: prev.quizPerformance.total + 1
      }
    }));
  };

  return (
    <QuestContext.Provider value={{
      data, isLoaded,
      addSubject, deleteSubject, addTopic, deleteTopic, importItems, deleteItem,
      markItemComplete, unmarkItemComplete, markTopicComplete, unmarkTopicComplete,
      addQuiz
    }}>
      {children}
    </QuestContext.Provider>
  );
}

export const useQuest = () => useContext(QuestContext);
