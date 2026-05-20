import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { Settings, LogOut, Plus, Trash2, Edit2, X, Loader2, Home } from 'lucide-react';
import { apiService } from '../services/api';

// Protected Route Component Wrapper
export const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

const defaultTechStack = JSON.stringify([
  { category: "Frontend Core", stack: "React 19 + Vite", desc: "Rendering UI yang sangat cepat dan reaktif.", icon: "Layers" },
  { category: "Styling System", stack: "Tailwind CSS v3", desc: "Desain utilitas responsif dengan glassmorphism.", icon: "Palette" },
  { category: "Backend Engine", stack: "Golang + Gin", desc: "Arsitektur REST API dengan performa maksimal.", icon: "Server" },
  { category: "Data Layer", stack: "MySQL + GORM", desc: "Manajemen relasi database yang aman & otomatis.", icon: "Database" },
  { category: "Security", stack: "JWT Auth & Bcrypt", desc: "Sistem enkripsi sandi dan token untuk rute Admin.", icon: "Shield" },
  { category: "Micro-Animations", stack: "Framer Motion", desc: "Transisi interaktif dan pergerakan elemen dinamis.", icon: "Wand2" }
]);

const Admin = () => {
  const [activeTab, setActiveTab] = useState('gallery');
  const [data, setData] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'gallery') {
        const res = await apiService.getGallery();
        setData(res || []);
      } else if (activeTab === 'games') {
        const res = await apiService.getGames();
        setData(res || []);
      } else if (activeTab === 'vault') {
        const res = await apiService.getVaults();
        setData(res || []);
      } else if (activeTab === 'profile') {
        try {
          const res = await apiService.getProfile();
          setProfileData(res);
        } catch (err) {
          setProfileData(null); // Profile belum ada
        }
      }
    } catch (err) {
      if (err.message === "Unauthorized") {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus data ini?")) return;
    try {
      if (activeTab === 'gallery') await apiService.deleteGallery(id);
      if (activeTab === 'games') await apiService.deleteGame(id);
      if (activeTab === 'vault') await apiService.deleteVault(id);
      fetchData();
    } catch (err) {
      alert("Gagal menghapus: " + err.message);
    }
  };

  const openModal = (item = null) => {
    setIsEditing(!!item);
    if (item) {
      setFormData({
        ...item,
        tech_stack: (activeTab === 'profile' && (!item.tech_stack || item.tech_stack === "[]" || item.tech_stack === "")) ? defaultTechStack : item.tech_stack
      });
    } else {
      if (activeTab === 'gallery') setFormData({ title: '', image_url: '', category: 'CHARACTER', tags: '' });
      if (activeTab === 'games') setFormData({ game_name: '', nickname: '', uid: '', bio: '' });
      if (activeTab === 'vault') setFormData({ platform: '', username: '', password: '', notes: '' });
      if (activeTab === 'profile') setFormData({ nickname: '', bio: '', current_status: '', social_links: '', tech_stack: defaultTechStack });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // UX Handlers for JSON Profile Data
  const handleSocialChange = (platform, value) => {
    let currentSocials = {};
    try { currentSocials = JSON.parse(formData.social_links || "{}"); } catch (e) {}
    if (!value) delete currentSocials[platform];
    else currentSocials[platform] = value;
    setFormData(prev => ({ ...prev, social_links: JSON.stringify(currentSocials) }));
  };

  const handleTechStackChange = (index, field, value) => {
    try {
      let currentStack = JSON.parse(formData.tech_stack || "[]");
      currentStack[index] = { ...currentStack[index], [field]: value };
      setFormData(prev => ({ ...prev, tech_stack: JSON.stringify(currentStack) }));
    } catch (e) {}
  };

  const addTechStackItem = () => {
    try {
      let currentStack = JSON.parse(formData.tech_stack || "[]");
      currentStack.push({ category: "", stack: "", desc: "", icon: "Code" });
      setFormData(prev => ({ ...prev, tech_stack: JSON.stringify(currentStack) }));
    } catch (e) {
      setFormData(prev => ({ ...prev, tech_stack: JSON.stringify([{ category: "", stack: "", desc: "", icon: "Code" }]) }));
    }
  };

  const removeTechStackItem = (index) => {
    try {
      let currentStack = JSON.parse(formData.tech_stack || "[]");
      currentStack.splice(index, 1);
      setFormData(prev => ({ ...prev, tech_stack: JSON.stringify(currentStack) }));
    } catch (e) {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      if (activeTab === 'gallery') {
        if (isEditing) await apiService.updateGallery(formData.id, formData);
        else await apiService.createGallery(formData);
      } else if (activeTab === 'games') {
        if (isEditing) await apiService.updateGame(formData.id, formData);
        else await apiService.createGame(formData);
      } else if (activeTab === 'vault') {
        if (isEditing) await apiService.updateVault(formData.id, formData);
        else await apiService.createVault(formData);
      } else if (activeTab === 'profile') {
        if (profileData) await apiService.updateProfile(formData);
        else await apiService.createProfile(formData);
      }
      closeModal();
      fetchData();
    } catch (err) {
      alert("Gagal menyimpan data: " + err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-4xl font-black flex items-center gap-3">
            <Settings className="text-[#00F5FF]" size={36} /> Admin Panel
          </h2>
          <p className="text-gray-400 mt-2">Kelola konten website Anda dengan mudah.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 px-4 py-2 bg-white/5 text-gray-300 border border-white/10 rounded-xl hover:bg-white/10 transition-colors font-medium shrink-0">
            <Home size={18} /> Back to Home
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-colors font-medium shrink-0">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-8 border-b border-white/10 pb-4 overflow-x-auto">
        {['gallery', 'games', 'vault', 'profile'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-full text-sm font-bold capitalize transition-colors whitespace-nowrap ${activeTab === tab ? 'bg-white/10 text-white border border-white/20' : 'text-gray-500 hover:text-gray-300'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold capitalize">{activeTab} Management</h3>
          {activeTab !== 'profile' && (
            <button onClick={() => openModal()} className="flex items-center gap-2 bg-[#8B5CF6] px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#7c4dff] transition-colors">
              <Plus size={16} /> Add New
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-500 animate-pulse">Memuat data...</div>
        ) : activeTab !== 'profile' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-sm">
                  <th className="py-4 px-4 font-normal">ID</th>
                  <th className="py-4 px-4 font-normal">Title / Name</th>
                  <th className="py-4 px-4 font-normal">Category / Info</th>
                  <th className="py-4 px-4 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, idx) => (
                  <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 text-gray-400">{item.id}</td>
                    <td className="py-4 px-4 font-medium">{item.title || item.game_name || item.platform || item.nickname}</td>
                    <td className="py-4 px-4 text-sm text-gray-400">{item.category || item.uid || item.username || '-'}</td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openModal(item)} className="text-blue-400 hover:bg-blue-400/10 p-2 rounded-lg transition-colors">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {data.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-12 text-center text-gray-500 italic">Tidak ada data untuk ditampilkan.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            {profileData ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Nickname</p>
                  <p className="text-lg font-medium">{profileData.nickname || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Bio</p>
                  <p className="text-base whitespace-pre-wrap">{profileData.bio || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Current Status</p>
                  <p className="text-base">{profileData.current_status || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-2">Social Links</p>
                  <div className="flex flex-wrap gap-3">
                    {(() => {
                      try {
                        const socials = JSON.parse(profileData.social_links || "{}");
                        const keys = Object.keys(socials);
                        if (keys.length === 0) return <span className="text-sm text-gray-600">-</span>;
                        return keys.map(k => (
                          <div key={k} className="px-3 py-1 bg-[#00F5FF]/10 text-[#00F5FF] rounded-lg text-sm border border-[#00F5FF]/20 capitalize">
                            {k}
                          </div>
                        ));
                      } catch(e) { return <span className="text-red-500 text-sm">Format tidak valid</span>; }
                    })()}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-2">Tech Stack</p>
                  <div className="flex flex-wrap gap-3">
                    {(() => {
                      try {
                        const stack = JSON.parse(profileData.tech_stack || "[]");
                        if (stack.length === 0) return <span className="text-sm text-gray-600">-</span>;
                        return stack.map((item, idx) => (
                          <div key={idx} className="px-3 py-1 bg-[#8B5CF6]/10 text-[#8B5CF6] rounded-lg text-sm border border-[#8B5CF6]/20">
                            <span className="opacity-70 font-mono text-xs uppercase mr-2">{item.category}:</span>
                            <span className="font-bold">{item.stack}</span>
                          </div>
                        ));
                      } catch(e) { return <span className="text-red-500 text-sm">Format tidak valid</span>; }
                    })()}
                  </div>
                </div>
                <button onClick={() => openModal(profileData)} className="mt-4 flex items-center gap-2 bg-[#8B5CF6] px-6 py-2 rounded-xl text-sm font-bold hover:bg-[#7c4dff] transition-colors">
                  <Edit2 size={16} /> Edit Profile
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">Profil Anda belum diatur.</p>
                <button onClick={() => openModal()} className="mx-auto flex items-center gap-2 bg-[#8B5CF6] px-6 py-2 rounded-xl text-sm font-bold hover:bg-[#7c4dff] transition-colors">
                  <Plus size={16} /> Create Profile
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal / Form Popup */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0B0F19] border border-white/10 rounded-3xl p-6 w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
              <X size={24} />
            </button>
            <h3 className="text-2xl font-bold mb-6">{isEditing ? 'Edit' : 'Add'} {activeTab === 'gallery' ? 'Gallery Item' : activeTab === 'vault' ? 'Credential' : activeTab === 'profile' ? 'Profile' : 'Game'}</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === 'gallery' && (
                <>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Title</label>
                    <input type="text" name="title" value={formData.title || ''} onChange={handleInputChange} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00F5FF]" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Image URL</label>
                    <input type="url" name="image_url" value={formData.image_url || ''} onChange={handleInputChange} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00F5FF]" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Category</label>
                      <input type="text" name="category" value={formData.category || ''} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00F5FF]" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Tags (comma separated)</label>
                      <input type="text" name="tags" value={formData.tags || ''} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00F5FF]" />
                    </div>
                  </div>
                </>
              )}
              
              {activeTab === 'games' && (
                <>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Game Name</label>
                    <input type="text" name="game_name" value={formData.game_name || ''} onChange={handleInputChange} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00F5FF]" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Nickname</label>
                      <input type="text" name="nickname" value={formData.nickname || ''} onChange={handleInputChange} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00F5FF]" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">UID/ID</label>
                      <input type="text" name="uid" value={formData.uid || ''} onChange={handleInputChange} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00F5FF]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Short Bio</label>
                    <textarea name="bio" value={formData.bio || ''} onChange={handleInputChange} rows="3" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00F5FF]" />
                  </div>
                </>
              )}

              {activeTab === 'vault' && (
                <>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Platform / Application Name</label>
                    <input type="text" name="platform" value={formData.platform || ''} onChange={handleInputChange} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00F5FF]" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Username / Email</label>
                      <input type="text" name="username" value={formData.username || ''} onChange={handleInputChange} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00F5FF]" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Password</label>
                      <input type="text" name="password" value={formData.password || ''} onChange={handleInputChange} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00F5FF]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Catatan Tambahan</label>
                    <textarea name="notes" value={formData.notes || ''} onChange={handleInputChange} rows="3" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00F5FF]" />
                  </div>
                </>
              )}

              {activeTab === 'profile' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Nickname</label>
                      <input type="text" name="nickname" value={formData.nickname || ''} onChange={handleInputChange} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00F5FF]" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Status Saat Ini</label>
                      <input type="text" name="current_status" value={formData.current_status || ''} onChange={handleInputChange} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00F5FF]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Bio Singkat</label>
                    <textarea name="bio" value={formData.bio || ''} onChange={handleInputChange} rows="2" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00F5FF]" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Social Links</label>
                    <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/5">
                      {(() => {
                        let parsedSocials = {};
                        try { parsedSocials = JSON.parse(formData.social_links || "{}"); } catch (e) {}
                        return ['instagram', 'github', 'facebook', 'twitter'].map((platform) => (
                          <div key={platform} className="flex items-center gap-3">
                            <span className="w-20 text-xs text-gray-400 capitalize">{platform}</span>
                            <input type="url" placeholder={`https://${platform}.com/...`} value={parsedSocials[platform] || ''} onChange={(e) => handleSocialChange(platform, e.target.value)} className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00F5FF]" />
                          </div>
                        ));
                      })()}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Project Architecture (Tech Stack)</label>
                    <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/5">
                      {(() => {
                        let parsedStack = [];
                        try { parsedStack = JSON.parse(formData.tech_stack || "[]"); } catch (e) { parsedStack = []; }
                        return parsedStack.map((item, idx) => (
                          <div key={idx} className="p-4 bg-black/40 border border-white/10 rounded-xl relative group">
                            <button type="button" onClick={() => removeTechStackItem(idx)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-500/10 rounded-lg" title="Hapus">
                              <Trash2 size={16} />
                            </button>
                            <div className="grid grid-cols-2 gap-3 mb-3 pr-8">
                              <div>
                                <label className="block text-[10px] text-gray-500 mb-1 uppercase">Category</label>
                                <input type="text" placeholder="Frontend Core" value={item.category || ''} onChange={(e) => handleTechStackChange(idx, 'category', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00F5FF]" />
                              </div>
                              <div>
                                <label className="block text-[10px] text-gray-500 mb-1 uppercase">Stack</label>
                                <input type="text" placeholder="React 19" value={item.stack || ''} onChange={(e) => handleTechStackChange(idx, 'stack', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00F5FF]" />
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                              <div className="col-span-2">
                                <label className="block text-[10px] text-gray-500 mb-1 uppercase">Description</label>
                                <input type="text" placeholder="Deskripsi singkat" value={item.desc || ''} onChange={(e) => handleTechStackChange(idx, 'desc', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00F5FF]" />
                              </div>
                              <div>
                                <label className="block text-[10px] text-gray-500 mb-1 uppercase">Icon</label>
                                <select value={item.icon || 'Code'} onChange={(e) => handleTechStackChange(idx, 'icon', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00F5FF] text-white">
                                  <option value="Code" className="bg-[#0B0F19]">Code</option>
                                  <option value="Layers" className="bg-[#0B0F19]">Layers</option>
                                  <option value="Palette" className="bg-[#0B0F19]">Palette</option>
                                  <option value="Server" className="bg-[#0B0F19]">Server</option>
                                  <option value="Database" className="bg-[#0B0F19]">Database</option>
                                  <option value="Shield" className="bg-[#0B0F19]">Shield</option>
                                  <option value="Wand2" className="bg-[#0B0F19]">Wand2</option>
                                  <option value="Cpu" className="bg-[#0B0F19]">Cpu</option>
                                  <option value="Monitor" className="bg-[#0B0F19]">Monitor</option>
                                  <option value="Terminal" className="bg-[#0B0F19]">Terminal</option>
                                  <option value="Smartphone" className="bg-[#0B0F19]">Smartphone</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        ));
                      })()}
                      <button type="button" onClick={addTechStackItem} className="w-full py-3 mt-2 border border-dashed border-white/20 rounded-xl text-gray-400 hover:text-white hover:border-[#00F5FF]/50 transition-colors flex items-center justify-center gap-2 text-sm font-bold bg-white/5 hover:bg-white/10">
                        <Plus size={16} /> Tambah Tech Stack
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <button type="submit" disabled={submitLoading} className="w-full bg-[#00F5FF] hover:bg-[#00d1da] text-black font-bold py-3 rounded-xl transition-colors flex justify-center items-center mt-4">
                {submitLoading ? <Loader2 className="animate-spin" size={20} /> : 'Save Data'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
