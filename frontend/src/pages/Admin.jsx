import React, { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { Settings, LogOut, Home, Palette, Gamepad2, Lock, User } from 'lucide-react';
import GalleryManager from './admin/GalleryManager';
import GamesManager from './admin/GamesManager';
import VaultManager from './admin/VaultManager';
import ProfileManager from './admin/ProfileManager';

// Protected Route Component Wrapper
export const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

const Admin = () => {
  const [activeTab, setActiveTab] = useState('gallery');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const tabs = [
    { id: 'gallery', label: 'Gallery', icon: Palette },
    { id: 'games', label: 'Games', icon: Gamepad2 },
    { id: 'vault', label: 'Vault', icon: Lock },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto flex flex-col md:flex-row gap-8 min-h-[80vh]">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 shrink-0">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sticky top-28">
          <div className="flex items-center gap-3 mb-8">
            <Settings className="text-[#8B5CF6]" size={24} />
            <h2 className="text-xl font-bold">Admin Panel</h2>
          </div>
          
          <nav className="space-y-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === tab.id 
                      ? 'bg-[#8B5CF6]/20 text-[#8B5CF6] font-bold border border-[#8B5CF6]/30' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                  }`}
                >
                  <Icon size={18} /> {tab.label}
                </button>
              );
            })}
          </nav>

          <div className="mt-8 pt-8 border-t border-white/10 space-y-2">
            <Link to="/" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all">
              <Home size={18} /> Back to Hub
            </Link>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-all"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 relative min-h-full">
          {activeTab === 'gallery' && <GalleryManager />}
          {activeTab === 'games' && <GamesManager />}
          {activeTab === 'vault' && <VaultManager />}
          {activeTab === 'profile' && <ProfileManager />}
        </div>
      </main>

    </div>
  );
};

export default Admin;
