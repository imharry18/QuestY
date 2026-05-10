'use client';

import { motion } from 'framer-motion';

export default function TrustStrip() {
  const logos = ['LeetCode', 'GeeksForGeeks', 'Codeforces', 'HackerRank'];
  
  return (
    <section className="py-20 border-y border-white/5 bg-secondary/50">
      <div className="section-container flex flex-col items-center gap-10 !py-0">
        <p className="text-white/40 text-sm font-medium uppercase tracking-widest text-center">
          Built for students preparing for top tech companies
        </p>
        <div className="flex flex-wrap justify-center gap-12 md:gap-24 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
          {logos.map((logo) => (
            <span key={logo} className="text-2xl font-bold tracking-tighter text-white">
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
