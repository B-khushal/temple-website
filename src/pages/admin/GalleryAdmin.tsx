import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { api } from '../../lib/api';
import { Plus, Trash2, Edit2, Image, Film, Search, Filter } from 'lucide-react';

export function GalleryAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Form states
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('image');
  const [url, setUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [album, setAlbum] = useState('General');
  const [category, setCategory] = useState('Rituals');
  const [order, setOrder] = useState('0');
  const [formError, setFormError] = useState('');
  const [uploading, setUploading] = useState(false);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/gallery');
      if (res.success) {
        setItems(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setFormError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/api/uploads', formData);
      if (res.success && res.url) {
        setUrl(res.url);
        if (file.type.startsWith('image/')) {
          setThumbnailUrl(res.url);
        }
      }
    } catch (err: any) {
      setFormError(err.message || 'File upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this media item from gallery?')) return;
    try {
      const res = await api.delete(`/api/gallery/${id}`);
      if (res.success) {
        fetchMedia();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenEdit = (item: any) => {
    setEditingId(item._id);
    setTitle(item.title);
    setType(item.type);
    setUrl(item.url);
    setThumbnailUrl(item.thumbnailUrl || '');
    setAlbum(item.album);
    setCategory(item.category);
    setOrder(item.order.toString());
    setFormError('');
    setShowModal(true);
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setTitle('');
    setType('image');
    setUrl('');
    setThumbnailUrl('');
    setAlbum('General');
    setCategory('Rituals');
    setOrder('0');
    setFormError('');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const body = {
      title,
      type,
      url,
      thumbnailUrl,
      album,
      category,
      order: Number(order),
    };

    try {
      let res;
      if (editingId) {
        res = await api.put(`/api/gallery/${editingId}`, body);
      } else {
        res = await api.post('/api/gallery', body);
      }

      if (res.success) {
        setShowModal(false);
        fetchMedia();
      }
    } catch (err: any) {
      setFormError(err.message || 'Operation failed');
    }
  };

  const filteredItems = Array.isArray(items) ? items.filter(item => 
    (item.title || '').toLowerCase().includes(search.toLowerCase()) || 
    (item.album || '').toLowerCase().includes(search.toLowerCase())
  ) : [];

  return (
    <div className="space-y-6 font-serif">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold italic tracking-tight text-[#3E2723]">Gallery CMS</h2>
          <p className="text-xs uppercase tracking-widest text-gray-500 font-sans mt-1">
            Upload images/videos, set category albums, and manage photo archives.
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="flex items-center gap-2 font-sans text-xs">
          <Plus className="w-4 h-4" /> Add Media
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="p-4 border-b border-gray-100 flex justify-between bg-gray-50/50 font-sans text-xs">
            <div className="relative max-w-sm w-full font-sans">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search by title or album..." 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                className="w-full pl-9 pr-4 py-2 border rounded-full focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white" 
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-gray-50 text-gray-400 uppercase tracking-tighter border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 font-bold">Thumbnail</th>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Album / Category</th>
                  <th className="px-6 py-3">Order</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredItems.map(item => (
                  <tr key={item._id} className="hover:bg-orange-50/10 transition-colors">
                    <td className="px-6 py-3">
                      <img 
                        src={item.thumbnailUrl || item.url} 
                        alt="thumbnail" 
                        className="w-12 h-12 object-cover rounded-lg border border-gray-100 bg-gray-50"
                      />
                    </td>
                    <td className="px-6 py-3 font-bold text-gray-800">{item.title}</td>
                    <td className="px-6 py-3">
                      <span className="flex items-center gap-1.5">
                        {item.type === 'video' ? <Film className="w-3.5 h-3.5 text-[#9B2226]" /> : <Image className="w-3.5 h-3.5 text-blue-600" />}
                        <span className="capitalize">{item.type}</span>
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span className="font-bold">{item.album}</span>
                      <span className="text-gray-400 block text-[10px]">{item.category}</span>
                    </td>
                    <td className="px-6 py-3 font-mono">{item.order}</td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => handleOpenEdit(item)} className="text-gray-500 hover:text-gray-700 bg-transparent border-0"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(item._id)} className="text-red-500 hover:text-red-700 bg-transparent border-0"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredItems.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-400 italic">
                      No media found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Media Edit/Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans text-xs">
          <div className="bg-white rounded-3xl max-w-md w-full border border-[#EEDCC1] overflow-hidden shadow-2xl animate-[revealUp_0.3s_ease-out]">
            <div className="h-2 bg-[#9B2226]" />
            <div className="p-6 flex justify-between items-center border-b border-gray-100">
              <h3 className="text-base font-serif font-bold italic text-gray-800">{editingId ? 'Edit Media' : 'Add Media'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-lg cursor-pointer border-0 bg-transparent">×</button>
            </div>

            {formError && <div className="p-3 mx-6 mt-4 bg-red-50 text-red-700 rounded-lg">{formError}</div>}

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="font-bold text-gray-700">Media Title *</label>
                <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-gray-50/50" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Format *</label>
                  <select value={type} onChange={e => setType(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-gray-50/50">
                    <option value="image">Photo / Image</option>
                    <option value="video">YouTube Embed Video</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Display Order</label>
                  <input type="number" value={order} onChange={e => setOrder(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-gray-50/50" />
                </div>
              </div>

              {type === 'image' && (
                <div className="space-y-1 border border-dashed p-3 rounded-lg bg-gray-50/50">
                  <label className="font-bold text-[#9B2226] block mb-1">Local Image File Upload</label>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="w-full" />
                  {uploading && <span className="text-orange-600 font-bold block mt-1">Uploading and optimizing image file...</span>}
                </div>
              )}

              <div className="space-y-1">
                <label className="font-bold text-gray-700">
                  {type === 'video' ? 'YouTube Embed Link (URL) *' : 'Image URL *'}
                </label>
                <input type="text" required value={url} onChange={e => setUrl(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-gray-50/50" placeholder={type === 'video' ? 'https://www.youtube.com/embed/...' : '/uploads/...'} />
              </div>

              {type === 'video' && (
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Video Thumbnail Image URL</label>
                  <input type="text" value={thumbnailUrl} onChange={e => setThumbnailUrl(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-gray-50/50" />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Album Name *</label>
                  <input type="text" required value={album} onChange={e => setAlbum(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-gray-50/50" />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Category Tag *</label>
                  <input type="text" required value={category} onChange={e => setCategory(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-gray-50/50" />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit" disabled={uploading}>Save Media</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
export default GalleryAdmin;
