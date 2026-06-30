import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { api } from '../../lib/api';
import { Calendar, MapPin, Plus, Trash2, Edit2, Check, RefreshCw, Users, ShieldAlert } from 'lucide-react';

export function EventsAdmin() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected event for RSVP viewing
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [rsvps, setRsvps] = useState<any[]>([]);
  const [rsvpsLoading, setRsvpsLoading] = useState(false);

  // Form states
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isFestival, setIsFestival] = useState(false);
  const [location, setLocation] = useState('Temple Premises');
  const [imageUrl, setImageUrl] = useState('');
  const [scheduleText, setScheduleText] = useState(''); // comma separated hh:mm - Activity
  const [formError, setFormError] = useState('');

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/events');
      if (res.success) {
        setEvents(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRSVPs = async (eventId: string) => {
    setRsvpsLoading(true);
    try {
      const res = await api.get(`/api/events/${eventId}/registrations`);
      if (res.success) {
        setRsvps(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRsvpsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSelectEvent = (event: any) => {
    setSelectedEvent(event);
    fetchRSVPs(event._id);
  };

  const handleCheckIn = async (rsvpId: string, currentAttended: boolean) => {
    try {
      const res = await api.put(`/api/events/registrations/${rsvpId}`, {
        attended: !currentAttended,
        status: !currentAttended ? 'Checked In' : 'Attending',
      });
      if (res.success) {
        // refresh rsvp list
        if (selectedEvent) fetchRSVPs(selectedEvent._id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!window.confirm('Delete this event? This will also wipe all associated RSVPs.')) return;
    try {
      const res = await api.delete(`/api/events/${id}`);
      if (res.success) {
        if (selectedEvent?._id === id) setSelectedEvent(null);
        fetchEvents();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenEdit = (event: any) => {
    setEditingId(event._id);
    setTitle(event.title);
    setDescription(event.description);
    setStartDate(new Date(event.startDate).toISOString().slice(0, 16));
    setEndDate(new Date(event.endDate).toISOString().slice(0, 16));
    setIsFestival(event.isFestival);
    setLocation(event.location);
    setImageUrl(event.imageUrl || '');
    
    // parse schedule
    const scheds = event.schedule?.map((s: any) => `${s.time}-${s.activity}`).join(', ') || '';
    setScheduleText(scheds);
    setFormError('');
    setShowModal(true);
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setStartDate('');
    setEndDate('');
    setIsFestival(false);
    setLocation('Temple Premises');
    setImageUrl('');
    setScheduleText('');
    setFormError('');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // parse schedule text
    const scheduleArray = scheduleText.split(',')
      .map(item => item.trim())
      .filter(item => item.includes('-'))
      .map(item => {
        const parts = item.split('-');
        return {
          time: parts[0].trim(),
          activity: parts.slice(1).join('-').trim(),
        };
      });

    const body = {
      title,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      isFestival,
      location,
      imageUrl,
      schedule: scheduleArray,
    };

    try {
      let res;
      if (editingId) {
        res = await api.put(`/api/events/${editingId}`, body);
      } else {
        res = await api.post('/api/events', body);
      }

      if (res.success) {
        setShowModal(false);
        fetchEvents();
      }
    } catch (err: any) {
      setFormError(err.message || 'Operation failed');
    }
  };

  return (
    <div className="space-y-6 font-serif">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold italic tracking-tight text-[#3E2723]">Events Management</h2>
          <p className="text-xs uppercase tracking-widest text-gray-500 font-sans mt-1">
            Create temple events, set festival tags, and trace devotee RSVP registration logs.
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="flex items-center gap-2 font-sans text-xs">
          <Plus className="w-4 h-4" /> Add Event
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Events Grid list */}
        <div className="lg:col-span-7 space-y-4">
          {Array.isArray(events) && events.map(event => (
            <Card 
              key={event._id} 
              className={`hover:shadow-md cursor-pointer transition-all rounded-2xl overflow-hidden border ${
                selectedEvent?._id === event._id ? 'border-[#CFB53B] bg-orange-50/10' : 'border-[#EEDCC1]'
              }`}
              onClick={() => handleSelectEvent(event)}
            >
              <CardContent className="p-5 flex gap-4 items-center">
                <img 
                  src={event.imageUrl || 'https://images.unsplash.com/photo-1609137882255-a22a3d0f419c?auto=format&fit=crop&q=80&w=200'} 
                  alt={event.title} 
                  className="w-20 h-20 object-cover rounded-xl bg-gray-50 flex-shrink-0"
                />
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 font-sans font-semibold">
                      {new Date(event.startDate).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                      <button onClick={() => handleOpenEdit(event)} className="text-gray-500 hover:text-gray-700 bg-transparent border-0"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDeleteEvent(event._id)} className="text-red-500 hover:text-red-700 bg-transparent border-0"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                  <h4 className="font-bold text-base leading-tight italic">{event.title}</h4>
                  <p className="text-[11px] font-sans text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> {event.location}</p>
                </div>
              </CardContent>
            </Card>
          ))}

          {(!Array.isArray(events) || events.length === 0) && (
            <p className="text-gray-400 italic text-center py-12 font-sans text-xs">No events registered yet.</p>
          )}
        </div>

        {/* RSVP Log details */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#EEDCC1] p-6 shadow-sm min-h-[300px] flex flex-col">
          <h3 className="text-xs font-bold uppercase tracking-widest font-sans text-gray-500 mb-4 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-[#9B2226]" /> RSVP Devotees Log
          </h3>

          {!selectedEvent ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400 font-sans text-xs py-16">
              <ShieldAlert className="w-10 h-10 text-gray-300 mb-2" />
              <p>Select an event from the list to view attendee registrations and trigger check-in gates.</p>
            </div>
          ) : rsvpsLoading ? (
            <div className="flex-grow flex items-center justify-center py-16">
              <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-between font-sans text-[11px]">
              <div className="mb-4">
                <span className="text-[9px] uppercase tracking-wider text-[#C09B6A] font-bold">Selected Event:</span>
                <h4 className="font-serif font-bold italic text-sm text-[#9B2226] mt-0.5">{selectedEvent.title}</h4>
              </div>

              <div className="flex-1 overflow-y-auto max-h-[350px] space-y-2 pr-1">
                {Array.isArray(rsvps) && rsvps.map(rsvp => (
                  <div key={rsvp._id} className="p-3 border rounded-xl bg-gray-50/50 flex justify-between items-center hover:bg-orange-50/10 transition-colors">
                    <div>
                      <h5 className="font-bold text-gray-800 text-xs">{rsvp.name}</h5>
                      <p className="text-gray-500 font-mono text-[9px]">{rsvp.phone} | {rsvp.email}</p>
                      <span className="text-[9px] font-bold text-gray-400 mt-1 block">Guests: {rsvp.guestsCount} • Status: {rsvp.status}</span>
                    </div>

                    <button
                      onClick={() => handleCheckIn(rsvp._id, rsvp.attended)}
                      className={`p-2 rounded-full cursor-pointer transition-colors border ${
                        rsvp.attended 
                          ? 'bg-green-100 border-green-200 text-green-700' 
                          : 'bg-white border-gray-200 text-gray-400 hover:text-gray-600'
                      }`}
                      title={rsvp.attended ? "Undo Check In" : "Confirm Check In"}
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {(!Array.isArray(rsvps) || rsvps.length === 0) && (
                  <p className="text-gray-400 italic text-center py-8">No RSVPs registered for this event yet.</p>
                )}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Editor Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans text-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-[#EEDCC1] overflow-hidden shadow-2xl animate-[revealUp_0.3s_ease-out]">
            <div className="h-2 bg-[#9B2226]" />
            <div className="p-6 flex justify-between items-center border-b border-gray-100">
              <h3 className="text-base font-serif font-bold italic text-gray-800">{editingId ? 'Edit Event' : 'Create Event'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-lg cursor-pointer border-0 bg-transparent">×</button>
            </div>

            {formError && <div className="p-3 mx-6 mt-4 bg-red-50 text-red-700 rounded-lg">{formError}</div>}

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Event Title *</label>
                  <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-gray-50/50" />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Location *</label>
                  <input type="text" required value={location} onChange={e => setLocation(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-gray-50/50" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Start Date & Time *</label>
                  <input type="datetime-local" required value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-gray-50/50" />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">End Date & Time *</label>
                  <input type="datetime-local" required value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-gray-50/50" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">Banner Image URL</label>
                <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-gray-50/50" />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">Description *</label>
                <textarea rows={3} required value={description} onChange={e => setDescription(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-gray-50/50 resize-none" />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">Detailed Schedule Activities (Comma-separated Time-Activity)</label>
                <input type="text" placeholder="e.g. 06:00 AM - Aarti, 08:00 AM - Prasadam" value={scheduleText} onChange={e => setScheduleText(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-gray-50/50" />
                <span className="text-[9px] text-gray-400 block mt-1">Format: time - activity name, separated by commas.</span>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" id="admin-is-festival" checked={isFestival} onChange={e => setIsFestival(e.target.checked)} className="rounded text-orange-600 w-4 h-4 cursor-pointer" />
                <label htmlFor="admin-is-festival" className="text-gray-700 font-bold select-none cursor-pointer">Mark as Festival Event</label>
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit">Save Event</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
export default EventsAdmin;
