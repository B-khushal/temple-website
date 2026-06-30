import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wallet, 
  Users, 
  HeartHandshake, 
  Building2, 
  Settings as SettingsIcon, 
  Calendar,
  Image,
  Mail,
  UserCheck,
  FileSpreadsheet,
  LogOut,
  Heart,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth, api } from '../../lib/api';

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [publicStats, setPublicStats] = React.useState<any>(null);

  React.useEffect(() => {
    api.get('/api/settings/public-stats')
      .then(res => {
        if (res.success) {
          setPublicStats(res.data);
        }
      })
      .catch(err => console.error('Failed to load public stats:', err));
  }, []);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await logout();
    navigate('/');
  };

  const sidebarLinks = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, roles: ['Super Admin', 'Treasurer', 'Accountant', 'Committee Member', 'Content Manager'] },
    { name: 'Income Ledger', path: '/admin/finances', icon: Wallet, roles: ['Super Admin', 'Treasurer', 'Accountant'] },
    { name: 'Donations', path: '/admin/donations', icon: HeartHandshake, roles: ['Super Admin', 'Treasurer', 'Accountant'] },
    { name: 'Assets', path: '/admin/assets', icon: Building2, roles: ['Super Admin', 'Treasurer'] },
    { name: 'Committee', path: '/admin/committee', icon: Users, roles: ['Super Admin', 'Content Manager', 'Committee Member'] },
    { name: 'Events', path: '/admin/events', icon: Calendar, roles: ['Super Admin', 'Content Manager', 'Committee Member'] },
    { name: 'Gallery', path: '/admin/gallery', icon: Image, roles: ['Super Admin', 'Content Manager'] },
    { name: 'Messages', path: '/admin/messages', icon: Mail, roles: ['Super Admin', 'Content Manager', 'Committee Member'] },
    { name: 'User Accounts', path: '/admin/users', icon: UserCheck, roles: ['Super Admin'] },
    { name: 'Reports Board', path: '/admin/reports', icon: FileSpreadsheet, roles: ['Super Admin', 'Treasurer', 'Accountant'] },
    { name: 'Settings', path: '/admin/settings', icon: SettingsIcon, roles: ['Super Admin', 'Content Manager'] },
  ];

  const allowedLinks = sidebarLinks.filter(link => 
    !user || link.roles.includes(user.role)
  );

  const getInitials = (name?: string) => {
    if (!name) return 'AD';
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <div className="h-screen flex flex-col font-serif overflow-hidden bg-[#FDFBF7] text-[#3E2723]">
      {/* Header */}
      <header className="h-20 flex items-center justify-between px-8 border-b-2 bg-[#9B2226] border-[#CFB53B] flex-shrink-0 z-20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'conic-gradient(#FF8C00, #F9A825, #FF8C00)', border: '2px solid #CFB53B' }}>
            <span className="text-white font-bold text-2xl">ॐ</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold uppercase tracking-widest text-white leading-none mb-1">Sri Durga Mata Temple</h1>
            <h2 className="text-sm font-bold text-[#F9A825] leading-none mb-1">శ్రీశ్రీశ్రీ దుర్గా మాత ఆలయం</h2>
            <span className="text-[10px] text-orange-200 tracking-[0.2em] uppercase font-sans">Enterprise Management System</span>
          </div>
        </div>

        <nav className="hidden md:flex gap-6 text-[11px] uppercase tracking-widest font-sans font-bold text-white/80">
          <Link to="/admin" className={cn("hover:text-white", location.pathname === '/admin' && "text-white border-b border-orange-400 pb-0.5")}>Divine Dashboard</Link>
          <Link to="/admin/finances" className={cn("hover:text-white", location.pathname === '/admin/finances' && "text-white border-b border-orange-400 pb-0.5")}>Financials</Link>
          <Link to="/admin/assets" className={cn("hover:text-white", location.pathname === '/admin/assets' && "text-white border-b border-orange-400 pb-0.5")}>Assets</Link>
          <Link to="/admin/donations" className={cn("hover:text-white", location.pathname === '/admin/donations' && "text-white border-b border-orange-400 pb-0.5")}>Donations</Link>
          <button onClick={handleLogout} className="hover:text-white flex items-center gap-1 cursor-pointer border-0 bg-transparent text-white/85 font-bold uppercase text-[11px]"><LogOut className="w-3 h-3"/> Exit</button>
        </nav>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded border border-orange-300 flex items-center justify-center text-white/80 text-xs font-sans font-bold">
            {getInitials(user?.name)}
          </div>
          <span className="text-white text-xs font-sans hidden sm:block font-bold">
            {user?.name || 'Administrator'}
          </span>
        </div>
      </header>

      {/* Main Content Wrapper */}
      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r flex flex-col bg-[#FFF9F0] border-[#EEDCC1] hidden md:flex z-10 flex-shrink-0">
          <div className="p-6 space-y-8 flex-1 overflow-y-auto">
            <section>
              <h3 className="text-[10px] uppercase tracking-[0.15em] text-gray-500 font-sans font-bold mb-4">Board Modules</h3>
              <ul className="space-y-3 font-sans text-xs">
                {allowedLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <li key={link.name}>
                      <Link to={link.path} className={cn("flex items-center gap-3 text-sm group cursor-pointer py-1", isActive ? "font-bold text-[#9B2226]" : "text-gray-600 hover:text-[#9B2226]")}>
                        <div className={cn("w-1 h-4 rounded-full", isActive ? "bg-[#9B2226]" : "bg-transparent")}></div>
                        <link.icon className="w-4 h-4 opacity-80" />
                        <span>{link.name}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </section>
          </div>
          
          <div className="mt-auto p-6 border-t border-[#EEDCC1]">
            <div className="p-4 rounded-lg bg-[#9B2226] text-white">
              <p className="text-[10px] uppercase tracking-wider mb-1 opacity-70 font-sans">System Access</p>
              <p className="font-bold text-xs">MongoDB Synced</p>
              <p className="text-[9px] mt-2 opacity-80 font-sans font-semibold">Role: {user?.role || 'Staff'}</p>
            </div>
          </div>
        </aside>

        {/* Page Content */}
        <section className="flex-1 p-8 overflow-y-auto flex flex-col gap-8 bg-[#FDFBF7]">
          {/* Global Devotee & Donation Stats Band */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#EEDCC1]/60 flex justify-center gap-12 text-center divide-x divide-[#EEDCC1]/40 font-sans text-xs flex-shrink-0">
            <div className="flex-grow flex flex-col items-center justify-center">
              <Users className="w-5 h-5 text-[#9B2226] mb-1" />
              <p className="text-3xl font-bold text-[#9B2226] mb-1 tracking-tighter font-serif">
                {publicStats?.registeredDevotees ? publicStats.registeredDevotees.toLocaleString() : '25,000'}
              </p>
              <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-gray-500">Registered Devotees</p>
            </div>
            <div className="flex-grow flex flex-col items-center justify-center pl-4 border-l border-[#EEDCC1]/40">
              <Heart className="w-5 h-5 text-[#9B2226] mb-1" />
              <p className="text-3xl font-bold text-[#9B2226] mb-1 tracking-tighter font-serif">
                ₹{publicStats?.totalDonations ? (publicStats.totalDonations / 1000).toFixed(1) + 'K' : '150K'}
              </p>
              <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-gray-500">Total Devotion Funds</p>
            </div>
            <div className="flex-grow flex flex-col items-center justify-center pl-4 border-l border-[#EEDCC1]/40">
              <ShieldCheck className="w-5 h-5 text-[#9B2226] mb-1" />
              <p className="text-3xl font-bold text-[#9B2226] mb-1 tracking-tighter font-serif">100%</p>
              <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-gray-500">Audited Ledger</p>
            </div>
          </div>
          <Outlet />
        </section>
      </main>
    </div>
  );
}
export default AdminLayout;
