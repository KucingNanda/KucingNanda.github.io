import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Loader2, X } from 'lucide-react';
import { apiService } from '../../services/api';

const GalleryManager = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminGalleryFilter, setAdminGalleryFilter] = useState('All');

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiService.getGallery();
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
      await apiService.deleteGallery(id);
      fetchData();
    } catch (err) {
      alert("Gagal menghapus: " + err.message);
    }
  };

  const openModal = (item = null) => {
    setIsEditing(!!item);
    setSelectedFile(null);
    setPreviewUrl(null);
    if (item) {
      setFormData({ ...item });
    } else {
      setFormData({ title: '', image_url: '', info: 'AI Art', category: 'Lainnya', tags: '', artist_name: '', source_link: '' });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({});
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const payload = new FormData();
      payload.append('title', formData.title || '');
      payload.append('info', formData.info || 'AI Art');
      payload.append('category', formData.category || 'Lainnya');
      payload.append('tags', formData.tags || '');
      payload.append('artist_name', formData.artist_name || '');
      payload.append('source_link', formData.source_link || '');
      if (selectedFile) {
        payload.append('image', selectedFile);
      } else if (formData.image_url) {
        payload.append('image_url', formData.image_url);
      }
      
      if (isEditing) await apiService.updateGallery(formData.id, payload);
      else await apiService.createGallery(payload);
      
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
        <h3 className="text-xl font-bold capitalize">Gallery Management</h3>
        <button onClick={() => openModal()} className="flex items-center gap-2 bg-[#8B5CF6] px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#7c4dff] transition-colors">
          <Plus size={16} /> Add New
        </button>
      </div>

      <div className="mb-4">
        <select 
          value={adminGalleryFilter} 
          onChange={(e) => setAdminGalleryFilter(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#00F5FF]"
        >
          <option value="All" className="bg-[#0B0F19]">Semua Tipe Karya</option>
          <option value="AI Art" className="bg-[#0B0F19]">AI Art</option>
          <option value="Art" className="bg-[#0B0F19]">Art</option>
          <option value="Cosplay" className="bg-[#0B0F19]">Cosplay</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500 animate-pulse">Memuat data...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 text-sm">
                <th className="py-4 px-4 font-normal">ID</th>
                <th className="py-4 px-4 font-normal">Title</th>
                <th className="py-4 px-4 font-normal">Category / Info</th>
                <th className="py-4 px-4 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.filter(item => {
                if (adminGalleryFilter !== 'All') return item.info === adminGalleryFilter;
                return true;
              }).map((item, idx) => (
                <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4 text-gray-400">{item.id}</td>
                  <td className="py-4 px-4 font-medium">{item.title}</td>
                  <td className="py-4 px-4 text-sm text-gray-400">{item.category} / {item.info}</td>
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
              <h3 className="text-xl font-bold">{isEditing ? 'Edit' : 'Add'} Gallery</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              <form id="galleryForm" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Judul / Title</label>
                  <input type="text" name="title" value={formData.title || ''} onChange={handleInputChange} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00F5FF]" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Tipe Karya (Info)</label>
                    <select name="info" value={formData.info || 'AI Art'} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00F5FF]">
                      <option value="AI Art" className="bg-[#0B0F19]">AI Art</option>
                      <option value="Art" className="bg-[#0B0F19]">Art</option>
                      <option value="Cosplay" className="bg-[#0B0F19]">Cosplay</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Fandom / Game</label>
                    <select name="category" value={formData.category || 'Lainnya'} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00F5FF]">
                      <option value="Genshin Impact" className="bg-[#0B0F19]">Genshin Impact</option>
                      <option value="Honkai Star Rail" className="bg-[#0B0F19]">Honkai Star Rail</option>
                      <option value="Zenless Zone Zero" className="bg-[#0B0F19]">Zenless Zone Zero</option>
                      <option value="Lainnya" className="bg-[#0B0F19]">Lainnya</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Nama Artis Asli (Opsional)</label>
                    <input type="text" name="artist_name" value={formData.artist_name || ''} onChange={handleInputChange} placeholder="Ex: @KucingAbu" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00F5FF]" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Tautan Sumber (Opsional)</label>
                    <input type="url" name="source_link" value={formData.source_link || ''} onChange={handleInputChange} placeholder="https://..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00F5FF]" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Tags (pisahkan dengan koma)</label>
                  <input type="text" name="tags" value={formData.tags || ''} onChange={handleInputChange} placeholder="Raiden Shogun, Electro, Inazuma" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00F5FF]" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Upload Gambar (Wajib)</label>
                  <div className="border-2 border-dashed border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden bg-white/5 hover:bg-white/10 transition-colors">
                    {previewUrl || formData.image_url ? (
                      <div className="relative w-full aspect-[16/9] md:aspect-[21/9]">
                        <img src={previewUrl || formData.image_url} alt="Preview" className="w-full h-full object-contain rounded-xl" />
                      </div>
                    ) : (
                      <div className="py-8 text-center pointer-events-none">
                        <Plus size={32} className="mx-auto text-gray-500 mb-2" />
                        <span className="text-gray-500 text-sm">Klik untuk memilih gambar</span>
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={handleFileChange} required={!isEditing && !formData.image_url} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-white/10 bg-white/5 flex justify-end gap-3">
              <button onClick={closeModal} className="px-6 py-2 rounded-xl text-sm font-bold text-gray-400 hover:text-white transition-colors">Batal</button>
              <button type="submit" form="galleryForm" disabled={submitLoading} className="flex items-center gap-2 bg-[#8B5CF6] px-6 py-2 rounded-xl text-sm font-bold hover:bg-[#7c4dff] transition-colors disabled:opacity-50">
                {submitLoading ? <Loader2 size={16} className="animate-spin" /> : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryManager;
