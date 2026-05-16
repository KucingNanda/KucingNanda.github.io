import React from 'react';
import { motion } from 'framer-motion';
import { Gamepad2 } from 'lucide-react';

const Gaming = () => (
  <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
      <div>
        <h2 className="text-5xl font-black mb-2 italic">Gaming <span className="text-[#00F5FF]">Corner</span></h2>
        <p className="text-gray-500 tracking-tight">Perpustakaan game aktif dan progres pencapaian.</p>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {['Genshin Impact', 'Honkai Star Rail'].map((game, idx) => (
        <div key={game} className="p-8 bg-white/5 border border-white/10 rounded-3xl flex gap-6 items-center group">
          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${idx === 0 ? 'from-[#8B5CF6]' : 'from-[#00F5FF]'} to-black flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform`}>
            <Gamepad2 className="text-white" />
          </div>
          <div className="flex-1">
            <h4 className="text-xl font-bold mb-4">{game}</h4>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: idx === 0 ? '85%' : '60%' }}
                className={`h-full ${idx === 0 ? 'bg-[#8B5CF6]' : 'bg-[#00F5FF]'}`}
              />
            </div>
            <div className="flex justify-between mt-2 text-[10px] font-mono text-gray-500 uppercase">
              <span>Progress</span>
              <span>{idx === 0 ? '85%' : '60%'}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Gaming;
