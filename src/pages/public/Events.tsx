import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Calendar, MapPin, Users, Flame, CheckCircle, Search } from 'lucide-react';

export function Events() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const [search, setSearch] = useState('');

  // RSVP Form state
  const [rsvpEvent, setRsvpEvent] = useState<any | null>(null);
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpEmail, setRsvpEmail] = useState('');
  const [rsvpPhone, setRsvpPhone] = useState('');
  const [rsvpGuests, setRsvpGuests] = useState('1');
  const [rsvpStatus, setRsvpStatus] = useState('Attending');
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);
  const [rsvpError, setRsvpError] = useState('');

  const fetchEvents = async () => {
    try {
      const res = await api.get('/api/events');
      if (res.success) {
        setEvents(res.data);
      }
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRsvpError('');
    setRsvpLoading(true);

    try {
      const res = await api.post(`/api/events/${rsvpEvent._id}/register`, {
        name: rsvpName,
        email: rsvpEmail,
        phone: rsvpPhone,
        guestsCount: Number(rsvpGuests),
        status: rsvpStatus,
      });

      if (res.success) {
        setRsvpSuccess(true);
        setTimeout(() => {
          setRsvpEvent(null);
          setRsvpSuccess(false);
          resetRsvpForm();
        }, 3000);
      }
    } catch (err: any) {
      setRsvpError(err.message || 'RSVP registration failed.');
    } finally {
      setRsvpLoading(false);
    }
  };

  const resetRsvpForm = () => {
    setRsvpName('');
    setRsvpEmail('');
    setRsvpPhone('');
    setRsvpGuests('1');
    setRsvpStatus('Attending');
  };

  const now = new Date();
  
  const upcomingEvents = events.filter(e => new Date(e.endDate) >= now);
  const pastEvents = events.filter(e => new Date(e.endDate) < now);

  const displayList = tab === 'upcoming' ? upcomingEvents : pastEvents;
  const filteredEvents = displayList.filter(e => 
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.description.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#FDFBF7]">
        <div className="w-12 h-12 animate-spin rounded-full border-4 border-[#9B2226] border-t-transparent mb-4"></div>
        <p className="text-[#3E2723] text-xs uppercase tracking-widest font-sans font-bold">Retrieving Sacred Announcements...</p>
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
          <span className="text-[#CFB53B] font-sans font-bold text-xs uppercase tracking-[0.25em]">Temple Gathering</span>
          <h1 className="text-4xl md:text-5xl font-bold italic text-white leading-tight">Events & Celebrations</h1>
          <div className="h-0.5 w-24 bg-[#CFB53B] mx-auto my-4" />
          <p className="text-sm font-sans text-orange-100 max-w-xl mx-auto leading-relaxed uppercase tracking-wider">
            Join us in worship, charitable acts, community feasts, and spiritual discourses.
          </p>
        </div>
      </section>

      {/* Tabs & Search */}
      <div className="bg-[#F5F2ED] border-b border-[#EEDCC1] py-6 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex gap-2 font-sans text-xs">
            <button
              onClick={() => setTab('upcoming')}
              className={`px-5 py-2.5 rounded-full border transition-colors cursor-pointer font-bold uppercase tracking-wider ${
                tab === 'upcoming' 
                  ? 'bg-[#9B2226] text-white border-[#9B2226]' 
                  : 'bg-white border-[#EEDCC1] text-gray-700 hover:bg-orange-50'
              }`}
            >
              Upcoming Events
            </button>
            <button
              onClick={() => setTab('past')}
              className={`px-5 py-2.5 rounded-full border transition-colors cursor-pointer font-bold uppercase tracking-wider ${
                tab === 'past' 
                  ? 'bg-[#9B2226] text-white border-[#9B2226]' 
                  : 'bg-white border-[#EEDCC1] text-gray-700 hover:bg-orange-50'
              }`}
            >
              Past Events Archive
            </button>
          </div>
          
          <div className="relative max-w-xs w-full font-sans text-xs">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-[#EEDCC1] rounded-full focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Events List */}
      <section className="py-20 px-4 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map(event => (
            <Card key={event._id} className="bg-white border-[#EEDCC1] shadow-sm rounded-3xl overflow-hidden hover:border-[#CFB53B] transition-colors flex flex-col justify-between">
              <div>
                <div className="h-48 bg-gray-100 relative">
                  <img 
                    src={event.imageUrl || 'https://images.unsplash.com/photo-1609137882255-a22a3d0f419c?auto=format&fit=crop&q=80&w=600'} 
                    alt={event.title} 
                    className="w-full h-full object-cover"
                  />
                  {event.isFestival && (
                    <span className="absolute top-4 right-4 bg-orange-600 text-white font-sans font-bold text-[9px] uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Flame className="w-3 h-3 animate-pulse" /> Festival
                    </span>
                  )}
                </div>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2 text-[10px] font-sans font-bold text-[#CFB53B]">
                    <Calendar className="w-3.5 h-3.5 text-[#9B2226]" />
                    <span>{new Date(event.startDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <h3 className="text-xl font-bold italic leading-tight">{event.title}</h3>
                  <p className="text-xs text-gray-500 font-sans leading-relaxed line-clamp-3">{event.description}</p>
                  
                  <div className="flex items-center gap-1.5 text-[10px] font-sans font-bold text-gray-500">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span>{event.location}</span>
                  </div>
                </CardContent>
              </div>

              <div className="p-6 pt-0 border-t border-gray-50 mt-6 flex justify-between items-center bg-gray-50/50">
                <span className="text-[10px] font-sans text-gray-400">
                  {event.schedule?.length || 0} Scheduled Activities
                </span>
                {tab === 'upcoming' && (
                  <Button 
                    onClick={() => { resetRsvpForm(); setRsvpEvent(event); }} 
                    size="sm" 
                    className="bg-[#9B2226] hover:bg-[#7a181b] text-white font-sans text-[10px] font-bold uppercase rounded-full px-4"
                  >
                    RSVP to Attend
                  </Button>
                )}
              </div>
            </Card>
          ))}

          {filteredEvents.length === 0 && (
            <div className="col-span-full text-center py-20 text-gray-400 font-sans">
              No events found matches your filters.
            </div>
          )}
        </div>
      </section>

      {/* RSVP Modal */}
      {rsvpEvent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans text-xs">
          <div className="bg-white rounded-3xl max-w-md w-full border border-[#EEDCC1] overflow-hidden shadow-2xl animate-[revealUp_0.3s_ease-out]">
            <div className="h-2 bg-[#9B2226]" />
            <div className="p-6 flex justify-between items-center border-b border-gray-100">
              <h3 className="text-base font-serif font-bold italic text-gray-800">Event RSVP Registration</h3>
              <button 
                onClick={() => setRsvpEvent(null)}
                className="text-gray-400 hover:text-gray-600 text-lg cursor-pointer border-0 bg-transparent"
              >
                ×
              </button>
            </div>

            {rsvpSuccess ? (
              <div className="p-8 text-center flex flex-col items-center">
                <CheckCircle className="w-16 h-16 text-green-600 mb-4 animate-bounce" />
                <h4 className="text-xl font-bold font-serif italic mb-2">RSVP Registered!</h4>
                <p className="text-gray-500 text-xs">
                  We look forward to welcoming you at the mandir. A notification log has been recorded.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="p-6 space-y-4">
                <div className="p-3 bg-[#FFF9F0] border border-[#EEDCC1] rounded-lg">
                  <span className="text-[9px] uppercase tracking-wider font-bold text-[#CFB53B] block">Registering for:</span>
                  <span className="font-serif font-bold italic text-sm text-[#9B2226] block">{rsvpEvent.title}</span>
                </div>

                {rsvpError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                    {rsvpError}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Full Name *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Devotee Name" 
                    value={rsvpName} 
                    onChange={e => setRsvpName(e.target.value)} 
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50/50" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Phone Number *</label>
                    <input 
                      type="tel" 
                      required 
                      placeholder="10 digit phone" 
                      value={rsvpPhone} 
                      onChange={e => setRsvpPhone(e.target.value)} 
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50/50" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Email Address *</label>
                    <input 
                      type="email" 
                      required 
                      placeholder="email@example.com" 
                      value={rsvpEmail} 
                      onChange={e => setRsvpEmail(e.target.value)} 
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50/50" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Number of Guests</label>
                    <select 
                      value={rsvpGuests} 
                      onChange={e => setRsvpGuests(e.target.value)} 
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50/50"
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                      <option>6</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Will you attend?</label>
                    <select 
                      value={rsvpStatus} 
                      onChange={e => setRsvpStatus(e.target.value)} 
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50/50"
                    >
                      <option value="Attending">Attending</option>
                      <option value="Maybe">Maybe</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setRsvpEvent(null)}
                    className="rounded-lg"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={rsvpLoading}
                    className="bg-[#9B2226] text-white hover:bg-[#7a181b] rounded-lg"
                  >
                    {rsvpLoading ? 'Registering...' : 'Submit RSVP'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
export default Events;
