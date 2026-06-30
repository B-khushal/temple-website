import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { api, useAuth } from '../../lib/api';
import { Download, FileText, Calendar, Building, Landmark, History } from 'lucide-react';

export function ReportsAdmin() {
  const { user } = useAuth();
  
  const [stats, setStats] = useState<any>({
    totalCorpus: 0,
    totalIncome: 0,
    totalExpense: 0,
    goldReserveValuation: 0,
    activeDonors: 0,
  });

  const [assets, setAssets] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReportData = async () => {
    setLoading(true);
    try {
      const summaryRes = await api.get('/api/transactions/summary');
      if (summaryRes.success) setStats(summaryRes.data);

      const assetsRes = await api.get('/api/assets');
      if (assetsRes.success) setAssets(assetsRes.data);

      const donationsRes = await api.get('/api/donations?limit=100');
      if (donationsRes.success) setDonations(donationsRes.data);

      if (user?.role === 'Super Admin') {
        const logsRes = await api.get('/api/settings/logs');
        if (logsRes.success) setAuditLogs(logsRes.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReportData();
  }, [user]);

  // Client-side CSV download helpers
  const triggerClientCSVDownload = (filename: string, headers: string[], rows: any[][]) => {
    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
      csvContent += row.map(cell => `"${(cell || '').toString().replace(/"/g, '""')}"`).join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAssetValuationReport = () => {
    const headers = ['Asset ID', 'Asset Name', 'Category', 'Acquisition Date', 'Purchase Value (INR)', 'Current Valuation (INR)', 'Status', 'Location'];
    const rows = Array.isArray(assets) ? assets.map(a => [
      a._id,
      a.name,
      a.category,
      a.acquisitionDate ? new Date(a.acquisitionDate).toLocaleDateString() : 'N/A',
      a.purchaseValue,
      a.currentValuation,
      a.status,
      a.location
    ]) : [];
    triggerClientCSVDownload('temple_assets_valuation_report.csv', headers, rows);
  };

  const downloadDonationsAuditReport = () => {
    const headers = ['Receipt No', 'Date', 'Donor Name', 'Type', 'Amount (INR)', 'In-Kind Item Details', 'Purpose', 'Payment Method', 'Status'];
    const rows = Array.isArray(donations) ? donations.map(d => [
      d.receiptNumber,
      new Date(d.date).toLocaleDateString(),
      d.donorName,
      d.type,
      d.amount,
      d.itemDetails,
      d.purpose,
      d.paymentMethod,
      d.status
    ]) : [];
    triggerClientCSVDownload('temple_donations_audit_report.csv', headers, rows);
  };

  const downloadAuditTrailReport = () => {
    const headers = ['Timestamp', 'IP Address', 'Action Code', 'Collection', 'Record ID', 'User Email'];
    const rows = Array.isArray(auditLogs) ? auditLogs.map(l => [
      new Date(l.timestamp).toLocaleString(),
      l.ip,
      l.action,
      l.collectionName,
      l.recordId,
      l.user?.email || 'System'
    ]) : [];
    triggerClientCSVDownload('temple_security_audit_logs.csv', headers, rows);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#FDFBF7]">
        <div className="w-12 h-12 animate-spin rounded-full border-4 border-[#9B2226] border-t-transparent mb-4"></div>
        <p className="text-[#3E2723] text-xs uppercase tracking-widest font-sans font-bold">Compiling Financial Statements...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-serif">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold italic tracking-tight text-[#3E2723]">ERP Financial Reports</h2>
          <p className="text-xs uppercase tracking-widest text-gray-500 font-sans mt-1">
            Generate valuation audits, ledger statements, and security trails.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans text-xs">
        
        {/* Card A: Financial Ledger Report */}
        <Card className="hover:border-[#CFB53B] transition-colors rounded-2xl overflow-hidden flex flex-col justify-between">
          <CardHeader className="bg-gray-50/50 p-4 border-b">
            <h4 className="font-bold flex items-center gap-1.5 text-gray-700">
              <Landmark className="w-4 h-4 text-[#9B2226]" /> Ledger Statements
            </h4>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-gray-500 leading-relaxed">
              Export the comprehensive Income & Expense double-entry accounting ledger of the temple for auditing.
            </p>
            <div className="border-t pt-3 space-y-1 text-gray-800">
              <p><strong>Total Income:</strong> <span className="font-serif italic font-bold">₹{stats.totalIncome?.toLocaleString()}</span></p>
              <p><strong>Total Expense:</strong> <span className="font-serif italic font-bold">₹{stats.totalExpense?.toLocaleString()}</span></p>
              <p className="text-[#9B2226] font-bold"><strong>Current Balance:</strong> <span className="font-serif italic font-bold text-sm">₹{stats.totalCorpus?.toLocaleString()}</span></p>
            </div>
            <a 
              href="/api/transactions/export" 
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#9B2226] text-white rounded-xl hover:bg-[#7a181b] transition-colors font-bold uppercase tracking-wider text-[10px] border-0"
            >
              <Download className="w-3.5 h-3.5" /> Download Ledger Sheet
            </a>
          </CardContent>
        </Card>

        {/* Card B: Asset Valuation Report */}
        <Card className="hover:border-[#CFB53B] transition-colors rounded-2xl overflow-hidden flex flex-col justify-between">
          <CardHeader className="bg-gray-50/50 p-4 border-b">
            <h4 className="font-bold flex items-center gap-1.5 text-gray-700">
              <Building className="w-4 h-4 text-[#9B2226]" /> Asset Valuation Audits
            </h4>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-gray-500 leading-relaxed">
              Generate valuation sheets for land holdings, buildings, gold reserve storage, and other valuable items.
            </p>
            <div className="border-t pt-3 space-y-1 text-gray-800">
              <p><strong>Total Items Tracked:</strong> <span className="font-serif italic font-bold">{assets?.length || 0}</span> Assets</p>
              <p><strong>Gold Reserve Value:</strong> <span className="font-serif italic font-bold">₹{(stats.goldReserveValuation / 10000000).toFixed(2)} Cr</span></p>
              <p className="text-[#9B2226] font-bold">
                <strong>Est. Net Asset Value:</strong> <span className="font-serif italic font-bold text-sm">₹{((Array.isArray(assets) ? assets.reduce((s,a)=>s+(a.currentValuation || 0),0) : 0)/10000000).toFixed(2)} Cr</span>
              </p>
            </div>
            <button 
              onClick={downloadAssetValuationReport}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#9B2226] text-white rounded-xl hover:bg-[#7a181b] transition-colors font-bold uppercase tracking-wider text-[10px] border-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Valuation CSV Export
            </button>
          </CardContent>
        </Card>

        {/* Card C: Donations & Donors Wall */}
        <Card className="hover:border-[#CFB53B] transition-colors rounded-2xl overflow-hidden flex flex-col justify-between">
          <CardHeader className="bg-gray-50/50 p-4 border-b">
            <h4 className="font-bold flex items-center gap-1.5 text-gray-700">
              <FileText className="w-4 h-4 text-[#9B2226]" /> Donation Records
            </h4>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-gray-500 leading-relaxed">
              Consolidate online, UPI, check, and cash offerings, mapping purposes like Annadanam, Navratri, and construction.
            </p>
            <div className="border-t pt-3 space-y-1 text-gray-800">
              <p><strong>Logs count:</strong> <span className="font-serif italic font-bold">{donations?.length || 0}</span> records</p>
              <p><strong>Unique Donors:</strong> <span className="font-serif italic font-bold">{stats.activeDonors}</span></p>
            </div>
            <button 
              onClick={downloadDonationsAuditReport}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#9B2226] text-white rounded-xl hover:bg-[#7a181b] transition-colors font-bold uppercase tracking-wider text-[10px] border-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Donor Audit Sheet
            </button>
          </CardContent>
        </Card>

      </div>

      {/* Security logs section - Super Admin only */}
      {user?.role === 'Super Admin' && (
        <Card className="rounded-2xl overflow-hidden">
          <CardHeader className="p-4 border-b bg-gray-50/50 flex justify-between items-center flex-wrap gap-4 font-sans text-xs">
            <h4 className="font-bold flex items-center gap-1.5 text-gray-700">
              <History className="w-4 h-4 text-[#9B2226]" /> Security Audit Logs Trail
            </h4>
            <button
              onClick={downloadAuditTrailReport}
              className="flex items-center gap-1.5 px-3 py-1.5 border rounded-lg bg-white hover:bg-gray-50 font-bold border-gray-200 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#9B2226]" /> Export Security Logs CSV
            </button>
          </CardHeader>
          <CardContent className="p-0 max-h-[300px] overflow-y-auto">
            {/* Desktop Table View */}
            <table className="w-full text-left text-[11px] font-sans whitespace-nowrap hidden md:table">
              <thead className="bg-gray-50 text-gray-400 font-bold border-b sticky top-0">
                <tr>
                  <th className="px-4 py-2.5">Timestamp</th>
                  <th className="px-4 py-2.5">Action</th>
                  <th className="px-4 py-2.5">Operator</th>
                  <th className="px-4 py-2.5">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {auditLogs.slice(0,25).map((log, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-500">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="px-4 py-2"><span className="px-2 py-0.5 rounded-full bg-orange-50 text-orange-800 border border-orange-100 font-mono font-bold">{log.action}</span></td>
                    <td className="px-4 py-2 font-bold text-gray-800">{log.user?.name || 'System / Public'} ({log.user?.email || 'N/A'})</td>
                    <td className="px-4 py-2 text-gray-500 font-mono">{log.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Card List Fallback */}
            <div className="block md:hidden divide-y divide-gray-100 p-4 space-y-3 font-sans text-xs">
              {auditLogs.slice(0,25).map((log, idx) => (
                <div key={idx} className="pt-3 first:pt-0 space-y-1">
                  <div className="flex justify-between items-start">
                    <span className="px-2 py-0.5 rounded bg-orange-50 text-orange-800 border border-orange-100 font-mono font-bold text-[9px]">{log.action}</span>
                    <span className="text-[9px] text-gray-400">{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="text-gray-800 font-bold leading-tight">{log.user?.name || 'System / Public'}</div>
                  <div className="text-gray-500 font-mono text-[9px]">IP: {log.ip} | Email: {log.user?.email || 'N/A'}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
export default ReportsAdmin;
