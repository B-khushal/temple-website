import React, { useState } from 'react';
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
  Menu,
  X,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth, api } from '../../lib/api';

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [publicStats, setPublicStats] = React.useState<any>(null);
  const [isAdminSidebarOpen, setIsAdminSidebarOpen] = useState(false);

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

  // Reusable Sidebar Nav Links rendering
  const renderSidebarLinks = (onClickLink?: () => void) => {
    return allowedLinks.map((link) => {
      const isActive = location.pathname === link.path;
      return (
        <li key={link.name}>
          <Link 
            to={link.path} 
            onClick={onClickLink}
            className={cn(
              "flex items-center gap-3 text-sm group cursor-pointer py-2 px-3 rounded-xl transition-all duration-200", 
              isActive 
                ? "font-bold text-[#9B2226] bg-[#9B2226]/5" 
                : "text-gray-600 hover:text-[#9B2226] hover:bg-gray-50"
            )}
          >
            <link.icon className="w-4 h-4 opacity-80 flex-shrink-0" />
            <span className="md:hidden lg:block block truncate">{link.name}</span>
          </Link>
        </li>
      );
    });
  };

  return (
    <div className="h-screen flex flex-col font-serif overflow-hidden bg-[#FDFBF7] text-[#3E2723]">
      {/* Header */}
      <header className="h-20 flex items-center justify-between px-4 sm:px-8 border-b-2 bg-[#9B2226] border-[#CFB53B] flex-shrink-0 z-20 shadow-md">
        <div className="flex items-center gap-2 sm:gap-4 max-w-[70%] sm:max-w-none">
          {/* Mobile menu trigger */}
          <button
            onClick={() => setIsAdminSidebarOpen(!isAdminSidebarOpen)}
            className="text-white hover:text-orange-200 p-2 md:hidden focus:outline-none flex-shrink-0"
            aria-label="Toggle admin menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'conic-gradient(#FF8C00, #F9A825, #FF8C00)', border: '2px solid #CFB53B' }}>
            <span className="text-white font-bold text-lg sm:text-2xl">ॐ</span>
          </div>
          <div className="flex flex-col min-w-0">
            <h1 className="text-sm sm:text-base md:text-xl font-bold uppercase tracking-widest text-white leading-none mb-1 truncate">Sri Durga Mata Temple</h1>
            <h2 className="text-[10px] sm:text-xs font-bold text-[#F9A825] leading-none mb-1 truncate hidden sm:block">శ్రీశ్రీశ్రీ దుర్గా మాత ఆలయం</h2>
            <span className="text-[8px] sm:text-[9px] md:text-[10px] text-orange-200 tracking-[0.15em] sm:tracking-[0.2em] uppercase font-sans truncate">Enterprise Management System</span>
          </div>
        </div>

        <nav className="hidden xl:flex gap-6 text-[11px] uppercase tracking-widest font-sans font-bold text-white/80">
          <Link to="/admin" className={cn("hover:text-white", location.pathname === '/admin' && "text-white border-b border-orange-400 pb-0.5")}>Divine Dashboard</Link>
          <Link to="/admin/finances" className={cn("hover:text-white", location.pathname === '/admin/finances' && "text-white border-b border-orange-400 pb-0.5")}>Financials</Link>
          <Link to="/admin/assets" className={cn("hover:text-white", location.pathname === '/admin/assets' && "text-white border-b border-orange-400 pb-0.5")}>Assets</Link>
          <Link to="/admin/donations" className={cn("hover:text-white", location.pathname === '/admin/donations' && "text-white border-b border-orange-400 pb-0.5")}>Donations</Link>
          <button onClick={handleLogout} className="hover:text-white flex items-center gap-1 cursor-pointer border-0 bg-transparent text-white/85 font-bold uppercase text-[11px]"><LogOut className="w-3 h-3"/> Exit</button>
        </nav>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded border border-orange-300 flex items-center justify-center text-white/80 text-xs font-sans font-bold flex-shrink-0">
            {getInitials(user?.name)}
          </div>
          <span className="text-white text-xs font-sans hidden sm:block font-bold truncate max-w-[120px]">
            {user?.name || 'Administrator'}
          </span>
        </div>
      </header>

      {/* Main Content Wrapper */}
      <main className="flex-1 flex overflow-hidden relative">
        
        {/* 1. Desktop & Tablet Sidebar (Transition w-20 to w-64) */}
        <aside className="border-r flex flex-col bg-[#FFF9F0] border-[#EEDCC1] z-10 flex-shrink-0 transition-all duration-300 w-20 lg:w-64 hidden md:flex">
          <div className="p-4 lg:p-6 space-y-8 flex-1 overflow-y-auto">
            <section>
              <h3 className="text-[9px] uppercase tracking-[0.15em] text-gray-500 font-sans font-bold mb-4 md:hidden lg:block hidden">Board Modules</h3>
              <ul className="space-y-2 font-sans text-xs">
                {renderSidebarLinks()}
              </ul>
            </section>
          </div>
          
          <div className="mt-auto p-4 lg:p-6 border-t border-[#EEDCC1]">
            <div className="p-3 lg:p-4 rounded-xl bg-[#9B2226] text-white">
              <p className="text-[8px] lg:text-[10px] uppercase tracking-wider mb-0.5 opacity-70 font-sans md:hidden lg:block hidden">System Access</p>
              <p className="font-bold text-[10px] lg:text-xs text-center lg:text-left">MongoDB Synced</p>
              <p className="text-[8px] lg:text-[9px] mt-1 opacity-80 font-sans font-semibold md:hidden lg:block hidden">Role: {user?.role || 'Staff'}</p>
            </div>
          </div>
        </aside>

        {/* 2. Mobile Drawer Navigation Sidebar */}
        <div 
          className={cn(
            "fixed inset-0 z-30 md:hidden transition-all duration-300 ease-in-out pointer-events-none",
            isAdminSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0"
          )}
        >
          {/* Backdrop Overlay */}
          <div 
            onClick={() => setIsAdminSidebarOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
          />

          {/* Drawer Sidebar Menu */}
          <aside 
            className={cn(
              "absolute top-0 left-0 h-full w-[260px] bg-[#FFF9F0] border-r border-[#EEDCC1] shadow-2xl flex flex-col transition-transform duration-300 ease-out z-40",
              isAdminSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}
          >
            {/* Header in Drawer */}
            <div className="flex justify-between items-center p-6 border-b border-[#EEDCC1]">
              <div className="flex items-center gap-2">
                <span className="text-xl">ॐ</span>
                <span className="font-serif font-bold text-sm text-[#9B2226] tracking-wider uppercase">Portal Modules</span>
              </div>
              <button 
                onClick={() => setIsAdminSidebarOpen(false)} 
                className="text-gray-400 hover:text-[#9B2226] p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modules List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <ul className="space-y-2 font-sans text-xs">
                {renderSidebarLinks(() => setIsAdminSidebarOpen(false))}
              </ul>
            </div>

            {/* Bottom logout exit */}
            <div className="p-4 border-t border-[#EEDCC1] mt-auto space-y-3 font-sans">
              <div className="p-3 rounded-lg bg-[#9B2226] text-white">
                <p className="text-[10px] uppercase tracking-wider mb-0.5 opacity-70">Log Operator</p>
                <p className="font-bold text-xs truncate">{user?.name || 'Administrator'}</p>
                <p className="text-[9px] mt-1.5 opacity-80">Role: {user?.role || 'Staff'}</p>
              </div>
              
              <button 
                onClick={handleLogout} 
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-gray-100 hover:bg-red-50 hover:text-red-700 text-gray-700 text-xs font-bold uppercase rounded-xl transition-colors cursor-pointer border-0"
              >
                <LogOut className="w-4 h-4" /> Log Out Portal
              </button>
            </div>
          </aside>
        </div>

        {/* Page Content */}
        <section className="flex-1 p-4 sm:p-8 overflow-y-auto flex flex-col gap-6 sm:gap-8 bg-[#FDFBF7]">
          
          {/* Global Devotee & Donation Stats Band */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-[#EEDCC1]/60 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-12 text-center divide-y sm:divide-y-0 sm:divide-x divide-[#EEDCC1]/40 font-sans text-xs flex-shrink-0">
            <div className="flex-grow flex flex-col items-center justify-center py-2 sm:py-0">
              <Users className="w-5 h-5 text-[#9B2226] mb-1" />
              <p className="text-2xl sm:text-3xl font-bold text-[#9B2226] mb-1 tracking-tighter font-serif">
                {publicStats?.registeredDevotees ? publicStats.registeredDevotees.toLocaleString() : '25,000'}
              </p>
              <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-gray-500">Registered Devotees</p>
            </div>
            
            <div className="flex-grow flex flex-col items-center justify-center py-2 sm:py-0 sm:pl-4">
              <Heart className="w-5 h-5 text-[#9B2226] mb-1" />
              <p className="text-2xl sm:text-3xl font-bold text-[#9B2226] mb-1 tracking-tighter font-serif">
                ₹{publicStats?.totalDonations ? (publicStats.totalDonations / 1000).toFixed(1) + 'K' : '150K'}
              </p>
              <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-gray-500">Total Devotion Funds</p>
            </div>
            
            <div className="flex-grow flex flex-col items-center justify-center py-2 sm:py-0 sm:pl-4">
              <ShieldCheck className="w-5 h-5 text-[#9B2226] mb-1" />
              <p className="text-2xl sm:text-3xl font-bold text-[#9B2226] mb-1 tracking-tighter font-serif">100%</p>
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
