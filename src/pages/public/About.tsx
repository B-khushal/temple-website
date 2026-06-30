import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { ShieldCheck, Heart, Sparkles, Building2, BookOpen } from 'lucide-react';

export function About() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/api/settings');
        if (res.success) {
          setSettings(res.data);
        }
      } catch (err) {
        console.error('Failed to load temple settings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#FDFBF7]">
        <div className="w-12 h-12 animate-spin rounded-full border-4 border-[#9B2226] border-t-transparent mb-4"></div>
        <p className="text-[#3E2723] text-xs uppercase tracking-widest font-sans font-bold">Loading Mandir Profile...</p>
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
          <span className="text-[#CFB53B] font-sans font-bold text-xs uppercase tracking-[0.25em]">Sri Devisthanam</span>
          <h1 className="text-4xl md:text-5xl font-bold italic text-white leading-tight">About The Temple</h1>
          <div className="h-0.5 w-24 bg-[#CFB53B] mx-auto my-4" />
          <p className="text-sm font-sans text-orange-100 max-w-xl mx-auto leading-relaxed uppercase tracking-wider">
            Discover the spiritual heritage, cultural significance, and community legacy of Sri Durga Mata Temple.
          </p>
        </div>
      </section>

      {/* Main Section */}
      <section className="py-20 px-4 max-w-6xl mx-auto w-full space-y-16">
        
        {/* Intro */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-lg md:text-xl text-[#6B4E31] leading-relaxed italic">
            "{settings?.aboutIntroduction || 'Sri Durga Mata Temple, Bapu Nagar is a sacred space dedicated to Maa Durga, fostering spiritual growth and cultural preservation.'}"
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
          <div className="p-8 rounded-3xl bg-[#FFF] border border-[#EEDCC1] shadow-sm relative overflow-hidden group hover:border-[#CFB53B]/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#F7F1E5] flex items-center justify-center text-[#9B2226] mb-6">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold italic mb-4">Our Sacred Mission</h3>
            <p className="text-gray-600 font-sans text-sm leading-relaxed">
              {settings?.aboutMission || 'To propagate the teachings of Sanatana Dharma, preserve our cultural heritage, and serve humanity through charitable endeavors like Annadanam and spiritual activities.'}
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#FFF] border border-[#EEDCC1] shadow-sm relative overflow-hidden group hover:border-[#CFB53B]/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#F7F1E5] flex items-center justify-center text-[#9B2226] mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold italic mb-4">Our Vision</h3>
            <p className="text-gray-600 font-sans text-sm leading-relaxed">
              {settings?.aboutVision || 'To build a vibrant spiritual community rooted in devotion, transparent governance, and absolute transparency in temple administration.'}
            </p>
          </div>
        </div>

        {/* Detail Sections */}
        <div className="space-y-12 pt-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start border-t border-[#EEDCC1]/40 pt-12">
            <div className="lg:col-span-1 flex items-center gap-3">
              <div className="p-3 bg-[#F7F1E5] rounded-xl text-[#9B2226]">
                <Heart className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold italic">Spiritual Significance</h4>
            </div>
            <div className="lg:col-span-2 text-gray-600 font-serif leading-relaxed text-base">
              {settings?.aboutSpiritualSignificance || 'Maa Durga at our temple is worshipped in her ancient Nalla Pochamma form, representing power, protection, and motherhood. The sanctum sanctorum radiates a powerful divine presence, drawing thousands of devotees daily.'}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start border-t border-[#EEDCC1]/40 pt-12">
            <div className="lg:col-span-1 flex items-center gap-3">
              <div className="p-3 bg-[#F7F1E5] rounded-xl text-[#9B2226]">
                <BookOpen className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold italic">Cultural Legacy</h4>
            </div>
            <div className="lg:col-span-2 text-gray-600 font-serif leading-relaxed text-base">
              {settings?.aboutCulturalImpact || 'The temple is a cultural hub, hosting community festivals, Vedic education seminars, and musical programs that celebrate local traditions and heritage.'}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start border-t border-[#EEDCC1]/40 pt-12">
            <div className="lg:col-span-1 flex items-center gap-3">
              <div className="p-3 bg-[#F7F1E5] rounded-xl text-[#9B2226]">
                <Building2 className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold italic">Architectural Dignity</h4>
            </div>
            <div className="lg:col-span-2 text-gray-600 font-serif leading-relaxed text-base">
              {settings?.aboutArchitecturalSignificance || 'The temple complex is designed with a blend of traditional South Indian temple architecture and modern facilities. The beautiful Shikhara and detailed carvings on the pillars tell the story of ancient scriptures.'}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start border-t border-[#EEDCC1]/40 pt-12">
            <div className="lg:col-span-1 flex items-center gap-3">
              <div className="p-3 bg-[#F7F1E5] rounded-xl text-[#9B2226]">
                <Heart className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold italic">Community Seva</h4>
            </div>
            <div className="lg:col-span-2 text-gray-600 font-serif leading-relaxed text-base">
              {settings?.aboutCommunityActivities || 'We are committed to social service, executing daily free meal programs (Annadanam), medical camps, educational scholarships, and disaster relief programs.'}
            </div>
          </div>

        </div>

      </section>
    </div>
  );
}
export default About;
