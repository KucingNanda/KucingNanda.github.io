import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Loader2, X } from 'lucide-react';
import { apiService } from '../../services/api';

const defaultTechStack = JSON.stringify([
  { category: "Frontend Core", stack: "React 19 + Vite", desc: "Rendering UI yang sangat cepat dan reaktif.", icon: "Layers" },
  { category: "Styling System", stack: "Tailwind CSS v3", desc: "Desain utilitas responsif dengan glassmorphism.", icon: "Palette" },
  { category: "Backend Engine", stack: "Golang + Gin", desc: "Arsitektur REST API dengan performa maksimal.", icon: "Server" },
  { category: "Data Layer", stack: "MySQL + GORM", desc: "Manajemen relasi database yang aman & otomatis.", icon: "Database" },
  { category: "Security", stack: "JWT Auth & Bcrypt", desc: "Sistem enkripsi sandi dan token untuk rute Admin.", icon: "Shield" },
  { category: "Micro-Animations", stack: "Framer Motion", desc: "Transisi interaktif dan pergerakan elemen dinamis.", icon: "Wand2" }
]);

const ProfileManager = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [profileEditMode, setProfileEditMode] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiService.getProfile();
      setProfileData(res);
    } catch (err) {
      setProfileData(null);
    } finally {
      setLoading(false);
    }
  };
  const openModal = (item = null, mode = null) => {
    setSelectedAvatar(null);
    setPreviewUrl(null);
    setProfileEditMode(mode);
    if (item) {
      setFormData({
        ...item,
        tech_stack: (!item.tech_stack || item.tech_stack === "[]" || item.tech_stack === "") ? defaultTechStack : item.tech_stack
      });
    } else {
      setFormData({ nickname: '', bio: '', current_status: '', social_links: '', tech_stack: defaultTechStack, avatar_url: '' });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({});
    setSelectedAvatar(null);
    setPreviewUrl(null);
    setProfileEditMode(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedAvatar(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

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
      const payload = new FormData();
      payload.append('nickname', formData.nickname || '');
      payload.append('bio', formData.bio || '');
      payload.append('current_status', formData.current_status || '');
      payload.append('social_links', formData.social_links || '');
      payload.append('tech_stack', formData.tech_stack || '');
      if (selectedAvatar) {
        payload.append('avatar', selectedAvatar);
      } else if (formData.avatar_url) {
        payload.append('avatar_url', formData.avatar_url);
      }

      if (profileData) await apiService.updateProfile(payload);
      else await apiService.createProfile(payload);
      
      closeModal();
      fetchData();
    } catch (err) {
      alert("Gagal menyimpan profil: " + err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-bold capitalize">Profile Management</h3>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500 animate-pulse">Memuat data...</div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          {profileData ? (
            <div className="space-y-6">
              {/* General Info */}
              <div className="bg-black/20 p-5 rounded-xl border border-white/5 relative group">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">General Info</h4>
                  <button onClick={() => openModal(profileData, 'basic')} className="text-blue-400 hover:bg-blue-400/10 p-1.5 rounded-lg transition-colors flex items-center gap-1 text-xs">
                    <Edit2 size={14} /> Edit
                  </button>
                </div>
                <div className="flex gap-6 items-start">
                  <div className="shrink-0 w-24 h-24 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center overflow-hidden">
                    {profileData.avatar_url ? (
                      <img src={profileData.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-500 text-xs text-center px-2">No Photo</span>
                    )}
                  </div>
                  <div className="space-y-3 flex-1">
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Nickname</p>
                    <p className="text-base font-medium">{profileData.nickname || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Bio</p>
                    <p className="text-sm whitespace-pre-wrap">{profileData.bio || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Current Status</p>
                      <p className="text-sm">{profileData.current_status || '-'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-black/20 p-5 rounded-xl border border-white/5 relative group">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Social Links</h4>
                  <button onClick={() => openModal(profileData, 'social')} className="text-blue-400 hover:bg-blue-400/10 p-1.5 rounded-lg transition-colors flex items-center gap-1 text-xs">
                    <Edit2 size={14} /> Edit
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(() => {
                    try {
                      const socials = JSON.parse(profileData.social_links || "{}");
                      const keys = Object.keys(socials).filter(k => socials[k]);
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

              {/* Tech Stack */}
              <div className="bg-black/20 p-5 rounded-xl border border-white/5 relative group">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Tech Stack</h4>
                  <button onClick={() => openModal(profileData, 'tech')} className="text-blue-400 hover:bg-blue-400/10 p-1.5 rounded-lg transition-colors flex items-center gap-1 text-xs">
                    <Edit2 size={14} /> Edit
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(() => {
                    try {
                      const stack = JSON.parse(profileData.tech_stack || "[]");
                      if (stack.length === 0) return <span className="text-sm text-gray-600">-</span>;
                      return stack.map((item, idx) => (
                        <div key={idx} className="px-3 py-1 bg-[#8B5CF6]/10 text-[#8B5CF6] rounded-lg text-xs border border-[#8B5CF6]/20">
                          <span className="opacity-70 font-mono uppercase mr-1">{item.category}:</span>
                          <span className="font-bold">{item.stack}</span>
                        </div>
                      ));
                    } catch(e) { return <span className="text-red-500 text-sm">Format tidak valid</span>; }
                  })()}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">Profil Anda belum diatur.</p>
              <button onClick={() => openModal(null, 'basic')} className="mx-auto flex items-center gap-2 bg-[#8B5CF6] px-6 py-2 rounded-xl text-sm font-bold hover:bg-[#7c4dff] transition-colors">
                <Plus size={16} /> Create Profile
              </button>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0B0F19] border border-white/10 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h3 className="text-xl font-bold capitalize">Edit {profileEditMode}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              <form id="profileForm" onSubmit={handleSubmit} className="space-y-4">
                {profileEditMode === 'basic' && (
                  <>
                    <div className="flex gap-6 items-center">
                      <div className="w-24 h-24 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center relative overflow-hidden shrink-0 group hover:border-[#00F5FF]/50 transition-colors">
                        {previewUrl || formData.avatar_url ? (
                          <img src={previewUrl || formData.avatar_url} alt="Avatar Preview" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-gray-500 text-xs text-center px-2">Upload Photo</span>
                        )}
                        <input type="file" accept="image/*" onChange={handleAvatarChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
                          <Edit2 size={16} className="text-white" />
                        </div>
                      </div>
                      <div className="flex-1 text-sm text-gray-400">
                        <p className="font-bold text-white mb-1">Foto Profil / Avatar</p>
                        <p>Klik kotak di samping untuk mengunggah foto profil Anda. (Disarankan rasio 1:1 persegi)</p>
                      </div>
                    </div>
                    
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
                      <textarea name="bio" value={formData.bio || ''} onChange={handleInputChange} rows="3" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00F5FF]" />
                    </div>
                  </>
                )}

                {profileEditMode === 'social' && (
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Social Links</label>
                    <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/5">
                      {(() => {
                        let parsedSocials = {};
                        try { parsedSocials = JSON.parse(formData.social_links || "{}"); } catch (e) {}
                        return ['instagram', 'github', 'facebook', 'discord'].map((platform) => (
                          <div key={platform} className="flex items-center gap-3">
                            <span className="w-20 text-xs text-gray-400 capitalize">{platform}</span>
                            <input type="url" placeholder={`https://${platform}.com/...`} value={parsedSocials[platform] || ''} onChange={(e) => handleSocialChange(platform, e.target.value)} className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00F5FF]" />
                          </div>
                        ));
                      })()}
                    </div>
                  </div>
                )}

                {profileEditMode === 'tech' && (
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
                )}
              </form>
            </div>
            
            <div className="p-6 border-t border-white/10 bg-white/5 flex justify-end gap-3">
              <button onClick={closeModal} className="px-6 py-2 rounded-xl text-sm font-bold text-gray-400 hover:text-white transition-colors">Batal</button>
              <button type="submit" form="profileForm" disabled={submitLoading} className="flex items-center gap-2 bg-[#8B5CF6] px-6 py-2 rounded-xl text-sm font-bold hover:bg-[#7c4dff] transition-colors disabled:opacity-50">
                {submitLoading ? <Loader2 size={16} className="animate-spin" /> : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileManager;
