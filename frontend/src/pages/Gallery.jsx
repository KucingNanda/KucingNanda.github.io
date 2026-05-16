import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

const Gallery = () => (
  <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto text-center">
    <h2 className="text-5xl font-black mb-4 uppercase italic">Media <span className="text-[#8B5CF6]">Gallery</span></h2>
    <p className="text-gray-500 mb-12">Koleksi karya visual dari PixAI dan eksperimen digital.</p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="aspect-square bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group overflow-hidden relative">
          <ImageIcon className="text-white/10 group-hover:scale-110 transition-transform" size={40} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end text-left">
            <p className="text-[#00F5FF] font-mono text-[10px]">CHARACTER</p>
            <h4 className="font-bold">Project Neo Art #{i}</h4>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Gallery;
