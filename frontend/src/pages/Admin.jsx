import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Settings, LogOut, Plus, Trash2, Edit2, X, Loader2 } from 'lucide-react';
import { apiService } from '../services/api';

// Protected Route Component Wrapper
export const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

const Admin = () => {
  const [activeTab, setActiveTab] = useState('gallery');
  const [data, setData] = useState([]);
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
      } else {
        setData([]); // Profile handled separately
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
      fetchData();
    } catch (err) {
      alert("Gagal menghapus: " + err.message);
    }
  };

  const openModal = (item = null) => {
    setIsEditing(!!item);
    if (item) {
      setFormData(item);
    } else {
      if (activeTab === 'gallery') setFormData({ title: '', image_url: '', category: 'CHARACTER', tags: '' });
      if (activeTab === 'games') setFormData({ game_name: '', uid: '', favorite_character: '', progress: 0 });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'progress' ? Number(value) : value }));
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
        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-colors font-medium shrink-0">
          <LogOut size={18} /> Logout
        </button>
      </div>

      <div className="flex gap-2 mb-8 border-b border-white/10 pb-4 overflow-x-auto">
        {['gallery', 'games', 'profile'].map(tab => (
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
        ) : (
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
                    <td className="py-4 px-4 font-medium">{item.title || item.game_name || item.nickname}</td>
                    <td className="py-4 px-4 text-sm text-gray-400">{item.category || item.uid || '-'}</td>
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
                {data.length === 0 && activeTab !== 'profile' && (
                  <tr>
                    <td colSpan="4" className="py-12 text-center text-gray-500 italic">Tidak ada data untuk ditampilkan.</td>
                  </tr>
                )}
                {activeTab === 'profile' && (
                  <tr>
                    <td colSpan="4" className="py-12 text-center text-gray-500 italic">Fitur kelola profil (Bio, Status, dll) akan segera hadir di sini.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal / Form Popup */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0B0F19] border border-white/10 rounded-3xl p-6 w-full max-w-md relative">
            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
              <X size={24} />
            </button>
            <h3 className="text-2xl font-bold mb-6">{isEditing ? 'Edit' : 'Add'} {activeTab === 'gallery' ? 'Gallery Item' : 'Game'}</h3>
            
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
                      <label className="block text-sm text-gray-400 mb-1">UID</label>
                      <input type="text" name="uid" value={formData.uid || ''} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00F5FF]" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Progress (%)</label>
                      <input type="number" min="0" max="100" name="progress" value={formData.progress || 0} onChange={handleInputChange} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00F5FF]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Favorite Character</label>
                    <input type="text" name="favorite_character" value={formData.favorite_character || ''} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00F5FF]" />
                  </div>
                </>
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
