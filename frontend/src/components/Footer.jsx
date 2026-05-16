import React from 'react';
import { FaTwitter, FaInstagram, FaGithub } from 'react-icons/fa';

const Footer = () => (
  <footer className="py-12 border-t border-white/5 mt-20 relative z-10 bg-[#0B0F19]">
    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 opacity-40 hover:opacity-100 transition-opacity">
      <p className="text-xs font-mono">© 2026 Gamer Personal Hub.</p>
      <div className="flex gap-8">
        <FaTwitter size={18} className="cursor-pointer hover:text-[#00F5FF] transition-colors" />
        <FaInstagram size={18} className="cursor-pointer hover:text-[#8B5CF6] transition-colors" />
        <FaGithub size={18} className="cursor-pointer hover:text-white transition-colors" />
      </div>
      <p className="text-[10px] tracking-widest font-mono uppercase text-[#00F5FF]">v1.0.0-clean</p>
    </div>
  </footer>
);

export default Footer;
