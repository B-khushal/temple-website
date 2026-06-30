import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Users, Mail, Phone, Calendar, Award } from 'lucide-react';

export function Committee() {
  const [founders, setFounders] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const foundersRes = await api.get('/api/founders');
        const membersRes = await api.get('/api/committee');
        if (foundersRes.success) setFounders(foundersRes.data);
        if (membersRes.success) setMembers(membersRes.data);
      } catch (err) {
        console.error('Failed to load committee data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const currentMembers = members.filter(m => m.category === 'Current Committee');
  const pastMembers = members.filter(m => m.category === 'Past Member');

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#FDFBF7]">
        <div className="w-12 h-12 animate-spin rounded-full border-4 border-[#9B2226] border-t-transparent mb-4"></div>
        <p className="text-[#3E2723] text-xs uppercase tracking-widest font-sans font-bold">Connecting with Committee Board...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-[#FDFBF7] font-serif text-[#3E2723]">
      {/* Hero Header */}
      <section 
        className="relative py-24 text-center px-4"
        style={{
          background: 'linear-gradient(to bottom, #23080c 0%, #3e1217 100%)',
        }}
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-10" />
        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <span className="text-[#CFB53B] font-sans font-bold text-xs uppercase tracking-[0.25em]">Temple Administration</span>
          <h1 className="text-4xl md:text-5xl font-bold italic text-white leading-tight">Trust Committee</h1>
          <div className="h-0.5 w-24 bg-[#CFB53B] mx-auto my-4" />
          <p className="text-sm font-sans text-orange-100 max-w-xl mx-auto leading-relaxed uppercase tracking-wider">
            Meet the founders who established the temple, and the committee members managing its growth and finances.
          </p>
        </div>
      </section>

      {/* 1. Founders Section */}
      <section className="py-20 px-4 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px w-12 bg-[#C09B6A]" />
          <h2 className="text-2xl md:text-3xl font-bold italic text-[#3E2723]">Founding Fathers</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {founders.map(founder => (
            <div key={founder._id} className="p-8 rounded-3xl bg-white border border-[#EEDCC1] shadow-sm flex flex-col sm:flex-row gap-6 hover:border-[#CFB53B]/50 transition-colors">
              <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 mx-auto">
                <img 
                  src={founder.imageUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200'} 
                  alt={founder.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-3">
                <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#9B2226] flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" /> {founder.role}
                </span>
                <h3 className="text-xl font-bold italic">{founder.name}</h3>
                <span className="text-[10px] uppercase font-sans font-bold text-[#C09B6A] block">Tenure: {founder.period}</span>
                <p className="text-xs text-gray-500 font-sans leading-relaxed">{founder.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Current Committee Section */}
      <section className="py-20 bg-[#F7F1E5] px-4 w-full">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-px w-12 bg-[#C09B6A]" />
            <h2 className="text-2xl md:text-3xl font-bold italic text-[#3E2723]">Current Committee</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {currentMembers.map(member => (
              <div key={member._id} className="p-6 rounded-3xl bg-white border border-[#EEDCC1] shadow-sm flex flex-col justify-between hover:border-[#CFB53B] transition-colors">
                <div className="space-y-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 mx-auto border border-[#EEDCC1]">
                    <img 
                      src={member.imageUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center space-y-1.5">
                    <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#9B2226]">{member.role}</span>
                    <h3 className="text-lg font-bold italic">{member.name}</h3>
                    <span className="text-[9px] uppercase tracking-wider text-gray-400 font-sans block">Since {member.periodStart}</span>
                  </div>
                  <p className="text-xs text-gray-500 font-sans text-center leading-relaxed px-2">{member.bio}</p>
                </div>

                <div className="border-t border-gray-100 pt-4 mt-6 space-y-2 text-[10px] font-sans text-gray-500">
                  {member.email && (
                    <div className="flex items-center gap-2 justify-center">
                      <Mail className="w-3.5 h-3.5 text-[#C09B6A]" />
                      <span>{member.email}</span>
                    </div>
                  )}
                  {member.phone && (
                    <div className="flex items-center gap-2 justify-center">
                      <Phone className="w-3.5 h-3.5 text-[#C09B6A]" />
                      <span>{member.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Former Trustees & Members Archive */}
      <section className="py-20 px-4 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px w-12 bg-[#C09B6A]" />
          <h2 className="text-2xl md:text-3xl font-bold italic text-[#3E2723]">Former Committee Members</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 font-sans text-xs">
          {pastMembers.map(member => (
            <div key={member._id} className="p-5 rounded-2xl bg-white border border-[#EEDCC1] flex justify-between items-center hover:bg-orange-50/10 transition-colors">
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-gray-800 font-serif">{member.name}</h4>
                <p className="text-[10px] text-[#9B2226] font-bold uppercase tracking-wider">{member.role}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-gray-400 font-mono block">Tenure</span>
                <span className="text-[10px] font-bold text-gray-600 block">{member.periodStart} - {member.periodEnd}</span>
              </div>
            </div>
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
