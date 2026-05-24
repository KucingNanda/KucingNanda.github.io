import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Loader2, X, Music } from 'lucide-react';
import { apiService } from '../../services/api';

const PlaylistManager = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiService.getPlaylist();
      setData(res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus lagu ini?")) return;
    try {
      await apiService.deletePlaylist(id);
      fetchData();
    } catch (err) {
      alert("Gagal menghapus: " + err.message);
    }
  };

  const openModal = (item = null) => {
    setIsEditing(!!item);
    setSelectedAudio(null);
    if (item) {
      setFormData({ ...item });
    } else {
      setFormData({ title: '', audio_url: '' });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({});
    setSelectedAudio(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedAudio(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const payload = new FormData();
      payload.append('title', formData.title || '');
      
      if (selectedAudio) {
        payload.append('audio', selectedAudio);
      } else if (formData.audio_url) {
        payload.append('audio_url', formData.audio_url);
      }

      if (isEditing) await apiService.updatePlaylist(formData.id, payload);
      else await apiService.createPlaylist(payload);
      
      closeModal();
      fetchData();
    } catch (err) {
      alert("Gagal menyimpan lagu: " + err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-bold capitalize">Playlist Management</h3>
        <button onClick={() => openModal()} className="flex items-center gap-2 bg-[#8B5CF6] px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#7c4dff] transition-colors">
          <Plus size={16} /> Add Song
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500 animate-pulse">Memuat data...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 text-sm">
                <th className="py-4 px-4 font-normal">No</th>
                <th className="py-4 px-4 font-normal">Title</th>
                <th className="py-4 px-4 font-normal">Status</th>
                <th className="py-4 px-4 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4 text-gray-400">{idx + 1}</td>
                  <td className="py-4 px-4 font-medium flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#8B5CF6]/20 flex items-center justify-center text-[#8B5CF6]">
                      <Music size={14} />
                    </div>
                    {item.title}
                  </td>
                  <td className="py-4 px-4 text-sm text-[#00F5FF]">
                    {item.audio_url ? 'File Terpasang' : '-'}
                  </td>
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
                  <td colSpan="4" className="py-12 text-center text-gray-500 italic">Belum ada lagu di dalam playlist.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0B0F19] border border-white/10 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h3 className="text-xl font-bold">{isEditing ? 'Edit' : 'Add'} Song</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              <form id="playlistForm" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Judul Lagu</label>
                  <input type="text" name="title" value={formData.title || ''} onChange={handleInputChange} required placeholder="Ex: ZZZ Main Theme" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00F5FF]" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">File Audio (.mp3)</label>
                  <input type="file" accept="audio/mp3,audio/*" onChange={handleAudioChange} required={!isEditing && !formData.audio_url} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#8B5CF6]/10 file:text-[#8B5CF6] hover:file:bg-[#8B5CF6]/20 transition-colors" />
                  {(formData.audio_url || selectedAudio) && (
                    <p className="text-xs text-[#00F5FF] mt-2">File audio sudah {selectedAudio ? 'dipilih' : 'tersimpan'}.</p>
                  )}
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-white/10 bg-white/5 flex justify-end gap-3">
              <button onClick={closeModal} className="px-6 py-2 rounded-xl text-sm font-bold text-gray-400 hover:text-white transition-colors">Batal</button>
              <button type="submit" form="playlistForm" disabled={submitLoading} className="flex items-center gap-2 bg-[#8B5CF6] px-6 py-2 rounded-xl text-sm font-bold hover:bg-[#7c4dff] transition-colors disabled:opacity-50">
                {submitLoading ? <Loader2 size={16} className="animate-spin" /> : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistManager;
