import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { api } from '../../lib/api';
import { Download, Plus, Filter, Search, Edit2, Trash2 } from 'lucide-react';

export function Financials() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);

  // Form states for creating/editing
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [date, setDate] = useState('');
  const [entryType, setEntryType] = useState('Income');
  const [category, setCategory] = useState('Hundi Collection');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [reference, setReference] = useState('');
  const [formError, setFormError] = useState('');

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const url = `/api/transactions?search=${search}&type=${type}&page=${page}&limit=${limit}`;
      const res = await api.get(url);
      if (res.success) {
        setTransactions(res.data);
        setTotal(res.total);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [search, type, page]);

  const handleExportCSV = async () => {
    try {
      const csvContent = await api.get('/api/transactions/export');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'ledger_export.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    try {
      const body = {
        date: date ? new Date(date) : new Date(),
        type: entryType,
        category,
        amount: Number(amount),
        description,
        reference,
      };

      let res;
      if (editingId) {
        res = await api.put(`/api/transactions/${editingId}`, body);
      } else {
        res = await api.post('/api/transactions', body);
      }

      if (res.success) {
        setShowModal(false);
        resetForm();
        fetchTransactions();
      }
    } catch (err: any) {
      setFormError(err.message || 'Operation failed');
    }
  };

  const handleEdit = (txn: any) => {
    setEditingId(txn._id);
    setDate(new Date(txn.date).toISOString().split('T')[0]);
    setEntryType(txn.type);
    setCategory(txn.category);
    setAmount(txn.amount.toString());
    setDescription(txn.description);
    setReference(txn.reference);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this ledger entry?')) return;
    try {
      const res = await api.delete(`/api/transactions/${id}`);
      if (res.success) {
        fetchTransactions();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setDate('');
    setEntryType('Income');
    setCategory('Hundi Collection');
    setAmount('');
    setDescription('');
    setReference('');
    setFormError('');
  };

  return (
    <div className="space-y-6 font-serif">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 font-serif">
        <div>
          <h2 className="text-3xl font-bold italic tracking-tight text-[#3E2723]">Financial Ledger</h2>
          <p className="text-xs uppercase tracking-widest text-gray-500 font-sans mt-1">Manage income, expenses, and track temple accounting balances.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto font-sans text-xs">
          <Button onClick={handleExportCSV} variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
          <Button onClick={() => { resetForm(); setShowModal(true); }} className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Entry
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between bg-gray-50/50 font-sans text-xs">
            <div className="relative max-w-sm w-full font-sans">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search transactions..." 
                className="w-full pl-9 pr-4 py-2 border border-[#EEDCC1] rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 font-sans">
              <select
                value={type}
                onChange={e => setType(e.target.value)}
                className="border border-[#EEDCC1] rounded-md px-3 py-2 bg-white"
              >
                <option value="">All Types</option>
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </select>
            </div>
          </div>
          
          <div className="overflow-x-auto font-sans text-xs">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-200 uppercase tracking-tighter">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Ref. Code</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4 text-right">Amount (₹)</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      Loading ledger data...
                    </td>
                  </tr>
                ) : Array.isArray(transactions) && transactions.map((txn) => (
                  <tr key={txn._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-gray-600">{new Date(txn.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-mono text-gray-500">{txn.reference}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{txn.category}</td>
                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate" title={txn.description}>{txn.description}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider ${
                        txn.type === 'Income' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {txn.type}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-right font-bold font-serif italic text-sm ${
                      txn.type === 'Income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {txn.type === 'Income' ? '+' : '-'}₹{txn.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center flex items-center justify-center gap-2">
                      <button onClick={() => handleEdit(txn)} className="p-1.5 text-gray-600 hover:bg-gray-100 rounded" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(txn._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {!loading && (!Array.isArray(transactions) || transactions.length === 0) && (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      No transactions found matching filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-sans">
            <span>Showing {(page-1)*limit+1} to {Math.min(page*limit, total)} of {total} entries</span>
            <div className="flex gap-1 font-sans">
              <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}>Previous</Button>
              <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={page * limit >= total}>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CREATE/EDIT TRANSACTION MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="bg-white border-0 shadow-2xl max-w-md w-full rounded-2xl overflow-hidden">
            <div className="h-2 bg-[#9B2226]"></div>
            <CardContent className="p-6 space-y-4 font-sans text-xs">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-gray-800 uppercase tracking-wider font-serif">
                  {editingId ? 'Edit Ledger Entry' : 'New Ledger Entry'}
                </h3>
                <button onClick={() => { setShowModal(false); resetForm(); }} className="text-gray-400 hover:text-gray-600 text-lg">×</button>
              </div>

              {formError && <div className="p-3 bg-red-50 text-red-700 rounded border border-red-200">{formError}</div>}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Date *</label>
                  <input type="date" required value={date} onChange={e => setDate(e.target.value)} className="w-full px-3 py-2 border rounded bg-gray-50" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Type *</label>
                    <select value={entryType} onChange={e => setEntryType(e.target.value)} className="w-full px-3 py-2 border rounded bg-gray-50">
                      <option value="Income">Income</option>
                      <option value="Expense">Expense</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Category *</label>
                    {entryType === 'Income' ? (
                      <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-3 py-2 border rounded bg-gray-50">
                        <option>Hundi Collection</option>
                        <option>Donations</option>
                        <option>Seva Contributions</option>
                        <option>Other Income</option>
                      </select>
                    ) : (
                      <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-3 py-2 border rounded bg-gray-50">
                        <option>Employee Salaries</option>
                        <option>Maintenance</option>
                        <option>Events Expense</option>
                        <option>Utilities & Bills</option>
                      </select>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Amount (INR) *</label>
                    <input type="number" required min="1" value={amount} onChange={e => setAmount(e.target.value)} className="w-full px-3 py-2 border rounded bg-gray-50" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Reference Code *</label>
                    <input type="text" required placeholder="VOUCHER-001" value={reference} onChange={e => setReference(e.target.value)} className="w-full px-3 py-2 border rounded bg-gray-50" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Description *</label>
                  <textarea rows={2} required placeholder="Enter description details..." value={description} onChange={e => setDescription(e.target.value)} className="w-full px-3 py-2 border rounded bg-gray-50 resize-none" />
                </div>

                <div className="flex gap-2 justify-end pt-4 font-sans text-xs">
                  <Button type="button" variant="outline" onClick={() => { setShowModal(false); resetForm(); }}>Cancel</Button>
                  <Button type="submit">Save Entry</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
export default Financials;
