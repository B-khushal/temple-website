import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { api } from '../../lib/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Flame } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>({
    totalCorpus: 0,
    todayCollection: 0,
    activeDonors: 0,
    goldReserveValuation: 0,
    goldReserveWeight: 142.65,
  });

  const [recentOfferings, setRecentOfferings] = useState<any[]>([]);
  const [livestreamUrl, setLivestreamUrl] = useState('');
  const [loading, setLoading] = useState(true);

  // Chart data from transactions (Income/Expense aggregates)
  const [chartData, setChartData] = useState<any[]>([
    { name: 'Jan', income: 400000, expense: 240000 },
    { name: 'Feb', income: 300000, expense: 139800 },
    { name: 'Mar', income: 200000, expense: 98000 },
    { name: 'Apr', income: 278000, expense: 390800 },
    { name: 'May', income: 189000, expense: 480000 },
    { name: 'Jun', income: 239000, expense: 380000 },
    { name: 'Jul', income: 349000, expense: 430000 },
  ]);

  const loadDashboardData = async () => {
    try {
      const summaryRes = await api.get('/api/transactions/summary');
      if (summaryRes.success) {
        setStats(summaryRes.data);
        if (summaryRes.data.chartData && summaryRes.data.chartData.length > 0) {
          setChartData(summaryRes.data.chartData);
        }
      }

      const donationsRes = await api.get('/api/donations?limit=4');
      if (donationsRes.success) {
        setRecentOfferings(donationsRes.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <div className="flex flex-col gap-8 h-full">
      <div className="flex justify-between items-end flex-wrap gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold italic tracking-tight">Divine Overview</h2>
          <p className="text-gray-500 font-sans text-xs uppercase tracking-widest">
            Status: Ashtami Pooja in Progress • Mandir Open
          </p>
        </div>
        <div className="flex gap-2 font-sans text-xs">
          <button
            onClick={() => navigate('/admin/finances')}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer bg-white"
          >
            Ledger Audit
          </button>
          <button
            onClick={() => navigate('/admin/donations')}
            className="px-4 py-2 bg-[#9B2226] text-white rounded-lg hover:bg-[#7a181b] transition-colors cursor-pointer font-bold"
          >
            New Donation Entry
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-serif">
        <Card>
          <CardContent className="p-6">
            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-sans font-bold">Total Corpus</span>
            <span className="text-2xl font-bold italic block mt-1">₹{stats.totalCorpus?.toLocaleString()}</span>
            <span className="text-[10px] text-green-600 font-bold font-sans">Live Mongoose Sync</span>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-sans font-bold">Gold Reserve</span>
            <span className="text-2xl font-bold italic block mt-1">{stats.goldReserveWeight} kg</span>
            <span className="text-[10px] text-gray-400 font-sans italic">Market Value: ~₹{(stats.goldReserveValuation / 10000000).toFixed(2)} Cr</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-sans font-bold">Today's Collection</span>
            <span className="text-2xl font-bold italic block mt-1">₹{stats.todayCollection?.toLocaleString()}</span>
            <span className="text-[10px] text-orange-600 font-sans font-bold uppercase animate-pulse">Live Updates</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-sans font-bold">Active Donors</span>
            <span className="text-2xl font-bold italic block mt-1">{stats.activeDonors}</span>
            <span className="text-[10px] text-gray-400 font-sans">Global Network</span>
          </CardContent>
        </Card>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        
        {/* Recent offerings Table */}
        <div className="flex-[2] flex flex-col bg-white rounded-2xl shadow-sm border border-[#EEDCC1] overflow-hidden min-h-[300px]">
          <div className="px-6 py-4 border-b border-[#F5F2ED] flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-widest font-sans">Recent Offerings Log</h4>
            <Link to="/admin/donations" className="text-[10px] text-[#9B2226] font-bold font-sans hover:underline">
              View All Donations →
            </Link>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-gray-50 sticky top-0 text-gray-400 uppercase tracking-tighter">
                <tr>
                  <th className="px-6 py-3 font-bold">Donor Name</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3 text-right">Value</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {Array.isArray(recentOfferings) && recentOfferings.map((doc) => (
                  <tr key={doc._id} className="hover:bg-orange-50/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-800">{doc.donorName}</td>
                    <td className="px-6 py-4">{doc.type} ({doc.purpose})</td>
                    <td className="px-6 py-4 text-right font-bold font-serif italic text-sm text-[#9B2226]">
                      {doc.type === 'Monetary' ? `₹${doc.amount?.toLocaleString()}` : doc.itemDetails}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        doc.status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {doc.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {(!Array.isArray(recentOfferings) || recentOfferings.length === 0) && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                      No recent offerings logged yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="flex-grow flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#EEDCC1] flex-1 flex flex-col justify-between">
            <h4 className="text-[10px] font-bold uppercase tracking-widest font-sans mb-4">Quick Management Actions</h4>
            
            <div className="grid grid-cols-2 gap-3 font-sans text-xs">
              <Link 
                to="/admin/events" 
                className="p-3 border rounded-xl hover:bg-orange-50/20 text-center flex flex-col items-center justify-center gap-1.5 transition-colors border-[#EEDCC1] text-[#9B2226]"
              >
                <Flame className="w-5 h-5" />
                <span className="font-bold">Events CMS</span>
              </Link>

              <Link 
                to="/admin/gallery" 
                className="p-3 border rounded-xl hover:bg-orange-50/20 text-center flex flex-col items-center justify-center gap-1.5 transition-colors border-[#EEDCC1] text-[#9B2226]"
              >
                <Flame className="w-5 h-5" />
                <span className="font-bold">Gallery CMS</span>
              </Link>
            </div>

            <p className="text-[10px] text-gray-400 font-sans italic mt-4">
              Authorized operators can upload event banners or media releases directly from these panels.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#EEDCC1] flex flex-col gap-4">
            <h4 className="text-[10px] font-bold uppercase tracking-widest font-sans">ERP Audit Trail</h4>
            <p className="text-[10px] text-gray-500 leading-relaxed font-sans">
              All financial ledger changes generate administrative audit logs. Super Admin users can review audit trails in the Reports board.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
export default Dashboard;
