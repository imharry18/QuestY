'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from './components/Navbar';

import Hero from './components/Hero';
import TrustStrip from './components/TrustStrip';
import Features from './components/Features';
import BentoGrid from './components/BentoGrid';
import { CTA, Footer } from './components/CTASection';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <TrustStrip />
      <Features />
      
      {/* Direct Problem Solving Section */}
      <section className="section-container">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Direct Problem Solving</h2>
          <p className="text-white/40">Access top platforms with one click.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="premium-glass p-10 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-3xl group-hover:bg-orange-500/20 transition-all"></div>
            <h3 className="text-3xl font-bold mb-6 text-orange-500">LeetCode</h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm text-white/60">
                <span>Total Questions</span>
                <span className="text-white font-bold">2500+</span>
              </div>
              <div className="flex gap-2">
                {['Easy', 'Medium', 'Hard'].map(tag => (
                  <span key={tag} className="text-xs px-3 py-1 bg-white/5 rounded-full border border-white/10">{tag}</span>
                ))}
              </div>
            </div>
            <button className="w-full py-4 bg-orange-500/10 border border-orange-500/20 rounded-xl font-bold hover:bg-orange-500 hover:text-black transition-all">
              Direct Solve
            </button>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="premium-glass p-10 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-3xl group-hover:bg-green-500/20 transition-all"></div>
            <h3 className="text-3xl font-bold mb-6 text-green-500">GeeksForGeeks</h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm text-white/60">
                <span>Topic Wise Practice</span>
                <span className="text-white font-bold">Available</span>
              </div>
              <div className="flex gap-2">
                {['SDE Sheets', 'Articles', 'Quizzes'].map(tag => (
                  <span key={tag} className="text-xs px-3 py-1 bg-white/5 rounded-full border border-white/10">{tag}</span>
                ))}
              </div>
            </div>
            <button className="w-full py-4 bg-green-500/10 border border-green-500/20 rounded-xl font-bold hover:bg-green-500 hover:text-black transition-all">
              Start Practice
            </button>
          </motion.div>
        </div>
      </section>

      {/* Subject Dashboard Preview Section */}
      <section className="section-container bg-secondary/50 border-y border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Organized Preparation</h2>
            <p className="text-white/40 text-lg">Every subject you need, structured into a premium dashboard experience. Track progress, solve questions, and master concepts.</p>
          </div>
          <Link href="/dashboard" className="premium-glass px-8 py-4 font-bold hover:bg-white hover:text-black transition-all">
            View Live Dashboard
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'JAVA', solved: '120/150', progress: 80 },
            { name: 'DSA', solved: '180/300', progress: 60 },
            { name: 'Aptitude', solved: '45/50', progress: 90 },
            { name: 'OS', solved: '30/100', progress: 30 }
          ].map((sub) => (
            <div key={sub.name} className="premium-glass p-6 hover:border-white/20 transition-all group">
              <h4 className="text-xl font-bold mb-2">{sub.name}</h4>
              <p className="text-white/40 text-sm mb-6">{sub.solved} Solved</p>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-white transition-all duration-1000" style={{ width: `${sub.progress}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </section>


      
      {/* Skill Improvement Timeline Placeholder */}
      <section className="section-container bg-secondary/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-20">Improve Every Day</h2>
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-white/10"></div>
            {[
              { step: '01', title: 'Learn Concepts', desc: 'Master the fundamentals with curated notes.' },
              { step: '02', title: 'Solve Problems', desc: 'Direct links to top platform questions.' },
              { step: '03', title: 'Build Consistency', desc: 'Maintain your streak with daily goals.' },
              { step: '04', title: 'Track Growth', desc: 'Advanced analytics for every subject.' },
              { step: '05', title: 'Crack Interviews', desc: 'Ace technical and HR rounds.' }
            ].map((item, index) => (
              <motion.div 
                key={item.step} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`flex items-center gap-10 md:gap-20 mb-20 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
              >
                <div className={`flex-1 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                  <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                  <p className="text-white/40">{item.desc}</p>
                </div>
                <div className="relative z-10 w-12 h-12 bg-black border border-white/20 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                  {item.step}
                </div>
                <div className="flex-1"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <BentoGrid />
      <CTA />
      <Footer />
    </main>
  );
}