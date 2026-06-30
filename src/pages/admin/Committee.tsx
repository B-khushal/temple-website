import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { api } from '../../lib/api';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export function Committee() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const categories = ['Founder', 'Current Committee', 'Past Member'];

  // Form Modal States
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [periodStart, setPeriodStart] = useState('');
  const [periodEnd, setPeriodEnd] = useState('Present');
  const [bio, setBio] = useState('');
  const [category, setCategory] = useState('Current Committee');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [formError, setFormError] = useState('');

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/committee');
      if (res.success) {
        setMembers(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    try {
      const body = {
        name,
        role,
        periodStart,
        periodEnd: periodEnd || 'Present',
        bio,
        category,
        email,
        phone,
      };

      let res;
      if (editingId) {
        res = await api.put(`/api/committee/${editingId}`, body);
      } else {
        res = await api.post('/api/committee', body);
      }

      if (res.success) {
        setShowModal(false);
        resetForm();
        fetchMembers();
      }
    } catch (err: any) {
      setFormError(err.message || 'Saving failed');
    }
  };

  const handleEdit = (member: any) => {
    setEditingId(member._id);
    setName(member.name);
    setRole(member.role);
    setPeriodStart(member.periodStart);
    setPeriodEnd(member.periodEnd);
    setBio(member.bio || '');
    setCategory(member.category);
    setEmail(member.email || '');
    setPhone(member.phone || '');
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this board member record?')) return;
    try {
      const res = await api.delete(`/api/committee/${id}`);
      if (res.success) {
        fetchMembers();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setRole('');
    setPeriodStart('');
    setPeriodEnd('Present');
    setBio('');
    setCategory('Current Committee');
    setEmail('');
    setPhone('');
    setFormError('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold italic tracking-tight text-[#3E2723]">Committee Archive</h2>
          <p className="text-xs uppercase tracking-widest text-gray-500 font-sans mt-1">Manage founders and committee members history.</p>
        </div>
        <Button onClick={() => { resetForm(); setShowModal(true); }} className="flex items-center gap-2 font-sans text-xs">
          <Plus className="w-4 h-4" /> Add Member
        </Button>
      </div>

      <div className="space-y-8">
        {loading ? (
          <div className="p-8 text-center text-xs font-sans text-gray-500">Loading records...</div>
        ) : (
          Array.isArray(categories) && Array.isArray(members) ? categories.map(cat => {
            const catMembers = members.filter(m => m.category === cat);
            if (catMembers.length === 0) return null;

            return (
              <div key={cat}>
                <h3 className="text-lg font-bold text-maroon-900 border-b border-saffron-200 pb-2 mb-4 font-display">
                  {cat}s
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.isArray(catMembers) && catMembers.map(member => (
                    <Card key={member._id} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow">
                      <div className="h-24 bg-gradient-to-r from-saffron-100 to-saffron-50 relative">
                        <div className="absolute -bottom-8 left-6 w-16 h-16 bg-white rounded-full p-1 shadow-sm">
                          <div className="w-full h-full bg-saffron-200 rounded-full flex items-center justify-center text-xl text-saffron-700 font-bold">
                            {member.name.charAt(0)}
                          </div>
                        </div>
                        <div className="absolute top-4 right-4 flex gap-2 font-sans">
                          <button onClick={() => handleEdit(member)} className="p-1.5 bg-white/70 hover:bg-white rounded text-gray-600 transition-colors cursor-pointer">
                            <Edit2 className="w-4.5 h-4.5" />
                          </button>
                          <button onClick={() => handleDelete(member._id)} className="p-1.5 bg-white/70 hover:bg-white rounded text-red-600 transition-colors cursor-pointer">
                            <Trash2 className="w-4.5 h-4.5" />
                          </button>
                        </div>
                      </div>
                      <CardContent className="pt-12 pb-6 px-6 font-serif">
                        <h4 className="font-bold text-gray-900 text-lg">{member.name}</h4>
                        <p className="text-saffron-700 font-medium text-sm mb-1">{member.role}</p>
                        <p className="text-[10px] text-gray-500 mb-4 font-mono bg-gray-50 inline-block px-2 py-0.5 rounded border border-gray-100">
                          {member.periodStart} - {member.periodEnd}
                        </p>
                        <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed font-sans">
                          {member.bio}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          }) : null
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="bg-white border-0 shadow-2xl max-w-lg w-full rounded-2xl overflow-hidden">
            <div className="h-2 bg-[#9B2226]"></div>
            <CardContent className="p-6 space-y-4 font-sans text-xs">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-gray-800 uppercase tracking-wider font-serif">
                  {editingId ? 'Edit Committee Record' : 'Add Board Member'}
                </h3>
                <button onClick={() => { setShowModal(false); resetForm(); }} className="text-gray-400 hover:text-gray-600 text-lg">×</button>
              </div>

              {formError && <div className="p-3 bg-red-50 text-red-700 rounded border border-red-200">{formError}</div>}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Full Name *</label>
                    <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border rounded bg-gray-50" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Role / Designation *</label>
                    <input type="text" required placeholder="e.g. President" value={role} onChange={e => setRole(e.target.value)} className="w-full px-3 py-2 border rounded bg-gray-50" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Start Year *</label>
                    <input type="text" required placeholder="e.g. 2018" value={periodStart} onChange={e => setPeriodStart(e.target.value)} className="w-full px-3 py-2 border rounded bg-gray-50" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">End Year (or 'Present') *</label>
                    <input type="text" required placeholder="Present" value={periodEnd} onChange={e => setPeriodEnd(e.target.value)} className="w-full px-3 py-2 border rounded bg-gray-50" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Category *</label>
                    <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-3 py-2 border rounded bg-gray-50">
                      <option value="Founder">Founder</option>
                      <option value="Current Committee">Current Committee</option>
                      <option value="Past Member">Past Member</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Contact Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded bg-gray-50" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Contact Phone</label>
                  <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-3 py-2 border rounded bg-gray-50" />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Short Biography</label>
                  <textarea rows={3} value={bio} onChange={e => setBio(e.target.value)} className="w-full px-3 py-2 border rounded bg-gray-50 resize-none" />
                </div>

                <div className="flex gap-2 justify-end pt-4 font-sans text-xs">
                  <Button type="button" variant="outline" onClick={() => { setShowModal(false); resetForm(); }}>Cancel</Button>
                  <Button type="submit">Save Record</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
export default Committee;
