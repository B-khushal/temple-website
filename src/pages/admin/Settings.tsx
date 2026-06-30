import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { api, useAuth } from '../../lib/api';
import { Settings as SettingsIcon, ShieldCheck, Database, History, RefreshCcw, Save, Sparkles } from 'lucide-react';
import { DivineIntro } from '../../components/ui/DivineIntro';

export function Settings() {
  const { user } = useAuth();
  
  // Settings Form States
  const [templeNameEnglish, setTempleNameEnglish] = useState('');
  const [templeNameTelugu, setTempleNameTelugu] = useState('');
  const [morningTimings, setMorningTimings] = useState('');
  const [eveningTimings, setEveningTimings] = useState('');
  const [locationAddress, setLocationAddress] = useState('');
  const [livestreamUrl, setLivestreamUrl] = useState('');
  const [announcementBanner, setAnnouncementBanner] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  
  // About Temple CMS content states
  const [aboutIntroduction, setAboutIntroduction] = useState('');
  const [aboutMission, setAboutMission] = useState('');
  const [aboutVision, setAboutVision] = useState('');
  const [aboutSpiritualSignificance, setAboutSpiritualSignificance] = useState('');
  const [aboutCulturalImpact, setAboutCulturalImpact] = useState('');
  const [aboutCommunityActivities, setAboutCommunityActivities] = useState('');
  const [aboutArchitecturalSignificance, setAboutArchitecturalSignificance] = useState('');
  
  // Intro Sequence settings states
  const [introEnabled, setIntroEnabled] = useState(true);
  const [introDuration, setIntroDuration] = useState(11);
  const [previewIntroActive, setPreviewIntroActive] = useState(false);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  // Backup & Audit States
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [backups, setBackups] = useState<string[]>([]);
  const [backupMsg, setBackupMsg] = useState('');

  const fetchSettings = async () => {
    try {
      const res = await api.get('/api/settings');
      if (res.success && res.data) {
        const d = res.data;
        setTempleNameEnglish(d.templeNameEnglish || '');
        setTempleNameTelugu(d.templeNameTelugu || '');
        setMorningTimings(d.morningTimings || '');
        setEveningTimings(d.eveningTimings || '');
        setLocationAddress(d.locationAddress || '');
        setLivestreamUrl(d.livestreamUrl || '');
        setAnnouncementBanner(d.announcementBanner || '');
        setContactEmail(d.contactEmail || '');
        setContactPhone(d.contactPhone || '');
        setIntroEnabled(d.introEnabled !== undefined ? d.introEnabled : true);
        setIntroDuration(d.introDuration || 11);
        
        setAboutIntroduction(d.aboutIntroduction || '');
        setAboutMission(d.aboutMission || '');
        setAboutVision(d.aboutVision || '');
        setAboutSpiritualSignificance(d.aboutSpiritualSignificance || '');
        setAboutCulturalImpact(d.aboutCulturalImpact || '');
        setAboutCommunityActivities(d.aboutCommunityActivities || '');
        setAboutArchitecturalSignificance(d.aboutArchitecturalSignificance || '');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchLogsAndBackups = async () => {
    if (user?.role !== 'Super Admin') return;
    try {
      const logsRes = await api.get('/api/settings/logs');
      if (logsRes.success) setAuditLogs(logsRes.data);

      const backupsRes = await api.get('/api/settings/backup/list');
      if (backupsRes.success) setBackups(backupsRes.backups);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchSettings();
    fetchLogsAndBackups();
  }, [user]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    setErr('');
    setLoading(true);

    try {
      const res = await api.put('/api/settings', {
        templeNameEnglish,
        templeNameTelugu,
        morningTimings,
        eveningTimings,
        locationAddress,
        livestreamUrl,
        announcementBanner,
        contactEmail,
        contactPhone,
        introEnabled,
        introDuration: Number(introDuration),
        aboutIntroduction,
        aboutMission,
        aboutVision,
        aboutSpiritualSignificance,
        aboutCulturalImpact,
        aboutCommunityActivities,
        aboutArchitecturalSignificance
      });

      if (res.success) {
        setMsg('Temple settings updated successfully.');
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (error: any) {
      setErr(error.message || 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const handleExportBackup = async () => {
    setBackupMsg('Exporting database collections...');
    try {
      const res = await api.post('/api/settings/backup/export');
      if (res.success) {
        setBackupMsg(`Backup created successfully: ${res.backupFolder}`);
        fetchLogsAndBackups();
      }
    } catch (e: any) {
      setBackupMsg(`Backup failed: ${e.message}`);
    }
  };

  const handleRestoreBackup = async (folderName: string) => {
    if (!window.confirm(`Warning: Restoring backup "${folderName}" will overwrite current data. Proceed?`)) return;
    setBackupMsg(`Restoring database from ${folderName}...`);
    try {
      const res = await api.post('/api/settings/backup/restore', { backupFolderName: folderName });
      if (res.success) {
        setBackupMsg('Database restored successfully! Refreshing page...');
        setTimeout(() => window.location.reload(), 2000);
      }
    } catch (e: any) {
      setBackupMsg(`Restore failed: ${e.message}`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Intro Preview Overlay */}
      {previewIntroActive && (
        <DivineIntro
          forcePlay={true}
          onComplete={() => setPreviewIntroActive(false)}
        />
      )}

      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold italic tracking-tight text-[#3E2723]">Admin Settings</h2>
          <p className="text-xs uppercase tracking-widest text-gray-500 font-sans mt-1">Configure temple details, manage backups, and review audit trails.</p>
        </div>
        <Button 
          type="button" 
          onClick={() => setPreviewIntroActive(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white border-0 font-sans text-xs"
        >
          <Sparkles className="w-4 h-4" /> Preview Divine Intro
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Settings Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-xs font-bold uppercase tracking-widest font-sans text-gray-500 flex items-center gap-2">
                <SettingsIcon className="w-4 h-4 text-[#9B2226]" /> Temple Identity & Details
              </h3>
            </CardHeader>
            <CardContent>
              {msg && <div className="mb-4 p-3 bg-green-50 text-green-700 text-xs font-sans rounded border border-green-200">{msg}</div>}
              {err && <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs font-sans rounded border border-red-200">{err}</div>}
              
              <form onSubmit={handleSaveSettings} className="space-y-4 font-sans text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Temple Name (English) *</label>
                    <input type="text" required value={templeNameEnglish} onChange={e => setTempleNameEnglish(e.target.value)} className="w-full px-3 py-2 border rounded bg-gray-50/50" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Temple Name (Telugu) *</label>
                    <input type="text" required value={templeNameTelugu} onChange={e => setTempleNameTelugu(e.target.value)} className="w-full px-3 py-2 border rounded bg-gray-50/50" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Temple Morning Timings</label>
                    <input type="text" value={morningTimings} onChange={e => setMorningTimings(e.target.value)} className="w-full px-3 py-2 border rounded bg-gray-50/50" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Temple Evening Timings</label>
                    <input type="text" value={eveningTimings} onChange={e => setEveningTimings(e.target.value)} className="w-full px-3 py-2 border rounded bg-gray-50/50" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Physical Location Address</label>
                  <input type="text" value={locationAddress} onChange={e => setLocationAddress(e.target.value)} className="w-full px-3 py-2 border rounded bg-gray-50/50" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Contact Email</label>
                    <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} className="w-full px-3 py-2 border rounded bg-gray-50/50" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Contact Phone</label>
                    <input type="text" value={contactPhone} onChange={e => setContactPhone(e.target.value)} className="w-full px-3 py-2 border rounded bg-gray-50/50" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Announcement Banner Notification text</label>
                  <textarea rows={2} placeholder="Sewa bookings open for Navratri..." value={announcementBanner} onChange={e => setAnnouncementBanner(e.target.value)} className="w-full px-3 py-2 border rounded bg-gray-50/50 resize-none" />
                </div>

                {/* CMS About Temple Page Sections */}
                <div className="border-t pt-4 space-y-4">
                  <h4 className="font-bold text-[#9B2226] uppercase tracking-wider text-[10px] font-sans">CMS About Temple Content</h4>
                  
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Temple Introduction *</label>
                    <textarea rows={2} required value={aboutIntroduction} onChange={e => setAboutIntroduction(e.target.value)} className="w-full px-3 py-2 border rounded bg-gray-50/50 resize-none" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-gray-700">Temple Mission *</label>
                      <textarea rows={2} required value={aboutMission} onChange={e => setAboutMission(e.target.value)} className="w-full px-3 py-2 border rounded bg-gray-50/50 resize-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-gray-700">Temple Vision *</label>
                      <textarea rows={2} required value={aboutVision} onChange={e => setAboutVision(e.target.value)} className="w-full px-3 py-2 border rounded bg-gray-50/50 resize-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-gray-700">Spiritual Significance *</label>
                      <textarea rows={3} required value={aboutSpiritualSignificance} onChange={e => setAboutSpiritualSignificance(e.target.value)} className="w-full px-3 py-2 border rounded bg-gray-50/50 resize-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-gray-700">Cultural Impact *</label>
                      <textarea rows={3} required value={aboutCulturalImpact} onChange={e => setAboutCulturalImpact(e.target.value)} className="w-full px-3 py-2 border rounded bg-gray-50/50 resize-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-gray-700">Community Activities *</label>
                      <textarea rows={3} required value={aboutCommunityActivities} onChange={e => setAboutCommunityActivities(e.target.value)} className="w-full px-3 py-2 border rounded bg-gray-50/50 resize-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-gray-700">Architectural Significance *</label>
                      <textarea rows={3} required value={aboutArchitecturalSignificance} onChange={e => setAboutArchitecturalSignificance(e.target.value)} className="w-full px-3 py-2 border rounded bg-gray-50/50 resize-none" />
                    </div>
                  </div>
                </div>

                {/* Cinematic Opening Sequence Settings */}
                <div className="border-t pt-4 space-y-4">
                  <h4 className="font-bold text-[#9B2226] uppercase tracking-wider text-[10px] font-sans">Cinematic Opening Sequence Config</h4>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id="setting-intro-enabled"
                        checked={introEnabled} 
                        onChange={e => setIntroEnabled(e.target.checked)}
                        className="rounded text-orange-600 focus:ring-orange-500 w-4 h-4 cursor-pointer"
                      />
                      <label htmlFor="setting-intro-enabled" className="cursor-pointer font-semibold text-gray-700">
                        Enable Cinematic Intro Sequence
                      </label>
                    </div>

                    {introEnabled && (
                      <div className="flex items-center gap-2 font-sans">
                        <label className="font-bold text-gray-700">Duration (seconds):</label>
                        <input 
                          type="number" 
                          min="5" 
                          max="20"
                          value={introDuration} 
                          onChange={e => setIntroDuration(Number(e.target.value))} 
                          className="w-16 px-2 py-1 border rounded bg-gray-50/50 text-center font-bold text-xs" 
                        />
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-400">
                    If enabled, visitors will witness the divine eyes of Maa Durga opening with soft temple chimes when visiting the platform. Skippable after 3 seconds. Uses session-level storage to play only once per browser session.
                  </p>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button type="submit" disabled={loading} className="flex items-center gap-2">
                    <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Update Settings'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Audit Trail for Super Admin */}
          {user?.role === 'Super Admin' && (
            <Card>
              <CardHeader>
                <h3 className="text-xs font-bold uppercase tracking-widest font-sans text-gray-500 flex items-center gap-2">
                  <History className="w-4 h-4 text-[#9B2226]" /> Security Audit Logs (Last 100 Entries)
                </h3>
              </CardHeader>
              <CardContent className="p-0 max-h-[300px] overflow-y-auto">
                <table className="w-full text-left text-[11px] font-sans whitespace-nowrap">
                  <thead className="bg-gray-50 text-gray-400 font-bold border-b">
                    <tr>
                      <th className="px-4 py-2">Timestamp</th>
                      <th className="px-4 py-2">User</th>
                      <th className="px-4 py-2">Action</th>
                      <th className="px-4 py-2">IP Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {Array.isArray(auditLogs) && auditLogs.map((log, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-gray-500">{new Date(log.timestamp).toLocaleString()}</td>
                        <td className="px-4 py-2 font-bold text-gray-800">{log.user?.name || 'System / Public'} ({log.user?.email || 'N/A'})</td>
                        <td className="px-4 py-2"><span className="px-2 py-0.5 rounded-full bg-orange-50 text-orange-800 border border-orange-100 font-bold font-mono">{log.action}</span></td>
                        <td className="px-4 py-2 text-gray-500 font-mono">{log.ip}</td>
                      </tr>
                    ))}
                    {(!Array.isArray(auditLogs) || auditLogs.length === 0) && (
                      <tr>
                        <td colSpan={4} className="px-4 py-4 text-center text-gray-500">No logs generated yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Database & Disaster Recovery */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-white border-[#EEDCC1] shadow-sm">
            <CardHeader>
              <h3 className="text-xs font-bold uppercase tracking-widest font-sans text-gray-500 flex items-center gap-2">
                <Database className="w-4 h-4 text-[#9B2226]" /> Backup & Recovery
              </h3>
            </CardHeader>
            <CardContent className="space-y-4 text-xs font-sans">
              <p className="text-gray-500 leading-relaxed">
                Export temple database collections to cloud-ready JSON files or restore previously exported snapshots.
              </p>

              {backupMsg && (
                <div className="p-3 bg-[#FFF9F0] border border-[#EEDCC1] text-orange-900 rounded font-bold font-mono text-[10px] break-words">
                  {backupMsg}
                </div>
              )}

              {user?.role === 'Super Admin' ? (
                <div className="space-y-4 pt-2">
                  <Button onClick={handleExportBackup} className="w-full flex items-center justify-center gap-2 py-5">
                    <Database className="w-4 h-4" /> Trigger Export Backup
                  </Button>

                  <div className="border-t pt-4">
                    <h4 className="font-bold text-gray-700 uppercase tracking-widest text-[9px] mb-3">Available Backup Sets:</h4>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                      {Array.isArray(backups) && backups.map(folder => (
                        <div key={folder} className="p-2 border rounded bg-gray-50/50 flex justify-between items-center text-[10px]">
                          <span className="font-mono text-gray-600">{folder.replace('backup-', '')}</span>
                          <button
                            onClick={() => handleRestoreBackup(folder)}
                            className="text-[#9B2226] hover:underline flex items-center gap-1 font-bold font-sans"
                            title="Restore database"
                          >
                            <RefreshCcw className="w-3 h-3" /> Restore
                          </button>
                        </div>
                      ))}
                      {(!Array.isArray(backups) || backups.length === 0) && (
                        <p className="text-gray-400 italic text-[10px]">No backup folders found.</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-red-50 text-red-700 rounded flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Only <strong>Super Admin</strong> can manage database backup files and restore recovery schedules.</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
export default Settings;
