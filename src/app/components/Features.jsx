'use client';

import { motion } from 'framer-motion';
import { Flame, Link as LinkIcon, BookOpen, BrainCircuit } from 'lucide-react';

const features = [
  {
    title: 'STREAK SYSTEM',
    description: 'Track your daily consistency and build unstoppable coding habits with our animated streak system.',
    icon: <Flame className="w-8 h-8 text-orange-500" />,
    color: 'var(--accent-orange)'
  },
  {
    title: 'DIRECT LINKS',
    description: 'Access curated LeetCode and GeeksForGeeks problems instantly without searching.',
    icon: <LinkIcon className="w-8 h-8 text-blue-500" />,
    color: 'var(--accent-blue)'
  },
  {
    title: 'SUBJECT PREP',
    description: 'JAVA, DSA, OS, DBMS, and more. All organized for your preparation journey.',
    icon: <BookOpen className="w-8 h-8 text-purple-500" />,
    color: 'var(--accent-purple)'
  },
  {
    title: 'INTERVIEW PREP',
    description: 'Practice HR questions, technical rounds, and core CS fundamentals in one place.',
    icon: <BrainCircuit className="w-8 h-8 text-green-500" />,
    color: 'var(--accent-green)'
  }
];

export default function Features() {
  return (
    <section id="features" className="section-container">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div className="flex flex-col justify-center">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-4xl md:text-6xl font-bold leading-tight mb-8"
          >
            Everything You Need <br />
            <span className="text-white/40">To Become Placement Ready</span>
          </motion.h2>
          <p className="text-white/60 text-lg max-w-md">
            QuestY is designed to eliminate friction in your preparation. Focus on what matters: solving problems and building consistency.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="premium-glass p-8 group relative overflow-hidden"
            >
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                style={{ background: `radial-gradient(circle at top right, ${feature.color}, transparent)` }}
              ></div>
              <div className="mb-6">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
