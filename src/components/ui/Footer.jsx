import React from 'react';
import { LayoutGrid, Twitter, Linkedin, Github, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 dark:border-white/10 bg-white/50 dark:bg-black/50 backdrop-blur-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600">
                <LayoutGrid className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">QuestY</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed">
              Designed for developers who want to track their progress with precision and style.
            </p>
          </div>

          {/* Links 1 */}
          <div>
            <h3 className="text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Product</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</a></li>
              <li><a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Roadmap</a></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h3 className="text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Community</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Github</a></li>
              <li><a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Discord</a></li>
            </ul>
          </div>

          {/* Socials */}
          <div>
             <h3 className="text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Connect</h3>
             <div className="flex gap-4">
               <a href="#" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"><Github size={20} /></a>
               <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors"><Twitter size={20} /></a>
               <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors"><Linkedin size={20} /></a>
             </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-500">© 2026 QuestY. All rights reserved.</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 flex items-center gap-1">
            Made with <Heart size={14} className="text-red-500 fill-red-500" /> by Harry
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;