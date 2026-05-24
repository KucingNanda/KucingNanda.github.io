import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Loader2, X } from 'lucide-react';
import { apiService } from '../../services/api';

const VaultManager = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiService.getVaults();
      setData(res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus data ini?")) return;
    try {
      await apiService.deleteVault(id);
      fetchData();
    } catch (err) {
      alert("Gagal menghapus: " + err.message);
    }
  };

  const openModal = (item = null) => {
    setIsEditing(!!item);
    if (item) {
      setFormData({ ...item });
    } else {
      setFormData({ platform: '', username: '', password: '', notes: '' });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      if (isEditing) await apiService.updateVault(formData.id, formData);
      else await apiService.createVault(formData);
      
      closeModal();
      fetchData();
    } catch (err) {
      alert("Gagal menyimpan data: " + err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-bold capitalize">Vault Management</h3>
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
                <th className="py-4 px-4 font-normal">Platform</th>
                <th className="py-4 px-4 font-normal">Username</th>
                <th className="py-4 px-4 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4 text-gray-400">{item.id}</td>
                  <td className="py-4 px-4 font-medium">{item.platform}</td>
                  <td className="py-4 px-4 text-sm text-gray-400">{item.username || '-'}</td>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0B0F19] border border-white/10 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h3 className="text-xl font-bold">{isEditing ? 'Edit' : 'Add'} Vault</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              <form id="vaultForm" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Nama Platform / Layanan</label>
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
              </form>
            </div>
            
            <div className="p-6 border-t border-white/10 bg-white/5 flex justify-end gap-3">
              <button onClick={closeModal} className="px-6 py-2 rounded-xl text-sm font-bold text-gray-400 hover:text-white transition-colors">Batal</button>
              <button type="submit" form="vaultForm" disabled={submitLoading} className="flex items-center gap-2 bg-[#8B5CF6] px-6 py-2 rounded-xl text-sm font-bold hover:bg-[#7c4dff] transition-colors disabled:opacity-50">
                {submitLoading ? <Loader2 size={16} className="animate-spin" /> : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaultManager;
