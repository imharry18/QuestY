'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-start pt-12 overflow-hidden">
      {/* Background Elements */}
      <div className="glow-orb w-[600px] h-[600px] bg-accent-blue top-[-200px] left-[-100px]" style={{'--accent-blue': '#4D8DFF'}}></div>
      <div className="glow-orb w-[500px] h-[500px] bg-accent-purple bottom-[-100px] right-[-100px]" style={{'--accent-purple': '#8B5CF6'}}></div>
      
      <div className="section-container relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="hero-heading text-gradient mb-6">
            Master Coding.<br />
            Crack Interviews.<br />
            Stay Consistent.
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            QuestY helps developers prepare smarter with streak tracking, curated coding questions, interview preparation, and skill analytics.
          </p>
          
          <div className="flex flex-col md:flex-row items-center gap-6 justify-center">
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-black px-10 py-4 rounded-full text-lg font-bold transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
              >
                Start Your Quest
              </motion.button>
            </Link>
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.1)' }}
                whileTap={{ scale: 0.95 }}
                className="premium-glass px-10 py-4 text-lg font-bold transition-all"
              >
                Explore Dashboard
              </motion.button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl mt-12 perspective-1000"
        >
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative premium-glass overflow-hidden rounded-2xl shadow-2xl">
              <Image 
                src="/dashboard-mockup.png" 
                alt="QuestY Dashboard Mockup" 
                width={1200} 
                height={800}
                className="w-full h-auto transition-transform duration-700 group-hover:scale-[1.02]"
                priority
              />
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Grid Overlay */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>
    </section>
  );
}
