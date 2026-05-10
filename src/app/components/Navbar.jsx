'use client';

import { motion } from 'framer-motion';
import { Box, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <div className="fixed top-8 left-0 right-0 z-50 flex justify-center px-4">
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="premium-glass flex items-center justify-between w-full max-w-4xl px-6 py-3"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <Box className="w-5 h-5 text-black" />
          </div>
          <span className="text-xl font-bold tracking-tight">QuestY</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {['Features', 'Subjects', 'Resources'].map((item) => (
            <Link 
              key={item} 
              href={`#${item.toLowerCase()}`}
              className="text-sm font-medium text-white/60 hover:text-white transition-colors"
            >
              {item}
            </Link>
          ))}
          <Link 
            href="/dashboard"
            className="text-sm font-medium text-white/60 hover:text-white transition-colors"
          >
            Dashboard
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium hover:text-white/80 transition-colors">
            Login
          </Link>
          <Link 
            href="/dashboard" 
            className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 hover:scale-105 transition-transform"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.nav>
    </div>
  );
}
