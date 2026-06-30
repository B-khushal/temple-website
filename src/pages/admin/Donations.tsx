import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { api } from '../../lib/api';
import { Plus, Search, Filter, Download, FileText, Check, Trash } from 'lucide-react';

export function Donations() {
  const [donations, setDonations] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);

  // Form states for creating a donation
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [donorName, setDonorName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [donationType, setDonationType] = useState('Monetary');
  const [amount, setAmount] = useState('');
  const [itemDetails, setItemDetails] = useState('');
  const [purpose, setPurpose] = useState('General Fund');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [isPublic, setIsPublic] = useState(true);
  const [formError, setFormError] = useState('');

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const url = `/api/donations?search=${search}&type=${type}&page=${page}&limit=${limit}`;
      const res = await api.get(url);
      if (res.success) {
        setDonations(res.data);
        setTotal(res.total);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [search, type, page]);

  const handleExportCSV = async () => {
    try {
      const csvContent = await api.get('/api/donations/export');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'donations_export.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    try {
      const res = await api.post('/api/donations', {
        donorName,
        email,
        phone,
        type: donationType,
        amount: donationType === 'Monetary' ? Number(amount) : 0,
        itemDetails: donationType !== 'Monetary' ? itemDetails : '',
        purpose,
        paymentMethod,
        isPublic,
      });

      if (res.success) {
        setShowCreateModal(false);
        resetForm();
        fetchDonations();
      }
    } catch (err: any) {
      setFormError(err.message || 'Creation failed');
    }
  };

  const resetForm = () => {
    setDonorName('');
    setEmail('');
    setPhone('');
    setDonationType('Monetary');
    setAmount('');
    setItemDetails('');
    setPurpose('General Fund');
    setPaymentMethod('Cash');
    setIsPublic(true);
    setFormError('');
  };

  const handleVerifyStatus = async (id: string) => {
    try {
      const res = await api.put(`/api/donations/${id}`, { status: 'Verified' });
      if (res.success) {
        fetchDonations();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteDonation = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this donation record?')) return;
    try {
      const res = await api.delete(`/api/donations/${id}`);
      if (res.success) {
        fetchDonations();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold italic tracking-tight text-[#3E2723]">Donation Registry</h2>
          <p className="text-xs uppercase tracking-widest text-gray-500 font-sans mt-1">Manage donor records, verify status, and issue official receipts.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button onClick={handleExportCSV} variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
          <Button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Donation
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between bg-gray-50/50 font-sans text-xs">
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by donor name or receipt no..."
                className="w-full pl-9 pr-4 py-2 border border-[#EEDCC1] rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={type}
                onChange={e => setType(e.target.value)}
                className="border border-[#EEDCC1] rounded-md px-3 py-2 bg-white"
              >
                <option value="">All Types</option>
                <option value="Monetary">Monetary</option>
                <option value="Gold">Gold</option>
                <option value="Silver">Silver</option>
                <option value="Asset">Asset</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap font-sans">
              <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-200 uppercase tracking-tighter">
                <tr>
                  <th className="px-6 py-4">Receipt Code</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Donor Name</th>
                  <th className="px-6 py-4">Purpose</th>
                  <th className="px-6 py-4">Method/Type</th>
                  <th className="px-6 py-4 text-right">Value (₹)</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                      Loading donation entries...
                    </td>
                  </tr>
                ) : Array.isArray(donations) && donations.map((d) => (
                  <tr key={d._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-gray-700">{d.receiptNumber}</td>
                    <td className="px-6 py-4 text-gray-600">{new Date(d.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {d.donorName}
                      {!d.isPublic && <span className="ml-2 text-[9px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">PRIVATE</span>}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{d.purpose}</td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-800">{d.type}</span>
                      <span className="text-gray-400 text-[10px] ml-1">({d.paymentMethod})</span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-[#9B2226] font-serif italic text-sm">
                      {d.type === 'Monetary' ? `₹${d.amount.toLocaleString()}` : d.itemDetails || 'In-Kind'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        d.status === 'Verified' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'
                      }`}>
                        {d.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center flex items-center justify-center gap-2">
                      <a
                        href={`/api/donations/${d._id}/receipt`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 text-[#9B2226] hover:bg-red-50 rounded"
                        title="Download PDF Receipt"
                      >
                        <FileText className="w-4 h-4" />
                      </a>
                      
                      {d.status === 'Pending' && (
                        <button
                          onClick={() => handleVerifyStatus(d._id)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="Verify Payment"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteDonation(d._id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Delete record"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {!loading && (!Array.isArray(donations) || donations.length === 0) && (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                      No records found matching filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-sans">
            <span>Showing {(page-1)*limit+1} to {Math.min(page*limit, total)} of {total} records</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => p + 1)}
                disabled={page * limit >= total}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CREATE DONATION MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="bg-white border-0 shadow-2xl max-w-lg w-full rounded-2xl overflow-hidden">
            <div className="h-2 bg-[#9B2226]"></div>
            <CardContent className="p-6 space-y-4 font-sans text-xs">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-gray-800 uppercase tracking-wider font-serif">Add Donation Entry</h3>
                <button onClick={() => { setShowCreateModal(false); resetForm(); }} className="text-gray-400 hover:text-gray-600 text-lg">×</button>
              </div>

              {formError && <div className="p-3 bg-red-50 text-red-700 rounded border border-red-200">{formError}</div>}

              <form onSubmit={handleCreateDonation} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Donor Name *</label>
                    <input type="text" required value={donorName} onChange={e => setDonorName(e.target.value)} className="w-full px-3 py-2 border rounded bg-gray-50" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Phone *</label>
                    <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-3 py-2 border rounded bg-gray-50" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Email Address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded bg-gray-50" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Donation Type</label>
                    <select value={donationType} onChange={e => setDonationType(e.target.value)} className="w-full px-3 py-2 border rounded bg-gray-50">
                      <option value="Monetary">Monetary</option>
                      <option value="Gold">Gold</option>
                      <option value="Silver">Silver</option>
                      <option value="Asset">Asset</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Purpose</label>
                    <select value={purpose} onChange={e => setPurpose(e.target.value)} className="w-full px-3 py-2 border rounded bg-gray-50">
                      <option>General Fund</option>
                      <option>Daily Annadanam</option>
                      <option>Navratri Mahotsav 2026</option>
                      <option>Temple Construction</option>
                      <option>Special Ritual Sponsorship</option>
                    </select>
                  </div>
                </div>

                {donationType === 'Monetary' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-gray-700">Amount (INR) *</label>
                      <input type="number" required min="1" value={amount} onChange={e => setAmount(e.target.value)} className="w-full px-3 py-2 border rounded bg-gray-50" />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-gray-700">Payment Method</label>
                      <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="w-full px-3 py-2 border rounded bg-gray-50">
                        <option>Cash</option>
                        <option>UPI</option>
                        <option>Bank Transfer</option>
                        <option>Cheque</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Item Details * (e.g. Gold Chain 20g)</label>
                    <input type="text" required value={itemDetails} onChange={e => setItemDetails(e.target.value)} className="w-full px-3 py-2 border rounded bg-gray-50" />
                  </div>
                )}

                <div className="flex items-center gap-2 pt-2">
                  <input type="checkbox" id="modal-is-public" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} className="w-4 h-4 cursor-pointer" />
                  <label htmlFor="modal-is-public" className="cursor-pointer">Show on public donors board</label>
                </div>

                <div className="flex gap-2 justify-end pt-4">
                  <Button type="button" variant="outline" onClick={() => { setShowCreateModal(false); resetForm(); }}>Cancel</Button>
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
export default Donations;
