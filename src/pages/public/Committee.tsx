import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { motion } from 'motion/react';
import { 
  Users, Mail, Phone, Calendar, Award, ShieldCheck, 
  UserCheck, Star, Sparkles, PhoneCall, Bookmark, Heart
} from 'lucide-react';

// Lotus SVG Motif
const LotusMotif = ({ className = "w-8 h-8 text-[#CFB53B]" }: { className?: string }) => (
  <svg className={`${className} fill-current`} viewBox="0 0 24 24">
    <path d="M12,2C11.5,3.5 10,6.5 7,7C8.5,8 9.5,9.5 9.8,11.3C8,10.5 5,10 3,11.5C5.5,12 7,14 7.5,16C5.5,15.5 3.5,16.5 2,18.5C4,18.5 6,17.5 7.5,19C5,20.5 4,22 4,22C5.5,21.5 7.5,19.5 9,21C8.5,22 8,23 8,23C10,22 11,19 12,17C13,19 14,22 16,23C16,23 15.5,22 15,21C16.5,19.5 18.5,21.5 20,22C20,22 19,20.5 16.5,19C18,17.5 20,18.5 22,18.5C20.5,16.5 18.5,15.5 16.5,16C17,14 18.5,12 21,11.5C19,10 16,10.5 14.2,11.3C14.5,9.5 15.5,8 17,7C14,6.5 12.5,3.5 12,2Z" />
  </svg>
);

// Detailed Mandala Corner Ornament (resembling luxury heritage stationery)
const MandalaCorner = ({ className = "" }: { className?: string }) => (
  <svg 
    className={`${className} fill-none stroke-[#D4AF37]`} 
    viewBox="0 0 120 120"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Radial spokes */}
    <line x1="0" y1="0" x2="120" y2="0" strokeWidth="0.75" />
    <line x1="0" y1="0" x2="0" y2="120" strokeWidth="0.75" />
    <line x1="0" y1="0" x2="110" y2="45" strokeWidth="0.5" strokeDasharray="2,2" />
    <line x1="0" y1="0" x2="85" y2="85" strokeWidth="0.75" />
    <line x1="0" y1="0" x2="45" y2="110" strokeWidth="0.5" strokeDasharray="2,2" />
    
    {/* Concentric rings */}
    <circle cx="0" cy="0" r="15" strokeWidth="0.75" />
    <circle cx="0" cy="0" r="25" strokeWidth="0.5" strokeDasharray="1,1" />
    <circle cx="0" cy="0" r="35" strokeWidth="1" />
    <circle cx="0" cy="0" r="45" strokeWidth="0.5" strokeDasharray="2,2" />
    <circle cx="0" cy="0" r="60" strokeWidth="1.25" />
    <circle cx="0" cy="0" r="75" strokeWidth="0.5" strokeDasharray="3,3" />
    <circle cx="0" cy="0" r="90" strokeWidth="1.5" />
    <circle cx="0" cy="0" r="105" strokeWidth="0.5" strokeDasharray="2,4" />
    
    {/* Detailed petal/lace design using path */}
    <path d="M 35,0 A 35,35 0 0,1 24.75,24.75 A 35,35 0 0,1 0,35" strokeWidth="0.75" />
    <path d="M 45,0 A 45,45 0 0,1 31.82,31.82 A 45,45 0 0,1 0,45" strokeWidth="0.5" />
    
    {/* Scalloped arches for the outer ring (90px) */}
    <path d="M 90,0 C 88,15 75,25 63.64,63.64 C 25,75 15,88 0,90" strokeWidth="1" />
    
    {/* Custom decorative dots on nodes */}
    <circle cx="24.75" cy="24.75" r="1.5" fill="#D4AF37" />
    <circle cx="63.64" cy="63.64" r="2" fill="#D4AF37" />
    <circle cx="85" cy="85" r="2.5" fill="#D4AF37" />
    
    {/* Additional floral/leaf curves */}
    <path d="M 15,0 C 18,5 12,12 5,12" strokeWidth="0.75" />
    <path d="M 30,0 C 35,10 25,25 10,25" strokeWidth="0.75" />
    <path d="M 55,0 C 62,15 45,45 15,45" strokeWidth="0.75" />
    <path d="M 75,0 C 85,20 60,60 20,60" strokeWidth="0.75" />
  </svg>
);

// Decorative repeating floral motif overlay (replaces standard dotted overlay)
const FloralPatternOverlay = () => (
  <div 
    className="absolute inset-0 pointer-events-none opacity-[0.035]" 
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='48' height='48' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M24,4 C25,12 28,15 36,16 C28,17 25,20 24,28 C23,20 20,17 12,16 C20,15 23,12 24,4 Z M0,24 C1,29 4,30 9,31 C4,32 1,33 0,38 C-1,33 -4,32 -9,31 C-4,30 -1,29 0,24 Z M48,24 C49,29 52,30 57,31 C52,32 49,33 48,38 C47,33 44,32 39,31 C44,30 47,29 48,24 Z' fill='%23D4AF37' fill-opacity='0.6' fill-rule='evenodd'/%3E%3C/svg%3E")`,
      backgroundSize: '48px 48px'
    }}
  />
);

// Soft luxury paper texture effect
const PaperTextureOverlay = () => (
  <div 
    className="absolute inset-0 pointer-events-none opacity-[0.03]"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
    }}
  />
);

// Decorative Header Divider
const DevotionalDivider = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center gap-3 my-6">
    <div className="h-[1.5px] w-12 sm:w-20 bg-gradient-to-r from-transparent via-[#CFB53B] to-[#CFB53B]/30" />
    <LotusMotif className="w-5 h-5 text-[#CFB53B]" />
    <span className="text-[#9B2226] text-xs font-sans font-bold uppercase tracking-widest px-2">{title}</span>
    <LotusMotif className="w-5 h-5 text-[#CFB53B]" />
    <div className="h-[1.5px] w-12 sm:w-20 bg-gradient-to-l from-transparent via-[#CFB53B] to-[#CFB53B]/30" />
  </div>
);

// Get Role Specific Icons
const getRoleIcon = (role: string) => {
  const normalized = role.toLowerCase();
  if (normalized.includes('chairman')) return <Star className="w-4 h-4 text-[#CFB53B]" />;
  if (normalized.includes('secretary')) return <ShieldCheck className="w-4 h-4 text-[#9B2226]" />;
  if (normalized.includes('treasurer')) return <Award className="w-4 h-4 text-[#CFB53B]" />;
  if (normalized.includes('vice')) return <UserCheck className="w-4 h-4 text-orange-600" />;
  if (normalized.includes('joint')) return <Users className="w-4 h-4 text-orange-500" />;
  if (normalized.includes('organising')) return <Sparkles className="w-4 h-4 text-amber-500" />;
  if (normalized.includes('advisor')) return <Heart className="w-4 h-4 text-[#C09B6A]" />;
  return <Bookmark className="w-4 h-4 text-gray-500" />;
};

// Render Categories Config
const CATEGORIES_TO_RENDER = [
  { key: 'CHAIRMAN', label: 'Chairman', isFeatured: true },
  { key: 'GENERAL_SECRETARY', label: 'General Secretary', isFeatured: true },
  { key: 'TREASURER', label: 'Treasurer', isFeatured: true },
  { key: 'VICE_CHAIRMAN', label: 'Vice Chairmen', isFeatured: false },
  { key: 'JOINT_SECRETARY', label: 'Joint Secretaries', isFeatured: false },
  { key: 'ORGANISING_SECRETARY', label: 'Organising Secretaries', isFeatured: false },
  { key: 'EXECUTIVE_MEMBER', label: 'Executive Members', isFeatured: false },
  { key: 'ADVISOR', label: 'Advisors', isFeatured: false }
];

export function Committee() {
  const [groupedMembers, setGroupedMembers] = useState<any>({});
  const [pastMembers, setPastMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const committeeRes = await api.get('/api/committee?grouped=true&is_active=true');
        
        if (committeeRes.success && committeeRes.grouped) {
          setGroupedMembers(committeeRes.grouped);
          setPastMembers(committeeRes.grouped.PAST_MEMBER || []);
        } else if (committeeRes.success && Array.isArray(committeeRes.data)) {
          // Fallback manual grouping if grouped=true is not supported or falls back to flat list
          const groupedData: any = {};
          const categories = ['CHAIRMAN', 'GENERAL_SECRETARY', 'TREASURER', 'VICE_CHAIRMAN', 'JOINT_SECRETARY', 'ORGANISING_SECRETARY', 'EXECUTIVE_MEMBER', 'ADVISOR', 'PAST_MEMBER'];
          categories.forEach(c => { groupedData[c] = []; });
          committeeRes.data.forEach((m: any) => {
            const cat = m.role_category || m.roleCategory || 'EXECUTIVE_MEMBER';
            if (!groupedData[cat]) groupedData[cat] = [];
            groupedData[cat].push(m);
          });
          setGroupedMembers(groupedData);
          setPastMembers(groupedData.PAST_MEMBER || []);
        }
      } catch (err) {
        console.error('Failed to load committee data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#FDFBF7]">
        <div className="w-12 h-12 animate-spin rounded-full border-4 border-[#9B2226] border-t-transparent mb-4"></div>
        <p className="text-[#3E2723] text-xs uppercase tracking-widest font-sans font-bold">Connecting with Committee Board...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-[#FDFBF7] font-serif text-[#3E2723] overflow-x-hidden">
      
      {/* Hero Header Section */}
      <section 
        className="relative py-24 text-center px-4 overflow-hidden border-b-2 border-[#CFB53B]/20"
        style={{
          background: 'linear-gradient(to bottom, #23080c 0%, #3e1217 100%)',
        }}
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(207,181,59,0.06)_0%,_transparent_70%)] pointer-events-none" />
        
        {/* Floating Sacred Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-[#CFB53B]/30 blur-[0.5px] animate-pulse"
              style={{
                top: `${20 + Math.random() * 60}%`,
                left: `${10 + Math.random() * 80}%`,
                animationDuration: `${3 + Math.random() * 5}s`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-3xl mx-auto space-y-4"
        >
          <span className="text-[#CFB53B] font-sans font-bold text-xs uppercase tracking-[0.25em]">Temple Administration</span>
          <h1 
            className="text-4xl md:text-5xl font-bold italic text-white leading-tight"
            style={{
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
            }}
          >
            Trust Committee
          </h1>
          <div className="h-0.5 w-24 bg-[#CFB53B] mx-auto my-4" />
          <p className="text-xs sm:text-sm font-sans text-orange-100 max-w-xl mx-auto leading-relaxed uppercase tracking-widest">
            Meet the committee members managing the growth, administration, and finances of the temple.
          </p>
        </motion.div>
      </section>

      {/* 2. Premium Present Committee Members Section */}
      <section 
        className="relative py-24 px-4 w-full overflow-hidden"
        style={{
          background: 'linear-gradient(to bottom, #FCF8F0 0%, #FFFDF8 50%, #FCF8F0 100%)',
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,140,0,0.03)_0%,_transparent_70%)] pointer-events-none" />
        <div className="absolute top-10 left-10 opacity-5 pointer-events-none select-none">
          <LotusMotif className="w-96 h-96 text-[#CFB53B]" />
        </div>
        <div className="absolute bottom-10 right-10 opacity-5 pointer-events-none select-none transform rotate-180">
          <LotusMotif className="w-96 h-96 text-[#CFB53B]" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          
          {/* Glowing Divine Heading */}
          <div className="text-center space-y-4 mb-16">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex justify-center items-center gap-3 mb-2"
            >
              <LotusMotif className="w-8 h-8 text-[#CFB53B] drop-shadow-[0_2px_5px_rgba(207,181,59,0.3)]" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#CFB53B]" />
              <LotusMotif className="w-8 h-8 text-[#CFB53B] drop-shadow-[0_2px_5px_rgba(207,181,59,0.3)] transform rotate-90" />
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-wide italic text-[#3E2723] inline-block relative py-1"
              style={{
                textShadow: '0 0 30px rgba(207, 181, 59, 0.25), 0 0 50px rgba(255, 140, 0, 0.1)'
              }}
            >
              Present Committee Members
            </motion.h2>

            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: '120px' }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="h-0.5 bg-gradient-to-r from-transparent via-[#CFB53B] to-transparent mx-auto"
            />
            <p className="text-xs uppercase tracking-widest text-[#9B2226] font-sans font-bold">
              Dedicated Servants of the Divine Temple Administration
            </p>
          </div>

          {/* Rendering the Hierarchy */}
          {CATEGORIES_TO_RENDER.map((catInfo) => {
            const membersList = groupedMembers[catInfo.key] || [];
            if (membersList.length === 0) return null;

            const isFeatured = catInfo.isFeatured;
            
            // Set dynamic responsive grid classes
            let gridClasses = "grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto";
            if (isFeatured) {
              if (membersList.length === 1) {
                gridClasses = "grid grid-cols-1 max-w-sm mx-auto gap-8";
              } else if (membersList.length === 2) {
                gridClasses = "grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto";
              } else {
                gridClasses = "grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto";
              }
            } else if (catInfo.key === 'VICE_CHAIRMAN' || catInfo.key === 'JOINT_SECRETARY') {
              gridClasses = "grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto";
            } else if (catInfo.key === 'ORGANISING_SECRETARY') {
              gridClasses = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5";
            } else if (catInfo.key === 'EXECUTIVE_MEMBER') {
              gridClasses = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5";
            } else if (catInfo.key === 'ADVISOR') {
              gridClasses = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto";
            }

            return (
              <div key={catInfo.key} className="mb-20 last:mb-0">
                <DevotionalDivider title={catInfo.label} />
                
                <div className={gridClasses}>
                  {membersList.map((member: any, memberIdx: number) => {
                    const hasPhone = !!member.phone;
                    const hasBio = !!member.bio;
                    const mPhoto = member.imageUrl || member.photoUrl || member.image || '';

                    if (isFeatured) {
                      return (
                        <motion.div
                          key={member._id}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: memberIdx * 0.15, duration: 0.6 }}
                          className="relative rounded-[24px] p-6 sm:p-8 flex flex-col justify-between h-full space-y-6 overflow-hidden transition-all duration-500 ease-out hover:-translate-y-2 hover:border-[#D4AF37]/85 hover:shadow-[0_30px_70px_rgba(183,145,49,0.22),_0_12px_32px_rgba(0,0,0,0.06),_inset_0_0_30px_rgba(212,175,55,0.05)] group"
                          style={{
                            border: '1.5px solid rgba(212,175,55,0.45)',
                            background: 'radial-gradient(circle at top center, rgba(212,175,55,0.12) 0%, transparent 65%), linear-gradient(135deg, #FFFDF8 0%, #F9F4EA 35%, #F4EEE2 70%, #FFFCF6 100%)',
                            boxShadow: '0 20px 60px rgba(183,145,49,0.12), 0 8px 24px rgba(0,0,0,0.04), inset 0 0 30px rgba(212,175,55,0.05)',
                          }}
                        >
                          {/* Soft Luxury Paper Texture */}
                          <PaperTextureOverlay />
                          
                          {/* Repeating Floral Motif Overlay */}
                          <FloralPatternOverlay />
                          
                          {/* Corner Mandala Artworks */}
                          <MandalaCorner className="absolute top-0 left-0 w-24 h-24 opacity-[0.06] pointer-events-none" />
                          <MandalaCorner className="absolute bottom-0 right-0 w-24 h-24 opacity-[0.06] pointer-events-none rotate-180 transform origin-bottom-right" />
                          
                          {/* Golden border outline overlay for subtle gold border highlight */}
                          <div className="absolute inset-0 border border-[#D4AF37]/15 rounded-[24px] pointer-events-none" />

                          <div className="space-y-4 text-center relative z-10">
                            {/* Devotional Ring & Avatar / Photo */}
                            <div className="relative w-28 h-28 mx-auto flex items-center justify-center rounded-full bg-white p-[3px] shadow-[0_0_20px_rgba(212,175,55,0.2)] border border-[#D4AF37]/35">
                              <div className="w-full h-full rounded-full bg-[#F4EEE2] p-[2.5px] border border-[#D4AF37]/50 flex items-center justify-center relative overflow-hidden">
                                {/* Golden Glow behind the image */}
                                <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,_rgba(212,175,55,0.35)_0%,_transparent_70%)] pointer-events-none mix-blend-multiply" />
                                {mPhoto ? (
                                  <img 
                                    src={mPhoto} 
                                    alt={member.name} 
                                    className="w-full h-full rounded-full object-cover shadow-[0_0_15px_rgba(212,175,55,0.25)] group-hover:scale-[1.03] transition-transform duration-500 relative z-10"
                                  />
                                ) : (
                                  <div className="w-full h-full rounded-full bg-gradient-to-b from-[#FFF5D1] to-[#D4AF37] flex items-center justify-center text-[#102A56] text-2xl font-bold shadow-[0_4px_12px_rgba(212,175,55,0.2)] font-sans relative z-10">
                                    {member.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                                  </div>
                                )}
                              </div>
                              {/* Glossy Gold circular badge for role icon */}
                              <div 
                                className="absolute -bottom-1 -right-1 border-2 border-white p-2 rounded-full shadow-[0_4px_12px_rgba(212,175,55,0.4)] group-hover:scale-110 transition-transform duration-300 flex items-center justify-center"
                                style={{
                                  background: 'linear-gradient(135deg, #FFF5D1 0%, #D4AF37 40%, #C9971A 100%)',
                                }}
                              >
                                {React.cloneElement(getRoleIcon(member.role || member.designation || ''), { className: "w-4 h-4 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]" })}
                              </div>
                            </div>

                            <div className="space-y-2">
                              {/* Role Badge */}
                              <span 
                                className="inline-block px-4 py-1 rounded-full text-[9px] font-sans font-bold uppercase tracking-wider text-white"
                                style={{
                                  background: 'linear-gradient(135deg, #D4AF37, #C89B2B)',
                                  boxShadow: '0 6px 20px rgba(212,175,55,0.25)',
                                }}
                              >
                                {member.role || member.designation}
                              </span>
                              
                              {/* Member Name */}
                              <h3 className="text-2xl font-bold italic tracking-wide text-[#102A56] font-serif transition-colors">
                                {member.name}
                              </h3>

                              {/* Tenure */}
                              <span className="text-[9px] uppercase font-sans font-bold text-[#D4AF37] block tracking-widest mt-1">
                                Tenure: 2025 - 2027
                              </span>
                            </div>

                            {/* Bio Text */}
                            {hasBio && (
                              <p className="text-xs text-[#555555] font-sans leading-relaxed px-2 font-medium">
                                {member.bio}
                              </p>
                            )}
                          </div>

                          <div className="space-y-4 relative z-10">
                            {/* Elegant Golden Divider with temple ornament in center */}
                            <div className="flex items-center justify-center gap-2.5 py-1">
                              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#D4AF37]/50" />
                              <LotusMotif className="w-4 h-4 text-[#D4AF37]/75" />
                              <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#D4AF37]/50" />
                            </div>

                            {/* Contact Section */}
                            <div className="space-y-3.5 text-xs font-sans">
                              {member.email && (
                                <div className="flex items-center gap-3 justify-center group/mail">
                                  <div className="w-7 h-7 rounded-full bg-[#102A56] flex items-center justify-center flex-shrink-0 shadow-[0_2px_8px_rgba(16,42,86,0.2)]">
                                    <Mail className="w-3.5 h-3.5 text-white" />
                                  </div>
                                  <a 
                                    href={`mailto:${member.email}`} 
                                    className="text-[#163A70] hover:text-[#102A56] font-sans font-semibold transition-colors truncate"
                                  >
                                    {member.email}
                                  </a>
                                </div>
                              )}
                              
                              {member.phone && (
                                <a 
                                  href={`tel:${member.phone}`} 
                                  className="flex items-center justify-center gap-2.5 py-3 px-6 rounded-full text-white font-sans font-bold tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                                  style={{
                                    background: 'linear-gradient(135deg, #D4AF37 0%, #C9971A 100%)',
                                    boxShadow: '0 10px 30px rgba(212,175,55,0.25)',
                                  }}
                                >
                                  <Phone className="w-4 h-4 text-white" />
                                  <span>+91 {member.phone}</span>
                                </a>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    }

                    // Standard cards for Vice Chairmen, joint secretaries, organising, executive, and advisors
                    return (
                      <motion.div
                        key={member._id}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: memberIdx * 0.05, duration: 0.5 }}
                        className="relative rounded-[20px] p-5 flex flex-col justify-between group overflow-hidden transition-all duration-500 ease-out hover:-translate-y-2 hover:border-[#D4AF37]/85 hover:shadow-[0_20px_50px_rgba(183,145,49,0.18),_0_8px_24px_rgba(0,0,0,0.04),_inset_0_0_20px_rgba(212,175,55,0.04)]"
                        style={{
                          border: '1.5px solid rgba(212,175,55,0.4)',
                          background: 'radial-gradient(circle at top center, rgba(212,175,55,0.1) 0%, transparent 65%), linear-gradient(135deg, #FFFDF8 0%, #F9F4EA 35%, #F4EEE2 70%, #FFFCF6 100%)',
                          boxShadow: '0 12px 35px rgba(183,145,49,0.08), 0 6px 18px rgba(0,0,0,0.02), inset 0 0 20px rgba(212,175,55,0.03)',
                        }}
                      >
                        {/* Soft Luxury Paper Texture */}
                        <PaperTextureOverlay />
                        
                        {/* Repeating Floral Motif Overlay */}
                        <FloralPatternOverlay />
                        
                        {/* Corner Mandala Artworks */}
                        <MandalaCorner className="absolute top-0 left-0 w-16 h-16 opacity-[0.05] pointer-events-none" />
                        <MandalaCorner className="absolute bottom-0 right-0 w-16 h-16 opacity-[0.05] pointer-events-none rotate-180 transform origin-bottom-right" />
                        
                        {/* Subtle gold border outline */}
                        <div className="absolute inset-0 border border-[#D4AF37]/10 rounded-[20px] pointer-events-none" />

                        <div className="space-y-3.5 relative z-10">
                          <div className="flex items-center gap-3">
                            {/* Devotional Ring & Avatar / Photo */}
                            <div className="relative w-14 h-14 flex-shrink-0 flex items-center justify-center rounded-full bg-white p-[2px] shadow-[0_0_12px_rgba(212,175,55,0.15)] border border-[#D4AF37]/35">
                              <div className="w-full h-full rounded-full bg-[#F4EEE2] p-[1.5px] border border-[#D4AF37]/50 flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,_rgba(212,175,55,0.35)_0%,_transparent_70%)] pointer-events-none mix-blend-multiply" />
                                {mPhoto ? (
                                  <img 
                                    src={mPhoto} 
                                    alt={member.name} 
                                    className="w-full h-full rounded-full object-cover shadow-[0_0_8px_rgba(212,175,55,0.2)] group-hover:scale-[1.03] transition-transform duration-500 relative z-10" 
                                  />
                                ) : (
                                  <div className="w-full h-full rounded-full bg-gradient-to-b from-[#FFF5D1] to-[#D4AF37] flex items-center justify-center text-[#102A56] text-sm font-bold shadow-[0_2px_8px_rgba(212,175,55,0.15)] font-sans relative z-10">
                                    {member.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                                  </div>
                                )}
                              </div>
                              {/* Glossy Gold circular badge for role icon */}
                              <div 
                                className="absolute -bottom-0.5 -right-0.5 border border-white p-1 rounded-full shadow-[0_2px_8px_rgba(212,175,55,0.3)] group-hover:scale-110 transition-transform duration-300 flex items-center justify-center"
                                style={{
                                  background: 'linear-gradient(135deg, #FFF5D1 0%, #D4AF37 40%, #C9971A 100%)',
                                }}
                              >
                                {React.cloneElement(getRoleIcon(member.role || member.designation || ''), { className: "w-3 h-3 text-white drop-shadow-[0_0.5px_1px_rgba(0,0,0,0.2)]" })}
                              </div>
                            </div>
                            
                            <div className="min-w-0">
                              <h4 className="font-bold text-base text-[#102A56] font-serif transition-colors truncate">{member.name}</h4>
                              <p className="text-[9px] text-[#163A70] font-sans font-bold uppercase tracking-wider">{member.role || member.designation}</p>
                              <span className="text-[8px] uppercase font-sans font-bold text-[#D4AF37] block tracking-wider mt-0.5">
                                Tenure: 2025 - 2027
                              </span>
                            </div>
                          </div>

                          {hasBio && (
                            <p className="text-[11px] text-[#555555] font-sans leading-relaxed">{member.bio}</p>
                          )}
                        </div>

                        <div className="mt-4 relative z-10">
                          {/* Elegant Divider with temple ornament in center */}
                          <div className="flex items-center justify-center gap-2.5 py-1">
                            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#D4AF37]/40" />
                            <LotusMotif className="w-3 h-3 text-[#D4AF37]/60" />
                            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#D4AF37]/40" />
                          </div>

                          {hasPhone && (
                            <a 
                              href={`tel:${member.phone}`} 
                              className="flex items-center justify-center gap-2 py-2 px-4 rounded-full text-white font-sans font-bold text-xs tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 mt-2"
                              style={{
                                background: 'linear-gradient(135deg, #D4AF37 0%, #C9971A 100%)',
                                boxShadow: '0 6px 18px rgba(212,175,55,0.2)',
                              }}
                            >
                              <Phone className="w-3.5 h-3.5 text-white" />
                              <span>+91 {member.phone}</span>
                            </a>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}

        </div>
      </section>

      {/* 3. Former Trustees & Members Archive */}
      <section className="py-20 px-4 max-w-6xl mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-12"
        >
          <div className="h-[1px] w-12 bg-[#C09B6A]" />
          <h2 className="text-2xl md:text-3xl font-bold italic text-[#3E2723]">Former Committee Members</h2>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 font-sans text-xs">
          {pastMembers.map((member, idx) => (
            <motion.div 
              key={member._id} 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.5 }}
              className="p-5 rounded-2xl bg-white border border-[#EEDCC1] flex justify-between items-center hover:bg-orange-50/10 hover:border-[#CFB53B]/30 transition-all duration-300"
            >
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-gray-800 font-serif">{member.name}</h4>
                <p className="text-[10px] text-[#9B2226] font-bold uppercase tracking-wider">{member.role || member.designation}</p>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-gray-400 font-sans uppercase tracking-wider block">Tenure</span>
                <span className="text-[10px] font-bold text-gray-600 font-mono block">{member.periodStart} - {member.periodEnd}</span>
              </div>
            </motion.div>
          ))}
          {pastMembers.length === 0 && (
            <p className="text-gray-400 italic">No former committee members archived.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default Committee;
