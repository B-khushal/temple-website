import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { api, useAuth } from '../../lib/api';
import { Plus, Trash2, Edit2, ShieldAlert, ShieldCheck, UserCheck } from 'lucide-react';

export function UsersAdmin() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Committee Member');
  const [isActive, setIsActive] = useState(true);
  const [formError, setFormError] = useState('');

  const fetchUsers = async () => {
    if (currentUser?.role !== 'Super Admin') {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const res = await api.get('/api/auth/users');
      if (res.success) {
        setUsers(res.users);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentUser]);

  const handleDelete = async (id: string) => {
    if (id === currentUser?.id) {
      alert('You cannot delete yourself.');
      return;
    }
    if (!window.confirm('Delete this administrative user permanently?')) return;
    try {
      const res = await api.delete(`/api/auth/users/${id}`);
      if (res.success) {
        fetchUsers();
      }
    } catch (err: any) {
      alert(err.message || 'Deletion failed');
    }
  };

  const handleOpenEdit = (u: any) => {
    setEditingId(u._id);
    setName(u.name);
    setEmail(u.email);
    setPassword(''); // don't fill password
    setRole(u.role);
    setIsActive(u.isActive);
    setFormError('');
    setShowModal(true);
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setName('');
    setEmail('');
    setPassword('');
    setRole('Committee Member');
    setIsActive(true);
    setFormError('');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    try {
      let res;
      if (editingId) {
        res = await api.put(`/api/auth/users/${editingId}`, {
          name,
          email,
          role,
          isActive,
        });
      } else {
        if (!password) {
          setFormError('Password is required for new users.');
          return;
        }
        res = await api.post('/api/auth/register', {
          name,
          email,
          password,
          role,
        });
      }

      if (res.success) {
        setShowModal(false);
        fetchUsers();
      }
    } catch (err: any) {
      setFormError(err.message || 'Operation failed');
    }
  };

  if (currentUser?.role !== 'Super Admin') {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-8 bg-[#F7F1E5] rounded-3xl border border-[#EEDCC1] font-serif">
        <ShieldAlert className="w-16 h-16 text-[#9B2226] mb-4" />
        <h2 className="text-2xl font-bold italic text-[#3E2723] mb-2">Access Restricted</h2>
        <p className="text-gray-600 max-w-sm font-sans text-xs uppercase tracking-wider leading-relaxed">
          Only the **Super Administrator** is authorized to view or modify backend system credentials.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-serif">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold italic tracking-tight text-[#3E2723]">User Management</h2>
          <p className="text-xs uppercase tracking-widest text-gray-500 font-sans mt-1">
            Configure administrative permissions, add operators, and monitor account status.
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="flex items-center gap-2 font-sans text-xs">
          <Plus className="w-4 h-4" /> Create User
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-gray-50 text-gray-400 uppercase tracking-tighter border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 font-bold">Admin Operator</th>
                  <th className="px-6 py-3">Email Address</th>
                  <th className="px-6 py-3">Role Designation</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {Array.isArray(users) && users.map(u => (
                  <tr key={u._id} className="hover:bg-orange-50/10 transition-colors">
                    <td className="px-6 py-3 font-bold text-gray-800 flex items-center gap-2">
                      <div className="w-7 h-7 rounded bg-[#F7F1E5] flex items-center justify-center font-bold text-[10px] text-[#9B2226]">
                        {u.name.split(' ').map((n: string) => n[0]).join('').slice(0,2).toUpperCase()}
                      </div>
                      <span>{u.name} {u._id === currentUser.id && '(You)'}</span>
                    </td>
                    <td className="px-6 py-3 font-mono">{u.email}</td>
                    <td className="px-6 py-3">
                      <span className="font-bold text-[#9B2226]">{u.role}</span>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {u.isActive ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => handleOpenEdit(u)} className="text-gray-500 hover:text-gray-700 bg-transparent border-0"><Edit2 className="w-4 h-4" /></button>
                        <button 
                          onClick={() => handleDelete(u._id)} 
                          disabled={u._id === currentUser.id}
                          className="text-red-500 hover:text-red-700 bg-transparent border-0 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Editor Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans text-xs">
          <div className="bg-white rounded-3xl max-w-md w-full border border-[#EEDCC1] overflow-hidden shadow-2xl animate-[revealUp_0.3s_ease-out]">
            <div className="h-2 bg-[#9B2226]" />
            <div className="p-6 flex justify-between items-center border-b border-gray-100">
              <h3 className="text-base font-serif font-bold italic text-gray-800">{editingId ? 'Edit Operator Credentials' : 'Create Admin Operator'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-lg cursor-pointer border-0 bg-transparent">×</button>
            </div>

            {formError && <div className="p-3 mx-6 mt-4 bg-red-50 text-red-700 rounded-lg">{formError}</div>}

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="font-bold text-gray-700">Name *</label>
                <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-gray-50/50" />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">Email Address *</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-gray-50/50" />
              </div>

              {!editingId && (
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Secure Password *</label>
                  <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-gray-50/50" />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Role Designation</label>
                  <select value={role} onChange={e => setRole(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-gray-50/50 font-bold text-[#9B2226]">
                    <option value="Super Admin">Super Admin</option>
                    <option value="Treasurer">Treasurer</option>
                    <option value="Accountant">Accountant</option>
                    <option value="Committee Member">Committee Member</option>
                    <option value="Content Manager">Content Manager</option>
                  </select>
                </div>

                {editingId && (
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Account status</label>
                    <select value={isActive ? 'Active' : 'Deactivated'} onChange={e => setIsActive(e.target.value === 'Active')} className="w-full px-3 py-2 border rounded-lg bg-gray-50/50">
                      <option value="Active">Active</option>
                      <option value="Deactivated">Deactivated</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit">Save User</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
export default UsersAdmin;
