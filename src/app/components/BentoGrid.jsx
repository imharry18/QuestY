'use client';

import { motion } from 'framer-motion';
import { Users, Code, Cpu, GraduationCap, MessageSquare } from 'lucide-react';

const bentoItems = [
  {
    title: 'HR Preparation',
    desc: 'Master behavioral questions and culture-fit rounds.',
    icon: <Users className="w-6 h-6" />,
    className: 'md:col-span-2 md:row-span-1',
    color: 'from-orange-500/20'
  },
  {
    title: 'DSA Rounds',
    desc: 'Top 100 problems for tech giants.',
    icon: <Code className="w-6 h-6" />,
    className: 'md:col-span-1 md:row-span-2',
    color: 'from-blue-500/20'
  },
  {
    title: 'Core CS',
    desc: 'OS, CN, and DBMS fundamentals.',
    icon: <Cpu className="w-6 h-6" />,
    className: 'md:col-span-1 md:row-span-1',
    color: 'from-purple-500/20'
  },
  {
    title: 'Mock Interviews',
    desc: 'Real-time peer-to-peer practice.',
    icon: <MessageSquare className="w-6 h-6" />,
    className: 'md:col-span-2 md:row-span-1',
    color: 'from-green-500/20'
  },
  {
    title: 'Aptitude',
    desc: 'Logical and quantitative mastery.',
    icon: <GraduationCap className="w-6 h-6" />,
    className: 'md:col-span-1 md:row-span-1',
    color: 'from-yellow-500/20'
  }
];

export default function BentoGrid() {
  return (
    <section className="section-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Interview Preparation</h2>
        <p className="text-white/50">A comprehensive suite to help you ace every round.</p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-full md:h-[600px]">
        {bentoItems.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className={`premium-glass p-8 relative overflow-hidden flex flex-col justify-end group ${item.className}`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${item.color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
            <div className="relative z-10">
              <div className="bg-white/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 border border-white/10">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
              <p className="text-white/40 text-sm">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
