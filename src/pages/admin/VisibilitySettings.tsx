import React, { useEffect, useState } from 'react';
import * as Lucide from 'lucide-react';
import { api } from '../../lib/api';
import { useVisibility } from '../../lib/VisibilityContext';

export function VisibilitySettings() {
  const { settings: globalSettings, refreshSettings } = useVisibility();
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const categories = [
    'All',
    'Home Page Controls',
    'Temple Information',
    'Committee Management',
    'Donations',
    'Assets & Financial Transparency',
    'Media',
    'Events & Festivals',
    'Devotional Services',
    'Community',
    'Contact & Social',
    'Footer Controls'
  ];

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/settings/visibility');
      if (res.success && res.data) {
        setSettings(res.data);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch visibility settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleToggleChange = (key: string, enabled: boolean) => {
    setSettings(prev => prev.map(s => {
      if (s.key === key) {
        return { ...s, enabled, updatedAt: new Date().toISOString() };
      }
      return s;
    }));
  };

  const handleAdvancedChange = (key: string, field: string, value: any) => {
    setSettings(prev => prev.map(s => {
      if (s.key === key) {
        return { ...s, [field]: value, updatedAt: new Date().toISOString() };
      }
      return s;
    }));
  };

  const toggleExpand = (key: string) => {
    setExpandedKeys(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSaveAll = async () => {
    try {
      setSaving(true);
      const res = await api.put('/api/settings/visibility', { settings });
      if (res.success) {
        showToast('All website controls saved successfully!', 'success');
        refreshSettings();
        fetchSettings();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleApplyPreset = async (presetName: string) => {
    if (!window.confirm(`Are you sure you want to apply the '${presetName}' preset? This will overwrite the enabled state of multiple toggles.`)) {
      return;
    }
    
    try {
      setSaving(true);
      const res = await api.put('/api/settings/visibility', { presetName });
      if (res.success) {
        showToast(`Applied '${presetName}' preset successfully!`, 'success');
        refreshSettings();
        fetchSettings();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to apply preset', 'error');
    } finally {
      setSaving(false);
    }
  };

  const renderIcon = (iconName: string, className = "w-5 h-5") => {
    const IconComponent = (Lucide as any)[iconName];
    if (!IconComponent) return <Lucide.Eye className={className} />;
    return <IconComponent className={className} />;
  };

  const getStatusBadge = (s: any) => {
    if (!s.enabled) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-sans font-bold bg-red-50 text-red-700 border border-red-200 uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
          Inactive
        </span>
      );
    }

    if (s.scheduleEnabled && s.scheduleStartDate && s.scheduleEndDate) {
      const now = new Date();
      const start = new Date(s.scheduleStartDate);
      const end = new Date(s.scheduleEndDate);
      if (now < start || now > end) {
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-sans font-bold bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Scheduled (Offline)
          </span>
        );
      }
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-sans font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
          Scheduled (Active)
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-sans font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-widest">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
        Active
      </span>
    );
  };

  const filteredSettings = settings.filter(s => {
    const matchesSearch = s.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.key.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || s.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 font-serif bg-[#FDFBF7] p-1 text-[#3E2723]">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl border text-sm font-sans transition-all duration-300 transform translate-y-0 ${
          toast.type === 'success' 
            ? 'bg-emerald-50 text-emerald-950 border-emerald-200' 
            : 'bg-red-50 text-red-950 border-red-200'
        }`}>
          {toast.type === 'success' ? <Lucide.CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <Lucide.AlertCircle className="w-5 h-5 text-red-600" />}
          <span className="font-semibold">{toast.message}</span>
        </div>
      )}

      {/* Header Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EEDCC1]/40 pb-6">
        <div>
          <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#CFB53B]">System Operations</span>
          <h2 className="text-3xl md:text-4xl font-bold italic text-[#1D3557] mt-1">Website Controls</h2>
          <p className="text-gray-500 font-sans text-xs mt-1 max-w-2xl leading-relaxed">
            Manage section visibility, configure timed schedules, restrict user groups, or swap presets. Changes apply instantly without codebase redeployment.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={saving || loading}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#1D3557] to-[#14213d] hover:from-[#2a4d7c] hover:to-[#1e345f] text-white font-sans font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-200 shadow-md cursor-pointer border-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <Lucide.Loader2 className="w-4 h-4 animate-spin" />
              Saving controls...
            </>
          ) : (
            <>
              <Lucide.Save className="w-4 h-4" />
              Save Visibility Settings
            </>
          )}
        </button>
      </div>

      {/* Quick Presets Section */}
      <div className="bg-white p-6 rounded-3xl border border-[#EEDCC1]/60 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-[#EEDCC1]/30 pb-3">
          <Lucide.Sparkles className="w-5 h-5 text-[#CFB53B]" />
          <h3 className="text-lg font-bold italic text-[#1D3557]">Quick Presets</h3>
        </div>
        <p className="text-gray-500 font-sans text-xs">
          Applying a preset updates multiple feature states instantly across the entire platform. Select a mode below:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { name: 'Temple Basic Mode', icon: 'BookOpen', color: 'hover:border-amber-300' },
            { name: 'Temple Full Mode', icon: 'Maximize2', color: 'hover:border-emerald-300' },
            { name: 'Festival Mode', icon: 'Flame', color: 'hover:border-orange-300' },
            { name: 'Navaratri Mode', icon: 'Sparkles', color: 'hover:border-purple-300' },
            { name: 'Maintenance Mode', icon: 'Settings', color: 'hover:border-red-300' },
            { name: 'Donation Drive Mode', icon: 'Heart', color: 'hover:border-sky-300' }
          ].map(preset => (
            <button
              key={preset.name}
              disabled={saving}
              onClick={() => handleApplyPreset(preset.name)}
              className={`flex flex-col items-center justify-center p-3 bg-[#FDFBF7] border border-[#EEDCC1]/40 rounded-2xl transition-all duration-200 text-center gap-1 cursor-pointer group ${preset.color}`}
            >
              {renderIcon(preset.icon, "w-5 h-5 text-[#CFB53B] group-hover:scale-110 transition-transform")}
              <span className="font-sans font-bold text-[10px] tracking-wide text-gray-700 mt-1 uppercase leading-none">{preset.name.replace(' Mode', '')}</span>
              <span className="font-sans text-[8px] text-gray-400 uppercase tracking-widest font-semibold">Mode</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-[#EEDCC1]/40 shadow-xs">
        <div className="relative w-full md:w-80 flex-shrink-0">
          <Lucide.Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search toggles or sections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#EEDCC1]/50 rounded-xl font-sans text-xs focus:outline-none focus:ring-1 focus:ring-[#CFB53B] focus:border-[#CFB53B]"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 border-0 bg-transparent cursor-pointer">
              <Lucide.X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Categories Scroller */}
        <div className="w-full overflow-x-auto flex gap-2 no-scrollbar py-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-sans text-[10px] font-bold uppercase tracking-wider whitespace-nowrap cursor-pointer transition-colors ${
                activeCategory === cat 
                  ? 'bg-[#1D3557] text-white shadow-xs' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Toggle Switches Area */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center bg-white rounded-3xl border border-[#EEDCC1]/40 shadow-sm p-12">
          <Lucide.Loader2 className="w-10 h-10 animate-spin text-[#9B2226] mb-4" />
          <p className="text-gray-500 font-sans text-xs uppercase tracking-widest font-bold">Synchronizing controls ledger...</p>
        </div>
      ) : filteredSettings.length === 0 ? (
        <div className="min-h-[30vh] flex flex-col items-center justify-center bg-white rounded-3xl border border-[#EEDCC1]/40 shadow-sm p-12 text-center">
          <Lucide.Inbox className="w-12 h-12 text-gray-300 mb-4" />
          <h4 className="text-xl font-bold italic text-gray-400">No Controls Found</h4>
          <p className="text-gray-400 font-sans text-xs mt-1">Try clearing your filters or widening search parameters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSettings.map(s => {
            const isExpanded = expandedKeys[s.key] || false;
            
            return (
              <div
                key={s.key}
                className={`bg-white rounded-3xl border transition-all duration-200 ${
                  isExpanded 
                    ? 'border-[#CFB53B]/70 shadow-md ring-1 ring-[#CFB53B]/20' 
                    : 'border-[#EEDCC1]/60 shadow-xs hover:border-[#CFB53B]/40 hover:shadow-sm'
                } overflow-hidden`}
              >
                {/* Header Core Toggle Row */}
                <div className="p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#FDFBF7] border border-[#EEDCC1]/30 flex items-center justify-center text-[#CFB53B] flex-shrink-0">
                    {renderIcon(s.previewIcon, "w-5 h-5")}
                  </div>

                  <div className="flex-grow min-w-0">
                    <div className="flex items-center flex-wrap gap-2">
                      <h4 className="font-bold text-[#1D3557] truncate text-base leading-tight">{s.label}</h4>
                      {getStatusBadge(s)}
                    </div>
                    <p className="text-gray-500 font-sans text-xs mt-1 leading-snug">{s.description}</p>
                    <div className="flex items-center gap-4 mt-2 font-sans text-[9px] text-gray-400 uppercase tracking-widest font-semibold">
                      <span>Category: {s.category}</span>
                      <span>•</span>
                      <span>Updated: {s.updatedAt ? new Date(s.updatedAt).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3 flex-shrink-0">
                    {/* Toggle Switch */}
                    <button
                      onClick={() => handleToggleChange(s.key, !s.enabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 border-0 focus:outline-none cursor-pointer ${
                        s.enabled ? 'bg-emerald-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                          s.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>

                    {/* Expand Settings Trigger */}
                    <button
                      onClick={() => toggleExpand(s.key)}
                      className="flex items-center gap-1 font-sans text-[10px] font-bold text-[#CFB53B] hover:text-[#b3952a] uppercase border-0 bg-transparent cursor-pointer py-1"
                    >
                      {isExpanded ? (
                        <>
                          <Lucide.ChevronUp className="w-3.5 h-3.5" /> Close Rules
                        </>
                      ) : (
                        <>
                          <Lucide.ChevronDown className="w-3.5 h-3.5" /> Adv. Rules
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Collapsible Advanced Settings Panel */}
                {isExpanded && (
                  <div className="border-t border-[#EEDCC1]/40 bg-[#FDFBF7]/50 p-5 space-y-4 font-sans text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Left Column: Route access & group restrictions */}
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Visibility Mode</label>
                          <select
                            value={s.visibilityMode || 'hide_completely'}
                            onChange={(e) => handleAdvancedChange(s.key, 'visibilityMode', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-[#EEDCC1]/50 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#CFB53B]"
                          >
                            <option value="hide_completely">Hide Completely (Redirects / Blocks Route)</option>
                            <option value="disable_route_accessible">Disable but Keep Route Accessible (Display Notice)</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="flex items-center gap-2 cursor-pointer select-none py-1">
                            <input
                              type="checkbox"
                              checked={s.showOnlyLoggedIn || false}
                              onChange={(e) => handleAdvancedChange(s.key, 'showOnlyLoggedIn', e.target.checked)}
                              className="rounded border-[#EEDCC1] text-[#CFB53B] focus:ring-[#CFB53B] w-4 h-4 accent-[#CFB53B]"
                            />
                            <span className="font-semibold text-gray-700">Show only to Logged-in Users</span>
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer select-none py-1">
                            <input
                              type="checkbox"
                              checked={s.showOnlyHomepage || false}
                              onChange={(e) => handleAdvancedChange(s.key, 'showOnlyHomepage', e.target.checked)}
                              className="rounded border-[#EEDCC1] text-[#CFB53B] focus:ring-[#CFB53B] w-4 h-4 accent-[#CFB53B]"
                            />
                            <span className="font-semibold text-gray-700">Show only on Homepage</span>
                          </label>
                        </div>
                      </div>

                      {/* Right Column: Date Schedules & Festival locks */}
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 cursor-pointer select-none py-1">
                            <input
                              type="checkbox"
                              checked={s.scheduleEnabled || false}
                              onChange={(e) => handleAdvancedChange(s.key, 'scheduleEnabled', e.target.checked)}
                              className="rounded border-[#EEDCC1] text-[#CFB53B] focus:ring-[#CFB53B] w-4 h-4 accent-[#CFB53B]"
                            />
                            <span className="font-semibold text-gray-700">Schedule Visibility by Date</span>
                          </label>

                          {s.scheduleEnabled && (
                            <div className="grid grid-cols-2 gap-2 mt-1">
                              <div>
                                <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Start Date</label>
                                <input
                                  type="datetime-local"
                                  value={s.scheduleStartDate ? s.scheduleStartDate.substring(0, 16) : ''}
                                  onChange={(e) => handleAdvancedChange(s.key, 'scheduleStartDate', e.target.value)}
                                  className="w-full px-2 py-1.5 border border-[#EEDCC1]/50 rounded-lg text-[10px] focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">End Date</label>
                                <input
                                  type="datetime-local"
                                  value={s.scheduleEndDate ? s.scheduleEndDate.substring(0, 16) : ''}
                                  onChange={(e) => handleAdvancedChange(s.key, 'scheduleEndDate', e.target.value)}
                                  className="w-full px-2 py-1.5 border border-[#EEDCC1]/50 rounded-lg text-[10px] focus:outline-none"
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2 pt-1 border-t border-[#EEDCC1]/20">
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={s.festivalOnly || false}
                              onChange={(e) => handleAdvancedChange(s.key, 'festivalOnly', e.target.checked)}
                              className="rounded border-[#EEDCC1] text-[#CFB53B] focus:ring-[#CFB53B] w-4 h-4 accent-[#CFB53B]"
                            />
                            <span className="font-semibold text-gray-700">Enable during Festivals only</span>
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={s.navaratriOnly || false}
                              onChange={(e) => handleAdvancedChange(s.key, 'navaratriOnly', e.target.checked)}
                              className="rounded border-[#EEDCC1] text-[#CFB53B] focus:ring-[#CFB53B] w-4 h-4 accent-[#CFB53B]"
                            />
                            <span className="font-semibold text-gray-700">Enable during Navaratri only</span>
                          </label>
                        </div>

                      </div>

                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      
    </div>
  );
}
export default VisibilitySettings;
