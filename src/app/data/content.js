// This file contains the base content provided by QuestY
export const INITIAL_CONTENT = {
  subjects: [
    { id: 'java', name: 'JAVA', progress: 0, solved: 0, total: 0 },
    { id: 'dsa', name: 'DSA', progress: 0, solved: 0, total: 0 },
    { id: 'os', name: 'OS', progress: 0, solved: 0, total: 0 },
    { id: 'cn', name: 'CN', progress: 0, solved: 0, total: 0 },
    { id: 'dbms', name: 'DBMS', progress: 0, solved: 0, total: 0 },
    { id: 'aptitude', name: 'APTITUDE', progress: 0, solved: 0, total: 0 },
  ],
  topics: {
    dsa: [
      {
        id: 'arrays',
        name: 'Arrays',
        items: [
          { id: 'v1', type: 'video', name: 'Arrays in Depth – Striver', url: 'https://www.youtube.com/watch?v=37E9ckMDdTk' },
          { id: 'p1', type: 'problem', name: 'Two Sum', difficulty: 'Easy', url: 'https://leetcode.com/problems/two-sum/' },
          { 
            id: 'n1', 
            type: 'note', 
            name: 'Arrays – Core Concepts', 
            content: [
              { type: 'heading', text: 'What is an Array?' },
              { type: 'paragraph', text: 'An array is a contiguous block of memory.' }
            ] 
          },
          { 
            id: 'q1', 
            type: 'quiz', 
            name: 'Array Basics Quiz',
            questions: [
              { question: 'What is O(1) in Arrays?', options: ['Access', 'Search', 'Insert', 'Delete'], correct: 0 }
            ] 
          }
        ]
      }
    ],
    java: [],
    os: [],
    cn: [],
    dbms: [],
    aptitude: []
  }
};
