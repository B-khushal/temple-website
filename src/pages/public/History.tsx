import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Calendar, Award, Building, Sparkles } from 'lucide-react';

export function History() {
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const res = await api.get('/api/history');
        if (res.success) {
          setTimeline(res.data);
        }
      } catch (err) {
        console.error('Failed to load timeline:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTimeline();
  }, []);

  const getTimelineIcon = (type: string) => {
    switch (type) {
      case 'Foundation': return <Award className="w-5 h-5 text-amber-600" />;
      case 'Expansion': return <Building className="w-5 h-5 text-blue-600" />;
      case 'Renovation': return <Sparkles className="w-5 h-5 text-green-600" />;
      default: return <Calendar className="w-5 h-5 text-[#9B2226]" />;
    }
  };

  const filteredTimeline = filter === 'All' 
    ? timeline 
    : timeline.filter(item => item.type === filter);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#FDFBF7]">
        <div className="w-12 h-12 animate-spin rounded-full border-4 border-[#9B2226] border-t-transparent mb-4"></div>
        <p className="text-[#3E2723] text-xs uppercase tracking-widest font-sans font-bold">Unfolding Divine Chronicles...</p>
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
          <span className="text-[#CFB53B] font-sans font-bold text-xs uppercase tracking-[0.25em]">Temple Chronicles</span>
          <h1 className="text-4xl md:text-5xl font-bold italic text-white leading-tight">Historical Timeline</h1>
          <div className="h-0.5 w-24 bg-[#CFB53B] mx-auto my-4" />
          <p className="text-sm font-sans text-orange-100 max-w-xl mx-auto leading-relaxed uppercase tracking-wider">
            Explore the historical milestones, major renovations, and spiritual developments of our mandir.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2 py-8 bg-[#F5F2ED] border-b border-[#EEDCC1] px-4 font-sans text-xs">
        {['All', 'Foundation', 'Milestone', 'Expansion', 'Renovation', 'Event'].map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-full border transition-colors cursor-pointer ${
              filter === type 
                ? 'bg-[#9B2226] text-white border-[#9B2226] font-bold' 
                : 'bg-white border-[#EEDCC1] text-gray-700 hover:bg-orange-50'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Timeline Layout */}
      <section className="py-20 px-4 max-w-5xl mx-auto w-full relative">
        {/* Center line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-[#EEDCC1]" />

        <div className="space-y-16">
          {filteredTimeline.map((item, idx) => {
            const isLeft = idx % 2 === 0;
            return (
              <div key={item._id} className="relative flex flex-col md:flex-row items-stretch w-full">
                
                {/* Timeline dot */}
                <div className="absolute left-4 md:left-1/2 -translate-x-[9px] md:-translate-x-1/2 top-2 z-10 w-5 h-5 rounded-full bg-[#FFF9F0] border-2 border-[#9B2226] flex items-center justify-center shadow-md">
                  <div className="w-2 h-2 rounded-full bg-[#9B2226]" />
                </div>

                {/* Left card */}
                <div className={`w-full md:w-1/2 pl-12 md:pl-0 md:pr-12 flex flex-col ${isLeft ? 'md:items-end text-left md:text-right' : 'md:opacity-0 md:pointer-events-none md:absolute'}`}>
                  {isLeft && (
                    <div className="bg-white p-6 rounded-3xl border border-[#EEDCC1] shadow-sm space-y-4 hover:border-[#CFB53B]/50 transition-colors max-w-lg">
                      <div className="flex items-center justify-start md:justify-end gap-2 text-xs font-sans font-bold text-gray-500">
                        {getTimelineIcon(item.type)}
                        <span className="uppercase tracking-widest text-[#9B2226]">{item.type}</span>
                        <span className="text-[#CFB53B] font-mono text-base ml-2">{item.year}</span>
                      </div>
                      <h3 className="text-xl font-bold italic">{item.title}</h3>
                      {item.imageUrl && (
                        <img 
                          src={item.imageUrl} 
                          alt={item.title} 
                          className="w-full h-48 object-cover rounded-2xl shadow-inner mt-2" 
                        />
                      )}
                      <p className="text-gray-600 font-sans text-sm leading-relaxed">{item.description}</p>
                    </div>
                  )}
                </div>

                {/* Right card */}
                <div className={`w-full md:w-1/2 pl-12 md:pl-12 flex flex-col ${!isLeft ? 'items-start text-left' : 'md:opacity-0 md:pointer-events-none md:absolute'}`}>
                  {!isLeft && (
                    <div className="bg-white p-6 rounded-3xl border border-[#EEDCC1] shadow-sm space-y-4 hover:border-[#CFB53B]/50 transition-colors max-w-lg">
                      <div className="flex items-center gap-2 text-xs font-sans font-bold text-gray-500">
                        {getTimelineIcon(item.type)}
                        <span className="uppercase tracking-widest text-[#9B2226]">{item.type}</span>
                        <span className="text-[#CFB53B] font-mono text-base ml-2">{item.year}</span>
                      </div>
                      <h3 className="text-xl font-bold italic">{item.title}</h3>
                      {item.imageUrl && (
                        <img 
                          src={item.imageUrl} 
                          alt={item.title} 
                          className="w-full h-48 object-cover rounded-2xl shadow-inner mt-2" 
                        />
                      )}
                      <p className="text-gray-600 font-sans text-sm leading-relaxed">{item.description}</p>
                    </div>
                  )}
                </div>

              </div>
            );
          })}

          {filteredTimeline.length === 0 && (
            <div className="text-center py-16 text-gray-400 font-sans">
              No historical events found in this category.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
export default History;
