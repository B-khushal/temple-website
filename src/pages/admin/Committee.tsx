import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { api } from '../../lib/api';
import { 
  Plus, Edit2, Trash2, Eye, EyeOff, GripVertical, 
  Search, Sparkles, Phone, Mail, Award, ShieldCheck, 
  Star, UserCheck, Users, Bookmark, Heart 
} from 'lucide-react';

// Categories mapping for internal/display names
const ROLE_CATEGORIES = [
  { value: 'CHAIRMAN', label: 'Chairman' },
  { value: 'GENERAL_SECRETARY', label: 'General Secretary' },
  { value: 'TREASURER', label: 'Treasurer' },
  { value: 'VICE_CHAIRMAN', label: 'Vice Chairmen' },
  { value: 'JOINT_SECRETARY', label: 'Joint Secretaries' },
  { value: 'ORGANISING_SECRETARY', label: 'Organising Secretaries' },
  { value: 'EXECUTIVE_MEMBER', label: 'Executive Members' },
  { value: 'ADVISOR', label: 'Advisors' },
  { value: 'PAST_MEMBER', label: 'Past Members / Archives' }
];

export function Committee() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Navigation & Search States
  const [activeTab, setActiveTab] = useState('CHAIRMAN');
  const [searchQuery, setSearchQuery] = useState('');
  const [draggedId, setDraggedId] = useState<string | null>(null);

  // Form Modal States
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [role, setRole] = useState(''); // Custom designation (e.g. Chairman, Executive Member, etc.)
  const [roleCategory, setRoleCategory] = useState('EXECUTIVE_MEMBER');
  const [periodStart, setPeriodStart] = useState('');
  const [periodEnd, setPeriodEnd] = useState('Present');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [displayOrder, setDisplayOrder] = useState(0);
  const [formError, setFormError] = useState('');

  // Fetch all committee members
  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/committee');
      if (res.success) {
        setMembers(res.data || res.members || []);
      }
    } catch (e) {
      console.error('Failed to fetch committee:', e);
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
        designation: role || getCategoryLabel(roleCategory),
        role: role || getCategoryLabel(roleCategory),
        role_category: roleCategory,
        roleCategory,
        periodStart,
        periodEnd: periodEnd || 'Present',
        bio,
        email,
        phone,
        imageUrl,
        is_active: isActive,
        isActive,
        display_order: displayOrder,
        displayOrder,
        category: roleCategory === 'PAST_MEMBER' ? 'Past Member' : 'Current Committee'
      };

      let res;
      if (editingId) {
        res = await api.put(`/api/committee/${editingId}`, body);
      } else {
        // For new members, default display_order to the end of the list in that category
        const categoryCount = members.filter(m => (m.role_category || m.roleCategory) === roleCategory).length;
        body.display_order = categoryCount;
        body.displayOrder = categoryCount;
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
    setRole(member.role || member.designation || '');
    setRoleCategory(member.role_category || member.roleCategory || 'EXECUTIVE_MEMBER');
    setPeriodStart(member.periodStart || '');
    setPeriodEnd(member.periodEnd || 'Present');
    setBio(member.bio || '');
    setEmail(member.email || '');
    setPhone(member.phone || '');
    setImageUrl(member.imageUrl || member.photoUrl || member.image || '');
    setIsActive(member.is_active !== undefined ? member.is_active : member.isActive !== false);
    setDisplayOrder(member.display_order || member.displayOrder || 0);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this board member?')) return;
    try {
      const res = await api.delete(`/api/committee/${id}`);
      if (res.success) {
        fetchMembers();
      }
    } catch (e) {
      console.error('Failed to delete member:', e);
    }
  };

  const toggleMemberActive = async (member: any) => {
    try {
      const nextActive = !(member.is_active !== undefined ? member.is_active : member.isActive !== false);
      const res = await api.put(`/api/committee/${member._id}`, {
        ...member,
        is_active: nextActive,
        isActive: nextActive
      });
      if (res.success) {
        // Optimize UI state update in-place
        setMembers(members.map(m => m._id === member._id ? { ...m, is_active: nextActive, isActive: nextActive } : m));
      }
    } catch (e) {
      console.error('Failed to toggle active status:', e);
    }
  };

  // Drag and Drop (HTML5 native API reordering)
  const handleDragStart = (id: string) => {
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (targetId: string) => {
    if (!draggedId || draggedId === targetId) return;

    // Filter items in the active category
    const catItems = members.filter(m => (m.role_category || m.roleCategory || 'EXECUTIVE_MEMBER') === activeTab);
    const draggedIdx = catItems.findIndex(m => m._id === draggedId);
    const targetIdx = catItems.findIndex(m => m._id === targetId);

    if (draggedIdx === -1 || targetIdx === -1) return;

    // Reorder array in memory
    const updatedCatItems = [...catItems];
    const [removed] = updatedCatItems.splice(draggedIdx, 1);
    updatedCatItems.splice(targetIdx, 0, removed);

    // Prepare payload of reordered IDs and display orders
    const ordersPayload = updatedCatItems.map((m, idx) => ({
      id: m._id,
      display_order: idx
    }));

    try {
      // Optimistically update frontend state
      const orderMap = new Map(ordersPayload.map(o => [o.id, o.display_order]));
      setMembers(members.map(m => {
        if (orderMap.has(m._id)) {
          return { ...m, display_order: orderMap.get(m._id), displayOrder: orderMap.get(m._id) };
        }
        return m;
      }));

      // Send to server
      const res = await api.put('/api/committee/reorder', { orders: ordersPayload });
      if (!res.success) {
        fetchMembers(); // Revert on failure
      }
    } catch (e) {
      console.error('Failed to update display order:', e);
      fetchMembers(); // Revert on failure
    } finally {
      setDraggedId(null);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setRole('');
    setRoleCategory(activeTab);
    setPeriodStart('');
    setPeriodEnd('Present');
    setBio('');
    setEmail('');
    setPhone('');
    setImageUrl('');
    setIsActive(true);
    setDisplayOrder(0);
    setFormError('');
  };

  const getCategoryLabel = (val: string) => {
    return ROLE_CATEGORIES.find(c => c.value === val)?.label || 'Committee Member';
  };

  // Filter current active members in the active tab (filtered by search)
  const tabMembers = members.filter(m => {
    const mCat = m.role_category || m.roleCategory || 'EXECUTIVE_MEMBER';
    if (mCat !== activeTab) return false;
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const nameMatch = m.name?.toLowerCase().includes(q);
      const designationMatch = (m.role || m.designation || '').toLowerCase().includes(q);
      return nameMatch || designationMatch;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold italic tracking-tight text-[#3E2723]">Committee Management</h2>
          <p className="text-xs uppercase tracking-widest text-gray-500 font-sans mt-1">
            Dynamic, role-based committee structures with custom layouts, ordering, and live preview.
          </p>
        </div>
        <Button 
          onClick={() => { resetForm(); setShowModal(true); }} 
          className="flex items-center gap-2 bg-[#9B2226] hover:bg-[#801b1e] text-white border-0 font-sans text-xs px-5 py-2.5 rounded-xl shadow-lg transition-transform hover:scale-[1.02]"
        >
          <Plus className="w-4.5 h-4.5" /> Add Board Member
        </Button>
      </div>

      {/* Main Grid: Split Layout (Control Panel vs Live Preview) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Control Panel (7 Cols) */}
        <div className="xl:col-span-7 space-y-6">
          <Card className="border border-[#EEDCC1] bg-[#FDFBF7]/80 rounded-2xl shadow-sm overflow-hidden">
            <CardContent className="p-6 space-y-6">
              
              {/* Search & Filter Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Search by name or specific designation..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EEDCC1] bg-white font-sans text-xs focus:ring-1 focus:ring-[#CFB53B] focus:border-[#CFB53B]"
                />
              </div>

              {/* Responsive Category Tabs */}
              <div className="flex flex-wrap gap-1.5 border-b border-[#EEDCC1]/40 pb-4">
                {ROLE_CATEGORIES.map(cat => {
                  const catCount = members.filter(m => (m.role_category || m.roleCategory || 'EXECUTIVE_MEMBER') === cat.value).length;
                  const isActive = activeTab === cat.value;

                  return (
                    <button
                      key={cat.value}
                      onClick={() => {
                        setActiveTab(cat.value);
                        setRoleCategory(cat.value);
                      }}
                      className={`px-3 py-2 rounded-lg font-sans text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#9B2226] text-white shadow-md'
                          : 'bg-[#F7F1E5] text-[#3E2723] hover:bg-orange-100/50'
                      }`}
                    >
                      <span>{cat.label.replace(' / Archives', '')}</span>
                      <span className={`px-1.5 py-0.5 rounded-full text-[8px] ${
                        isActive ? 'bg-white text-[#9B2226]' : 'bg-[#EEDCC1] text-gray-700'
                      }`}>
                        {catCount}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Cards list for active tab */}
              <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
                {loading && members.length === 0 ? (
                  <div className="py-12 text-center text-xs font-sans text-gray-400">Loading board records...</div>
                ) : tabMembers.length === 0 ? (
                  <div className="py-12 text-center text-xs font-sans text-gray-400 italic">
                    {searchQuery ? 'No matches found.' : 'No members in this category.'}
                  </div>
                ) : (
                  tabMembers.map((member, idx) => {
                    const isMemberActive = member.is_active !== undefined ? member.is_active : member.isActive !== false;
                    
                    return (
                      <div
                        key={member._id}
                        draggable
                        onDragStart={() => handleDragStart(member._id)}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(member._id)}
                        className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all bg-white relative group cursor-grab active:cursor-grabbing ${
                          draggedId === member._id ? 'opacity-40 border-dashed border-[#CFB53B] bg-orange-50/20' : 'border-[#EEDCC1] hover:border-[#CFB53B]/50 hover:shadow-sm'
                        }`}
                      >
                        {/* Drag Handle Icon */}
                        <div className="text-gray-400 group-hover:text-[#CFB53B] transition-colors cursor-grab">
                          <GripVertical className="w-4 h-4" />
                        </div>

                        {/* Profile Image Initials */}
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500/10 to-[#CFB53B]/10 border border-[#EEDCC1] flex-shrink-0 flex items-center justify-center text-xs font-sans font-bold text-[#9B2226]">
                          {member.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                        </div>

                        {/* Main Details */}
                        <div className="flex-grow min-w-0 font-serif">
                          <h4 className="font-bold text-gray-800 text-sm truncate flex items-center gap-1.5">
                            {member.name}
                            {!isMemberActive && (
                              <span className="font-sans text-[8px] uppercase font-bold text-gray-400 bg-gray-100 border px-1.5 py-0.5 rounded-full">
                                Hidden
                              </span>
                            )}
                          </h4>
                          <p className="text-xs text-saffron-700 font-sans tracking-wide truncate">{member.role || member.designation}</p>
                          <div className="flex items-center gap-3 text-[10px] text-gray-400 font-sans mt-0.5">
                            {member.phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3 text-gray-400" /> {member.phone}
                              </span>
                            )}
                            <span className="bg-gray-50 border border-gray-100 px-1 rounded text-[9px] font-mono">
                              {member.periodStart} - {member.periodEnd}
                            </span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1 font-sans">
                          {/* Visibility toggle button */}
                          <button
                            onClick={() => toggleMemberActive(member)}
                            title={isMemberActive ? 'Hide on website' : 'Show on website'}
                            className={`p-1.5 rounded transition-colors cursor-pointer ${
                              isMemberActive 
                                ? 'text-green-600 hover:bg-green-50' 
                                : 'text-gray-400 hover:bg-gray-100'
                            }`}
                          >
                            {isMemberActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>

                          {/* Edit button */}
                          <button 
                            onClick={() => handleEdit(member)} 
                            title="Edit"
                            className="p-1.5 text-gray-500 hover:bg-gray-100 hover:text-[#9B2226] rounded transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete button */}
                          <button 
                            onClick={() => handleDelete(member._id)} 
                            title="Delete"
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* drag info footnote */}
              <div className="text-[10px] text-gray-400 font-sans flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#CFB53B] animate-pulse" />
                <span>Tip: Drag and drop cards to reorder how they display on the public website within this category.</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Live Premium Public Preview (5 Cols) */}
        <div className="xl:col-span-5 space-y-6">
          <Card className="border border-[#EEDCC1] bg-[#FDFBF7]/80 rounded-2xl shadow-sm overflow-hidden sticky top-24">
            <div className="bg-[#9B2226] py-3.5 px-5 flex items-center justify-between border-b border-[#CFB53B]">
              <span className="text-white font-serif italic text-sm tracking-wide">Live Public Website Preview</span>
              <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-orange-200 font-sans font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span>Reflects Active Data</span>
              </div>
            </div>

            <CardContent className="p-6 bg-[#FCF8F0] max-h-[600px] overflow-y-auto space-y-8 scrollbar-thin">
              
              {/* Glow Title inside Preview */}
              <div className="text-center space-y-1 py-4 border-b border-[#EEDCC1]/40">
                <h3 className="text-lg font-bold italic text-[#3E2723] font-serif" style={{ textShadow: '0 0 15px rgba(207, 181, 59, 0.2)' }}>
                  Present Committee Members
                </h3>
                <span className="text-[9px] uppercase tracking-widest text-[#9B2226] font-sans font-bold">
                  Bapu Nagar Trust Administration
                </span>
              </div>

              {/* Loop categories sequentially matching the public page order */}
              {ROLE_CATEGORIES.map(cat => {
                const catMembers = members.filter(m => {
                  const mCat = m.role_category || m.roleCategory || 'EXECUTIVE_MEMBER';
                  const isVisible = m.is_active !== undefined ? m.is_active : m.isActive !== false;
                  return mCat === cat.value && isVisible;
                });

                if (catMembers.length === 0) return null;

                const isFeatured = ['CHAIRMAN', 'GENERAL_SECRETARY', 'TREASURER'].includes(cat.value);

                return (
                  <div key={cat.value} className="space-y-3">
                    <div className="flex items-center gap-2 justify-center">
                      <div className="h-[0.5px] w-6 bg-[#CFB53B]/50" />
                      <span className="text-[9px] uppercase tracking-widest font-sans font-bold text-[#9B2226]">
                        {cat.label.replace(' / Archives', '')}
                      </span>
                      <div className="h-[0.5px] w-6 bg-[#CFB53B]/50" />
                    </div>

                    <div className={isFeatured ? "space-y-4 max-w-sm mx-auto" : "grid grid-cols-2 gap-3"}>
                      {catMembers.map((m) => {
                        
                        if (isFeatured) {
                          return (
                            <div 
                              key={m._id}
                              className="relative p-[1px] rounded-2xl bg-[#CFB53B]/30 shadow-sm overflow-hidden"
                            >
                              <div className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF6ED] to-[#F5EEDC] p-4 rounded-[15px] text-center space-y-3 relative overflow-hidden border border-[#CFB53B]/25">
                                {/* Thin Gold Top Accent Line */}
                                <div className="absolute top-0 inset-x-0 h-[3px] bg-[#CFB53B] z-10" />
                                {/* Geometric Dot Pattern */}
                                <div className="absolute inset-0 bg-[radial-gradient(#CFB53B_1.2px,transparent_1.2px)] [background-size:12px_12px] opacity-[0.06] pointer-events-none" />
                                {/* Profile Area Radial Highlight */}
                                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-20 bg-[radial-gradient(circle,_rgba(207,181,59,0.1)_0%,_transparent_70%)] pointer-events-none rounded-full" />
                                
                                <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-b from-[#FF8800] to-[#F0B030] text-white flex items-center justify-center font-sans font-bold text-sm shadow-md relative z-10">
                                  {m.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                                </div>
                                <div className="relative z-10">
                                  <h4 className="font-bold text-xs text-[#2D1B18] font-serif leading-tight">{m.name}</h4>
                                  <span className="text-[8px] uppercase tracking-wider font-sans font-bold text-[#9B2226] block mt-0.5">{m.role || m.designation}</span>
                                </div>
                                {m.phone && (
                                  <div className="inline-flex items-center gap-1 bg-[#FF8800]/5 border border-[#FF8800]/15 rounded-lg px-2.5 py-1 text-[9px] text-[#9B2226] font-sans font-bold relative z-10">
                                    <Phone className="w-2.5 h-2.5" /> +91 {m.phone}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        }

                        // Normal members preview cards
                        return (
                          <div 
                            key={m._id}
                            className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF6ED] to-[#F5EEDC] border border-[#CFB53B]/20 rounded-xl p-3 text-left space-y-2 flex flex-col justify-between relative overflow-hidden"
                          >
                            {/* Thin Gold Top Accent Line */}
                            <div className="absolute top-0 inset-x-0 h-[2.5px] bg-[#CFB53B]/70 z-10" />
                            {/* Geometric Dot Pattern */}
                            <div className="absolute inset-0 bg-[radial-gradient(#CFB53B_1.2px,transparent_1.2px)] [background-size:14px_14px] opacity-[0.05] pointer-events-none" />
                            
                            <div className="flex items-center gap-2 min-w-0 relative z-10">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-b from-[#FF8800]/90 to-[#F0B030]/90 border border-[#EEDCC1] flex-shrink-0 flex items-center justify-center text-[8px] font-sans font-bold text-white">
                                {m.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                              </div>
                              <div className="min-w-0">
                                <h5 className="font-bold text-[10px] text-[#2D1B18] font-serif truncate leading-tight">{m.name}</h5>
                                <span className="text-[7px] text-[#9B2226]/85 font-sans font-bold block truncate leading-none mt-0.5">{m.role || m.designation}</span>
                              </div>
                            </div>
                            {m.phone && (
                              <div className="text-[8px] text-[#4E3629] font-sans flex items-center gap-1 border-t border-[#EEDCC1]/40 pt-1.5 mt-1 relative z-10">
                                <Phone className="w-2.5 h-2.5 text-[#CFB53B]" /> 
                                <span className="font-semibold truncate">{m.phone}</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

      </div>

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-[fadeIn_0.2s_ease-out]">
          <Card className="bg-white border-0 shadow-2xl max-w-lg w-full rounded-2xl overflow-hidden animate-[revealUp_0.3s_cubic-bezier(0.16,1,0.3,1)_both]">
            <div className="h-2 bg-[#9B2226]"></div>
            <CardContent className="p-6 space-y-4 font-sans text-xs">
              
              <div className="flex justify-between items-center pb-2 border-b border-[#EEDCC1]/40">
                <h3 className="text-base font-bold text-gray-800 uppercase tracking-wider font-serif">
                  {editingId ? 'Edit Committee Record' : 'Add Board Member'}
                </h3>
                <button 
                  onClick={() => { setShowModal(false); resetForm(); }} 
                  className="text-gray-400 hover:text-gray-600 text-2xl font-light cursor-pointer focus:outline-none"
                >
                  &times;
                </button>
              </div>

              {formError && (
                <div className="p-3 bg-red-50 text-red-700 rounded border border-red-200 font-medium">
                  {formError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                
                {/* Name */}
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Full Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    className="w-full px-3 py-2 border border-[#EEDCC1] rounded-xl bg-gray-50/50 font-sans text-xs focus:ring-1 focus:ring-[#CFB53B]" 
                  />
                </div>

                {/* Role Category & Custom designation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Committee Category *</label>
                    <select 
                      value={roleCategory} 
                      onChange={e => {
                        setRoleCategory(e.target.value);
                        // Auto-fill standard role text as helper
                        setRole(getCategoryLabel(e.target.value));
                      }} 
                      className="w-full px-3 py-2 border border-[#EEDCC1] rounded-xl bg-gray-50/50 font-sans text-xs focus:ring-1 focus:ring-[#CFB53B]"
                    >
                      {ROLE_CATEGORIES.map(c => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Custom Role / Designation</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Chairman or Advisor" 
                      value={role} 
                      onChange={e => setRole(e.target.value)} 
                      className="w-full px-3 py-2 border border-[#EEDCC1] rounded-xl bg-gray-50/50 font-sans text-xs focus:ring-1 focus:ring-[#CFB53B]" 
                    />
                  </div>
                </div>

                {/* Phone & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Contact Phone</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 9848431244"
                      value={phone} 
                      onChange={e => setPhone(e.target.value)} 
                      className="w-full px-3 py-2 border border-[#EEDCC1] rounded-xl bg-gray-50/50 font-sans text-xs focus:ring-1 focus:ring-[#CFB53B]" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Contact Email</label>
                    <input 
                      type="email" 
                      placeholder="e.g. name@domain.org"
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      className="w-full px-3 py-2 border border-[#EEDCC1] rounded-xl bg-gray-50/50 font-sans text-xs focus:ring-1 focus:ring-[#CFB53B]" 
                    />
                  </div>
                </div>

                {/* Period Start & Period End */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Tenure Start Year *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. 2026" 
                      value={periodStart} 
                      onChange={e => setPeriodStart(e.target.value)} 
                      className="w-full px-3 py-2 border border-[#EEDCC1] rounded-xl bg-gray-50/50 font-sans text-xs focus:ring-1 focus:ring-[#CFB53B]" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Tenure End Year *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Present" 
                      value={periodEnd} 
                      onChange={e => setPeriodEnd(e.target.value)} 
                      className="w-full px-3 py-2 border border-[#EEDCC1] rounded-xl bg-gray-50/50 font-sans text-xs focus:ring-1 focus:ring-[#CFB53B]" 
                    />
                  </div>
                </div>

                {/* Photo URL */}
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Photo Image URL</label>
                  <input 
                    type="text" 
                    placeholder="https://images.unsplash.com/..." 
                    value={imageUrl} 
                    onChange={e => setImageUrl(e.target.value)} 
                    className="w-full px-3 py-2 border border-[#EEDCC1] rounded-xl bg-gray-50/50 font-sans text-xs focus:ring-1 focus:ring-[#CFB53B]" 
                  />
                </div>

                {/* Short Bio */}
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Short Biography</label>
                  <textarea 
                    rows={2} 
                    value={bio} 
                    onChange={e => setBio(e.target.value)} 
                    placeholder="Brief description of responsibilities..."
                    className="w-full px-3 py-2 border border-[#EEDCC1] rounded-xl bg-gray-50/50 font-sans text-xs focus:ring-1 focus:ring-[#CFB53B] resize-none" 
                  />
                </div>

                {/* Visibility Checkbox Toggle */}
                <div className="flex items-center gap-2 pt-1">
                  <input 
                    type="checkbox" 
                    id="isActiveToggle" 
                    checked={isActive} 
                    onChange={e => setIsActive(e.target.checked)} 
                    className="rounded border-[#EEDCC1] text-[#9B2226] focus:ring-[#CFB53B] w-4 h-4 cursor-pointer" 
                  />
                  <label htmlFor="isActiveToggle" className="font-bold text-gray-700 cursor-pointer select-none">
                    Toggle Member Visibility (Publish immediately on public website)
                  </label>
                </div>

                {/* Form Buttons */}
                <div className="flex gap-2 justify-end pt-4 font-sans text-xs">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => { setShowModal(false); resetForm(); }}
                    className="border-[#EEDCC1] text-[#3E2723] hover:bg-gray-100 rounded-xl px-4"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-[#9B2226] hover:bg-[#801b1e] text-white border-0 rounded-xl px-6 py-2 shadow-md"
                  >
                    Save Record
                  </Button>
                </div>

              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Global CSS transition animations */}
      <style>{`
        @keyframes revealUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #CFB53B/30;
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
}

export default Committee;
