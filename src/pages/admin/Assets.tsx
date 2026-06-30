import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { api } from '../../lib/api';
import { Plus, Search, MapPin, Tag, ShieldCheck, Edit, Trash } from 'lucide-react';

export function Assets() {
  const [assets, setAssets] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);

  // Form Modal States
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [assetCategory, setAssetCategory] = useState('Gold');
  const [description, setDescription] = useState('');
  const [acquisitionDate, setAcquisitionDate] = useState('');
  const [currentValuation, setCurrentValuation] = useState('');
  const [purchaseValue, setPurchaseValue] = useState('');
  const [status, setStatus] = useState('Excellent');
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [formError, setFormError] = useState('');

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const url = `/api/assets?search=${search}&category=${category}`;
      const res = await api.get(url);
      if (res.success) {
        setAssets(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [search, category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    try {
      const body = {
        name,
        category: assetCategory,
        description,
        acquisitionDate: acquisitionDate ? new Date(acquisitionDate) : undefined,
        currentValuation: Number(currentValuation),
        purchaseValue: Number(purchaseValue) || 0,
        status,
        location,
        imageUrl,
      };

      let res;
      if (editingId) {
        res = await api.put(`/api/assets/${editingId}`, body);
      } else {
        res = await api.post('/api/assets', body);
      }

      if (res.success) {
        setShowModal(false);
        resetForm();
        fetchAssets();
      }
    } catch (err: any) {
      setFormError(err.message || 'Saving failed');
    }
  };

  const handleEdit = (asset: any) => {
    setEditingId(asset._id);
    setName(asset.name);
    setAssetCategory(asset.category);
    setDescription(asset.description);
    setAcquisitionDate(asset.acquisitionDate ? new Date(asset.acquisitionDate).toISOString().split('T')[0] : '');
    setCurrentValuation(asset.currentValuation.toString());
    setPurchaseValue(asset.purchaseValue?.toString() || '');
    setStatus(asset.status);
    setLocation(asset.location);
    setImageUrl(asset.imageUrl || '');
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this asset?')) return;
    try {
      const res = await api.delete(`/api/assets/${id}`);
      if (res.success) {
        fetchAssets();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setAssetCategory('Gold');
    setDescription('');
    setAcquisitionDate('');
    setCurrentValuation('');
    setPurchaseValue('');
    setStatus('Excellent');
    setLocation('');
    setImageUrl('');
    setFormError('');
  };

  const totalValuation = Array.isArray(assets) ? assets.reduce((sum, asset) => sum + (asset.currentValuation || 0), 0) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold italic tracking-tight text-[#3E2723]">Asset Registry</h2>
          <p className="text-xs uppercase tracking-widest text-gray-500 font-sans mt-1">Track and manage temple properties, jewelry, and artifacts.</p>
        </div>
        <Button onClick={() => { resetForm(); setShowModal(true); }} className="flex items-center gap-2 font-sans text-xs">
          <Plus className="w-4 h-4" /> Add Asset
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total stats */}
        <Card className="md:col-span-1 bg-white text-[#3E2723] shadow-sm">
          <CardContent className="p-6">
            <p className="text-gray-500 font-sans font-bold text-[10px] uppercase tracking-wider mb-2">Total Estimated Valuation</p>
            <h3 className="text-3xl font-bold mb-4 italic tracking-tight">₹{(totalValuation / 10000000).toFixed(2)} Cr</h3>
            <div className="space-y-2 mt-6 pt-6 border-t border-[#F5F2ED] text-xs font-sans text-gray-600">
              <div className="flex justify-between">
                <span>Total Items Registered</span>
                <span className="font-bold text-gray-900">{assets?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Database Sync Status</span>
                <span className="font-bold text-green-600">Active</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Listing */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center w-full font-sans text-xs flex-wrap gap-2">
              <h3 className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Asset Inventory</h3>
              
              <div className="flex gap-2">
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="border border-[#EEDCC1] rounded-md px-2 py-1.5 bg-white text-xs"
                >
                  <option value="">All Categories</option>
                  <option value="Land & Buildings">Land & Buildings</option>
                  <option value="Gold">Gold</option>
                  <option value="Silver">Silver</option>
                  <option value="Artifacts">Artifacts</option>
                </select>

                <div className="relative w-48">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search assets..."
                    className="w-full pl-9 pr-4 py-1.5 border border-[#EEDCC1] rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="p-8 text-center text-xs font-sans text-gray-500">Loading asset records...</div>
              ) : Array.isArray(assets) && assets.map(asset => (
                <div key={asset._id} className="p-4 border border-[#F5F2ED] rounded-lg hover:border-[#D4AF37] transition-colors flex flex-col md:flex-row gap-4">
                  <div className="w-16 h-16 bg-[#FFF9F0] border border-[#EEDCC1] rounded-lg flex items-center justify-center text-[#9B2226] flex-shrink-0">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold italic text-[#3E2723] text-lg">{asset.name}</h4>
                        <div className="flex flex-wrap items-center gap-3 mt-1 text-xs font-sans text-gray-500">
                          <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {asset.category}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {asset.location}</span>
                          <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded-full font-bold text-[9px] uppercase tracking-wider">{asset.status}</span>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <p className="font-bold text-gray-900 font-serif italic text-sm">₹{(asset.currentValuation / 100000).toLocaleString()} L</p>
                        <p className="text-[9px] uppercase tracking-wider font-bold text-gray-400 font-sans mt-0.5">Value</p>
                        
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => handleEdit(asset)} className="text-gray-600 hover:text-gray-900 text-xs flex items-center gap-1 font-sans font-bold">
                            <Edit className="w-3 h-3" /> Edit
                          </button>
                          <button onClick={() => handleDelete(asset._id)} className="text-red-600 hover:text-red-900 text-xs flex items-center gap-1 font-sans font-bold">
                            <Trash className="w-3 h-3" /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs font-sans text-gray-600 mt-2">{asset.description}</p>
                  </div>
                </div>
              ))}
              {!loading && (!Array.isArray(assets) || assets.length === 0) && (
                <div className="p-8 text-center text-xs font-sans text-gray-400">No asset records registered.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="bg-white border-0 shadow-2xl max-w-lg w-full rounded-2xl overflow-hidden">
            <div className="h-2 bg-[#9B2226]"></div>
            <CardContent className="p-6 space-y-4 font-sans text-xs">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-gray-800 uppercase tracking-wider font-serif">
                  {editingId ? 'Edit Asset Record' : 'Register New Asset'}
                </h3>
                <button onClick={() => { setShowModal(false); resetForm(); }} className="text-gray-400 hover:text-gray-600 text-lg">×</button>
              </div>

              {formError && <div className="p-3 bg-red-50 text-red-700 rounded border border-red-200">{formError}</div>}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Asset Name *</label>
                    <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border rounded bg-gray-50" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Category *</label>
                    <select value={assetCategory} onChange={e => setAssetCategory(e.target.value)} className="w-full px-3 py-2 border rounded bg-gray-50">
                      <option value="Land & Buildings">Land & Buildings</option>
                      <option value="Gold">Gold</option>
                      <option value="Silver">Silver</option>
                      <option value="Artifacts">Artifacts</option>
                      <option value="Vehicles">Vehicles</option>
                      <option value="Furniture">Furniture</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Current Valuation (INR) *</label>
                    <input type="number" required value={currentValuation} onChange={e => setCurrentValuation(e.target.value)} className="w-full px-3 py-2 border rounded bg-gray-50" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Purchase Value (INR)</label>
                    <input type="number" value={purchaseValue} onChange={e => setPurchaseValue(e.target.value)} className="w-full px-3 py-2 border rounded bg-gray-50" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Acquisition Date</label>
                    <input type="date" value={acquisitionDate} onChange={e => setAcquisitionDate(e.target.value)} className="w-full px-3 py-2 border rounded bg-gray-50" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Location / Safe *</label>
                    <input type="text" required value={location} onChange={e => setLocation(e.target.value)} className="w-full px-3 py-2 border rounded bg-gray-50" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Status</label>
                    <select value={status} onChange={e => setStatus(e.target.value)} className="w-full px-3 py-2 border rounded bg-gray-50">
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Needs Maintenance">Needs Maintenance</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Image URL</label>
                    <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full px-3 py-2 border rounded bg-gray-50" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Description</label>
                  <textarea rows={2} value={description} onChange={e => setDescription(e.target.value)} className="w-full px-3 py-2 border rounded bg-gray-50 resize-none" />
                </div>

                <div className="flex gap-2 justify-end pt-4 font-sans text-xs">
                  <Button type="button" variant="outline" onClick={() => { setShowModal(false); resetForm(); }}>Cancel</Button>
                  <Button type="submit">Save Asset</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
export default Assets;
