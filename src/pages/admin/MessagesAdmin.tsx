import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { api, useAuth } from '../../lib/api';
import { Mail, Check, Trash2, ShieldCheck, MailOpen, CornerUpLeft } from 'lucide-react';

export function MessagesAdmin() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const url = `/api/contact?search=${search}&status=${statusFilter}&page=${page}&limit=${limit}`;
      const res = await api.get(url);
      if (res.success) {
        setMessages(res.data);
        setTotal(res.total);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [search, statusFilter, page]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await api.put(`/api/contact/${id}`, { status: newStatus });
      if (res.success) {
        fetchMessages();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this message entry permanently?')) return;
    try {
      const res = await api.delete(`/api/contact/${id}`);
      if (res.success) {
        fetchMessages();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 font-serif">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold italic tracking-tight text-[#3E2723]">Contact Inquiries</h2>
          <p className="text-xs uppercase tracking-widest text-gray-500 font-sans mt-1">
            Review and respond to submissions logged from the public Contact page.
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {/* Filters toolbar */}
          <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 bg-gray-50/50 font-sans text-xs">
            <input 
              type="text" 
              placeholder="Search by name, subject, or message..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white max-w-sm w-full" 
            />
            <select 
              value={statusFilter} 
              onChange={e => setStatusFilter(e.target.value)} 
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white"
            >
              <option value="">All Statuses</option>
              <option value="New">New</option>
              <option value="Read">Read</option>
              <option value="Replied">Replied</option>
            </select>
          </div>

          <div className="divide-y divide-gray-100">
            {Array.isArray(messages) && messages.map(msg => (
              <div 
                key={msg._id} 
                className={`p-6 flex flex-col md:flex-row justify-between gap-6 hover:bg-orange-50/5 transition-colors ${
                  msg.status === 'New' ? 'bg-orange-50/20 font-semibold' : ''
                }`}
              >
                {/* Sender Details & Content */}
                <div className="space-y-2 max-w-2xl font-sans text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-gray-800 font-bold font-serif text-sm">{msg.name}</span>
                    <span className="text-gray-400 font-mono">({msg.email} | {msg.phone})</span>
                    <span className="text-[9px] text-gray-400 font-mono ml-auto md:ml-0">
                      {new Date(msg.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <h4 className="text-[#9B2226] font-bold text-[13px] font-serif italic">Subject: {msg.subject}</h4>
                  <p className="text-gray-600 leading-relaxed font-serif text-sm whitespace-pre-line border-l-2 border-[#EEDCC1] pl-3 py-1 bg-[#FDFBF7]/60 rounded">
                    {msg.message}
                  </p>
                </div>

                {/* Actions & Status */}
                <div className="flex flex-row md:flex-col justify-end items-center gap-2 self-center md:self-stretch text-xs font-sans">
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                    msg.status === 'New' ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                    msg.status === 'Read' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                    'bg-green-100 text-green-800 border border-green-200'
                  }`}>
                    {msg.status}
                  </span>

                  <div className="flex gap-1.5 mt-2">
                    {msg.status === 'New' && (
                      <button 
                        onClick={() => handleUpdateStatus(msg._id, 'Read')} 
                        className="p-1.5 border border-gray-200 rounded hover:bg-gray-50 bg-white"
                        title="Mark as Read"
                      >
                        <MailOpen className="w-4 h-4 text-blue-600" />
                      </button>
                    )}
                    {msg.status !== 'Replied' && (
                      <button 
                        onClick={() => handleUpdateStatus(msg._id, 'Replied')} 
                        className="p-1.5 border border-gray-200 rounded hover:bg-gray-50 bg-white"
                        title="Mark as Replied"
                      >
                        <CornerUpLeft className="w-4 h-4 text-green-600" />
                      </button>
                    )}
                    {user?.role === 'Super Admin' && (
                      <button 
                        onClick={() => handleDelete(msg._id)} 
                        className="p-1.5 border border-gray-200 rounded hover:bg-red-50 hover:border-red-200 bg-white"
                        title="Delete Message"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    )}
                  </div>
                </div>

              </div>
            ))}

            {(!Array.isArray(messages) || messages.length === 0) && (
              <div className="text-center py-12 text-gray-400 italic font-sans text-xs">
                No contact submissions found matching filters.
              </div>
            )}
          </div>

          {/* Pagination */}
          {total > limit && (
            <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/50 font-sans text-xs">
              <button 
                disabled={page === 1} 
                onClick={() => setPage(p => p - 1)}
                className="px-3 py-1.5 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-white bg-white font-bold"
              >
                Previous
              </button>
              <span className="text-gray-500 font-medium">Page {page} of {Math.ceil(total / limit)}</span>
              <button 
                disabled={page >= Math.ceil(total / limit)} 
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-white bg-white font-bold"
              >
                Next
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
export default MessagesAdmin;
