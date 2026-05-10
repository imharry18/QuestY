'use client';

import { motion } from 'framer-motion';
import { Code2, Users, Mail } from 'lucide-react';
import Link from 'next/link';

export function CTA() {
  return (
    <section className="relative py-40 overflow-hidden">
      <div className="glow-orb w-[800px] h-[800px] bg-blue-600/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-[160px]"></div>
      
      <div className="section-container relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-10 tracking-tighter">
            Your Dream Company <br /> Starts Here.
          </h2>
          <Link href="/dashboard">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-black px-12 py-5 rounded-full text-xl font-bold hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] transition-all"
            >
              Enter QuestY
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 bg-secondary">
      <div className="section-container flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="max-w-xs">
          <h3 className="text-2xl font-bold mb-4">QuestY</h3>
          <p className="text-white/40 text-sm">
            The ultimate coding battlefield for developers. Build consistency, crack interviews, and become elite.
          </p>
        </div>
        
        <div className="flex gap-20">
          <div className="flex flex-col gap-4">
            <span className="font-bold text-sm uppercase tracking-widest text-white/40">Resources</span>
            <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">GitHub</a>
            <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">LinkedIn</a>
            <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">Contact</a>
          </div>
          <div className="flex flex-col gap-4">
            <span className="font-bold text-sm uppercase tracking-widest text-white/40">Product</span>
            <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">Features</a>
            <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">Subjects</a>
            <Link href="/dashboard" className="text-sm text-white/60 hover:text-white transition-colors">Dashboard</Link>
          </div>
        </div>
      </div>
      <div className="section-container !py-8 border-t border-white/5 mt-12 flex justify-between items-center">
        <p className="text-white/20 text-xs">© 2026 QuestY. Every Question Builds You.</p>
        <div className="flex gap-6">
          <Code2 className="w-4 h-4 text-white/20 hover:text-white transition-colors cursor-pointer" />
          <Users className="w-4 h-4 text-white/20 hover:text-white transition-colors cursor-pointer" />
          <Mail className="w-4 h-4 text-white/20 hover:text-white transition-colors cursor-pointer" />
        </div>
      </div>
    </footer>
  );
}
