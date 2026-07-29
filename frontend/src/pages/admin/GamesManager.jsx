import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Loader2, X } from 'lucide-react';
import { apiService } from '../../services/api';
import { CustomAlert } from '../../utils/alert';

const GamesManager = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiService.getGames();
      setData(res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await CustomAlert.confirmDelete();
    if (!result.isConfirmed) return;

    try {
      await apiService.deleteGame(id);
      CustomAlert.success('Terhapus!', 'Data game berhasil dihapus.');
      fetchData();
    } catch (err) {
      CustomAlert.error('Gagal Menghapus', err.message);
    }
  };

  const openModal = (item = null) => {
    setIsEditing(!!item);
    setSelectedIcon(null);
    setPreviewUrl(null);
    if (item) {
      setFormData({ ...item });
    } else {
      setFormData({ game_name: '', nickname: '', uid: '', description: '', favorite_character: '', bio: '', icon_url: '' });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({});
    setSelectedIcon(null);
    setPreviewUrl(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedIcon(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const payload = new FormData();
      payload.append('game_name', formData.game_name || '');
      payload.append('nickname', formData.nickname || '');
      payload.append('uid', formData.uid || '');
      payload.append('description', formData.description || '');
      payload.append('favorite_character', formData.favorite_character || '');
      payload.append('bio', formData.bio || '');
      if (selectedIcon) {
        payload.append('icon', selectedIcon);
      } else if (formData.icon_url) {
        payload.append('icon_url', formData.icon_url);
      }

      if (isEditing) await apiService.updateGame(formData.id, payload);
      else await apiService.createGame(payload);
      
      closeModal();
      CustomAlert.success('Berhasil!', `Data game berhasil ${isEditing ? 'diperbarui' : 'ditambahkan'}.`);
      fetchData();
    } catch (err) {
      CustomAlert.error('Gagal Menyimpan', err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-bold capitalize">Games Management</h3>
        <button onClick={() => openModal()} className="flex items-center gap-2 bg-[#8B5CF6] px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#7c4dff] transition-colors">
          <Plus size={16} /> Add New
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500 animate-pulse">Memuat data...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 text-sm">
                <th className="py-4 px-4 font-normal">ID</th>
                <th className="py-4 px-4 font-normal">Game Name</th>
                <th className="py-4 px-4 font-normal">UID</th>
                <th className="py-4 px-4 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4 text-gray-400">{item.id}</td>
                  <td className="py-4 px-4 font-medium">{item.game_name}</td>
                  <td className="py-4 px-4 text-sm text-gray-400">{item.uid || '-'}</td>
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
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm mt-16 md:mt-0">
          <div className="bg-[#0B0F19] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h3 className="text-xl font-bold">{isEditing ? 'Edit' : 'Add'} Game</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              <form id="gamesForm" onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-6 items-center">
                  <div className="w-20 h-20 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center relative overflow-hidden shrink-0 group hover:border-[#00F5FF]/50 transition-colors">
                    {previewUrl || formData.icon_url ? (
                      <img src={previewUrl || formData.icon_url} alt="Game Icon Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-500 text-[10px] text-center px-2">Upload Logo</span>
                    )}
                    <input type="file" accept="image/*" onChange={handleIconChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
                      <Edit2 size={16} className="text-white" />
                    </div>
                  </div>
                  <div className="flex-1 text-sm text-gray-400">
                    <p className="font-bold text-white mb-1">Ikon / Logo Game</p>
                    <p className="text-xs">Klik kotak di samping untuk mengunggah logo game. (Disarankan rasio 1:1 persegi)</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Nama Game</label>
                  <input type="text" name="game_name" value={formData.game_name || ''} onChange={handleInputChange} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00F5FF]" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Nickname (In-Game)</label>
                    <input type="text" name="nickname" value={formData.nickname || ''} onChange={handleInputChange} disabled={isEditing} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00F5FF] disabled:opacity-50 disabled:cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">UID / ID Player</label>
                    <input type="text" name="uid" value={formData.uid || ''} onChange={handleInputChange} disabled={isEditing} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00F5FF] disabled:opacity-50 disabled:cursor-not-allowed" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Karakter Favorit</label>
                    <input type="text" name="favorite_character" value={formData.favorite_character || ''} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00F5FF]" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Deskripsi Personal</label>
                  <textarea name="description" value={formData.description || ''} onChange={handleInputChange} rows="2" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00F5FF] resize-none"></textarea>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Bio Tambahan / Catatan Khusus</label>
                  <textarea name="bio" value={formData.bio || ''} onChange={handleInputChange} rows="3" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00F5FF] resize-none"></textarea>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-white/10 bg-white/5 flex justify-end gap-3">
              <button onClick={closeModal} className="px-6 py-2 rounded-xl text-sm font-bold text-gray-400 hover:text-white transition-colors">Batal</button>
              <button type="submit" form="gamesForm" disabled={submitLoading} className="flex items-center gap-2 bg-[#8B5CF6] px-6 py-2 rounded-xl text-sm font-bold hover:bg-[#7c4dff] transition-colors disabled:opacity-50">
                {submitLoading ? <Loader2 size={16} className="animate-spin" /> : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GamesManager;
