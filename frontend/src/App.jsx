import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Image as ImageIcon, Gamepad2, User, Menu, X,
  Activity, ArrowUpRight, Palette, Cpu, Sparkles, Filter, Maximize2, Search
} from 'lucide-react';
import { FaGithub, FaTwitter, FaInstagram } from 'react-icons/fa';

/**
 * Konfigurasi API Internal
 */
const API_BASE_URL = 'http://localhost:8080/api';

const apiService = {
  fetchAPI: async (endpoint, options = {}) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options,
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("API Call Error:", error);
      throw error;
    }
  },
  ping: () => apiService.fetchAPI('/ping'),
};

/**
 * Mock Data untuk Gallery
 */
const MOCK_GALLERY = [
  { id: 1, title: "Cyber Samurai", category: "Character", url: "https://images.unsplash.com/photo-1614728263952-84ea206f2c40?q=80&w=1000&auto=format&fit=crop", size: "large" },
  { id: 2, title: "Neon Cityscape", category: "Background", url: "https://images.unsplash.com/photo-1605806616949-1e87b487fc2f?q=80&w=1000&auto=format&fit=crop", size: "small" },
  { id: 3, title: "Android Dreams", category: "Experimental", url: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop", size: "medium" },
  { id: 4, title: "Mecha Unit-01", category: "Character", url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop", size: "medium" },
  { id: 5, title: "Futuristic Portal", category: "Experimental", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop", size: "large" },
  { id: 6, title: "Void Walker", category: "Character", url: "https://images.unsplash.com/photo-1633545505416-860803409172?q=80&w=1000&auto=format&fit=crop", size: "small" },
];

/**
 * Komponen Bento Card (Hanya untuk Home)
 */
const BentoCard = ({ title, subtitle, icon, link, size, colorClass, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    viewport={{ once: true }}
    className={`${size} group relative overflow-hidden rounded-3xl border border-white/10 bg-[#111827]/50 backdrop-blur-sm p-6 hover:border-${colorClass}/50 transition-all duration-500`}
  >
    <div className={`absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all text-${colorClass}`}>
      {icon}
    </div>

    <div className="h-full flex flex-col justify-end">
      <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-1">{subtitle}</p>
      <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
      <Link to={link} className={`inline-flex items-center gap-2 text-sm font-bold text-${colorClass} group-hover:gap-3 transition-all`}>
        Lihat Detail <ArrowUpRight size={16} />
      </Link>
    </div>
    <div className={`absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-${colorClass}/5 opacity-0 group-hover:opacity-100 transition-opacity`}></div>
  </motion.div>
);

const Navbar = ({ apiStatus }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/', icon: <Home size={18} /> },
    { name: 'Gallery', path: '/gallery', icon: <ImageIcon size={18} /> },
    { name: 'Gaming', path: '/gaming', icon: <Gamepad2 size={18} /> },
    { name: 'About', path: '/about', icon: <User size={18} /> },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center bg-[#111827]/60 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-3 shadow-2xl">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-[#8B5CF6] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.5)] group-hover:scale-110 transition-transform">
            <span className="font-bold text-xl italic text-white">G</span>
          </div>
          <span className="font-bold text-xl tracking-tighter text-white group-hover:text-[#00F5FF] transition-colors">
            GAMER<span className="text-[#00F5FF]">HUB</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center gap-2 font-medium transition-all duration-300 hover:text-[#00F5FF] ${location.pathname === link.path ? 'text-[#00F5FF] drop-shadow-[0_0_8px_#00F5FF]' : 'text-gray-400'
                }`}
            >
              {link.icon} {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
            <div className={`w-2 h-2 rounded-full ${apiStatus === 'online' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500'}`}></div>
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">API: {apiStatus}</span>
          </div>
        </div>

        <button className="md:hidden text-white p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>
    </nav>
  );
};

/**
 * HALAMAN UTAMA (HOMEPAGE)
 */
const HomePage = ({ apiStatus }) => (
  <div className="min-h-screen pt-24 pb-20 px-6">
    <section className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center py-20">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mb-6 px-4 py-1 border border-[#00F5FF]/30 bg-[#00F5FF]/5 rounded-full inline-flex items-center gap-2">
        <Activity size={14} className="text-[#00F5FF]" />
        <span className="text-xs font-mono text-[#00F5FF] tracking-widest uppercase">Status: {apiStatus === 'online' ? 'Operational' : 'Disconnected'}</span>
      </motion.div>
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-6xl md:text-8xl font-black mb-8 leading-none">
        GAMER <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#00F5FF] drop-shadow-[0_0_20px_rgba(139,92,246,0.3)]">PERSONAL HUB</span>
      </motion.h1>
      <p className="text-gray-400 max-w-2xl text-lg mb-12">Digital sanctuary untuk dokumentasi hobi, pameran karya AI Art, dan statistik gaming.</p>
    </section>

    <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
      <BentoCard title="AI Art Gallery" subtitle="Visual Showcase" icon={<Palette size={40} />} link="/gallery" size="md:col-span-2 md:row-span-2 min-h-[300px]" colorClass="[#8B5CF6]" delay={0.1} />
      <BentoCard title="Gaming Corner" subtitle="Progress & Stats" icon={<Gamepad2 size={40} />} link="/gaming" size="md:col-span-2 min-h-[200px]" colorClass="[#00F5FF]" delay={0.2} />
      <BentoCard title="About Me" subtitle="Identity" icon={<User size={40} />} link="/about" size="md:col-span-1 min-h-[200px]" colorClass="gray-400" delay={0.3} />
      <BentoCard title="Setup" subtitle="Hardware" icon={<Cpu size={40} />} link="/about" size="md:col-span-1 min-h-[200px]" colorClass="[#00F5FF]" delay={0.4} />
    </section>
  </div>
);

/**
 * HALAMAN GALLERY
 */
const GalleryPage = () => {
  const [filter, setFilter] = useState('All');
  const [selectedImg, setSelectedImg] = useState(null);
  const categories = ['All', 'Character', 'Background', 'Experimental'];

  const filteredItems = filter === 'All'
    ? MOCK_GALLERY
    : MOCK_GALLERY.filter(item => item.category === filter);

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto">
      {/* Header Halaman */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h2 className="text-4xl font-black mb-2 tracking-tight">MEDIA <span className="text-[#8B5CF6]">GALLERY</span></h2>
          <p className="text-gray-400">Koleksi karya visual yang dihasilkan melalui PixAI dan eksperimen digital.</p>
        </div>

        {/* Filter Chip */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${filter === cat
                ? 'bg-[#8B5CF6] border-[#8B5CF6] text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]'
                : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry Layout Grid */}
      <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        <AnimatePresence mode='popLayout'>
          {filteredItems.map((item) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ y: -5 }}
              className="relative group rounded-2xl overflow-hidden bg-[#111827] border border-white/5 cursor-pointer"
              onClick={() => setSelectedImg(item)}
            >
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                <span className="text-[#00F5FF] text-[10px] font-mono uppercase tracking-widest mb-1">{item.category}</span>
                <div className="flex justify-between items-center">
                  <h4 className="text-white font-bold text-lg">{item.title}</h4>
                  <div className="w-8 h-8 rounded-full bg-[#8B5CF6] flex items-center justify-center">
                    <Maximize2 size={14} className="text-white" />
                  </div>
                </div>
              </div>

              {/* Tag di pojok (selalu ada) */}
              <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-md rounded-lg text-[10px] font-bold text-white border border-white/10">
                {item.id.toString().padStart(2, '0')}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox / Modal Preview */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-black/95 backdrop-blur-xl"
            onClick={() => setSelectedImg(null)}
          >
            <button className="absolute top-10 right-10 text-white hover:text-[#00F5FF] transition-colors">
              <X size={32} />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-5xl w-full max-h-[85vh] relative"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={selectedImg.url}
                alt={selectedImg.title}
                className="w-full h-full object-contain rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)]"
              />
              <div className="mt-6 flex justify-between items-center bg-[#111827] p-6 rounded-2xl border border-white/10">
                <div>
                  <h3 className="text-2xl font-bold text-white">{selectedImg.title}</h3>
                  <p className="text-[#00F5FF] font-mono text-sm">{selectedImg.category} Collection</p>
                </div>
                <button className="px-6 py-2 bg-[#8B5CF6] text-white font-bold rounded-lg flex items-center gap-2 hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] transition-all">
                  DOWNLOAD <Sparkles size={16} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const GamingPage = () => <div className="pt-32 text-center text-3xl">Gaming Corner Section</div>;
const AboutPage = () => <div className="pt-32 text-center text-3xl">About Me Section</div>;

export default function App() {
  const [apiStatus, setApiStatus] = useState('offline');

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const data = await apiService.ping();
        if (data.message === 'pong') setApiStatus('online');
      } catch (err) {
        setApiStatus('offline');
      }
    };
    checkConnection();
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <div className="bg-[#0B0F19] min-h-screen text-white selection:bg-[#00F5FF] selection:text-[#0B0F19] relative overflow-hidden">

        {/* Background Decorative Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#8B5CF6]/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#00F5FF]/10 rounded-full blur-[120px]"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        </div>

        <Navbar apiStatus={apiStatus} />

        <main className="relative z-10">
          <Routes>
            <Route path="/" element={<HomePage apiStatus={apiStatus} />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/gaming" element={<GamingPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>

        <footer className="relative z-10 py-10 border-t border-white/5 mt-20 bg-[#0B0F19]">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-gray-500 text-sm">© 2024 Gamer Personal Hub.</div>
            <div className="flex gap-6">
              <FaTwitter className="text-gray-500 hover:text-[#00F5FF] cursor-pointer transition-colors" size={20} />
              <FaInstagram className="text-gray-500 hover:text-[#8B5CF6] cursor-pointer transition-colors" size={20} />
              <FaGithub className="text-gray-500 hover:text-white cursor-pointer transition-colors" size={20} />
            </div>
            <div className="text-gray-500 text-[10px] font-mono uppercase tracking-widest">v1.0.0-alpha</div>
          </div>
        </footer>
      </div>
    </Router>
  );
}