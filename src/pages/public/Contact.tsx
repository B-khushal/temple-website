import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, Globe } from 'lucide-react';
import { api } from '../../lib/api';

export function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await api.post('/api/contact', { name, email, phone, subject, message });
      if (result.success) {
        setSuccess(true);
        resetForm();
      } else {
        setError(result.message || 'Submission failed');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setSubject('');
    setMessage('');
  };

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
          <span className="text-[#CFB53B] font-sans font-bold text-xs uppercase tracking-[0.25em]">Connect with Mandir</span>
          <h1 className="text-4xl md:text-5xl font-bold italic text-white leading-tight">Contact Us</h1>
          <div className="h-0.5 w-24 bg-[#CFB53B] mx-auto my-4" />
          <p className="text-sm font-sans text-orange-100 max-w-xl mx-auto leading-relaxed uppercase tracking-wider">
            Have questions regarding Pooja bookings, donations, or volunteer services? Reach out directly.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="py-20 px-4 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
        
        {/* Contact Info */}
        <div className="lg:col-span-5 space-y-8 flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold italic border-b border-[#EEDCC1] pb-4">Temple Office</h3>
            
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-[#F7F1E5] rounded-xl text-[#9B2226] flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-sans font-bold text-xs uppercase text-gray-500 mb-1">Location Address</h4>
                <p className="text-sm leading-relaxed">
                  Sri Durga Mata Temple, Bapu Nagar, Nalla Pochamma Devasthanam, Hyderabad, Telangana, India.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="p-3 bg-[#F7F1E5] rounded-xl text-[#9B2226] flex-shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-sans font-bold text-xs uppercase text-gray-500 mb-1">Office Hours</h4>
                <p className="text-sm">Daily: 8:00 AM - 12:00 PM & 5:00 PM - 8:30 PM</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="p-3 bg-[#F7F1E5] rounded-xl text-[#9B2226] flex-shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-sans font-bold text-xs uppercase text-gray-500 mb-1">Phone Enquiries</h4>
                <p className="text-sm font-sans font-bold">
                  <a href="tel:+919999999999" className="hover:text-[#9B2226] transition-colors">+91 99999 99999</a>, <a href="tel:+919848012345" className="hover:text-[#9B2226] transition-colors">+91 98480 12345</a>
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="p-3 bg-[#F7F1E5] rounded-xl text-[#9B2226] flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-sans font-bold text-xs uppercase text-gray-500 mb-1">Email Contacts</h4>
                <p className="text-sm font-sans font-bold">
                  <a href="mailto:info@sridurgamatatemple.org" className="hover:text-[#9B2226] transition-colors">info@sridurgamatatemple.org</a>
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="p-3 bg-[#F7F1E5] rounded-xl text-[#9B2226] flex-shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-sans font-bold text-xs uppercase text-gray-500 mb-1">Digital Presence</h4>
                <p className="text-sm font-sans">
                  <a href="https://www.sridurgamatatemple.org" target="_blank" rel="noreferrer" className="hover:text-[#9B2226] transition-colors">www.sridurgamatatemple.org</a>
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-[#EEDCC1] pt-6 text-xs text-gray-500 font-sans leading-relaxed">
            Note: All official transactions and donations are audited. We do not solicit donations via SMS or unlisted social media handles.
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <Card className="bg-white border-[#EEDCC1] shadow-xl rounded-3xl overflow-hidden h-full flex flex-col justify-between">
            <div className="h-2 bg-[#9B2226]" />
            <CardContent className="p-6 sm:p-8 flex-grow flex flex-col justify-between">
              
              {success ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
                  <CheckCircle className="w-16 h-16 text-green-600 mb-4 animate-bounce" />
                  <h4 className="text-2xl font-bold italic mb-2">Message Dispatched!</h4>
                  <p className="text-gray-500 text-sm max-w-xs font-sans">
                    Your inquiry has been logged securely in MongoDB. The temple administration has been notified and will reply shortly.
                  </p>
                  <Button 
                    onClick={() => setSuccess(false)} 
                    className="mt-8 font-sans text-xs bg-[#9B2226] hover:bg-[#7a181b] text-white rounded-full px-8 py-3"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold italic border-b border-gray-50 pb-2">Send an Enquiry</h3>
                  
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-sans rounded-lg">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-bold text-gray-700">Your Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="Name"
                          value={name}
                          onChange={e => setName(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 text-sm outline-none focus:border-[#9B2226] focus:ring-1 focus:ring-[#9B2226] transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-gray-700">Phone Number *</label>
                        <input
                          type="tel"
                          required
                          placeholder="Phone number"
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 text-sm outline-none focus:border-[#9B2226] focus:ring-1 focus:ring-[#9B2226] transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-bold text-gray-700">Email Address *</label>
                        <input
                          type="email"
                          required
                          placeholder="email@example.com"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 text-sm outline-none focus:border-[#9B2226] focus:ring-1 focus:ring-[#9B2226] transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-gray-700">Subject *</label>
                        <input
                          type="text"
                          required
                          placeholder="Inquiry subject"
                          value={subject}
                          onChange={e => setSubject(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 text-sm outline-none focus:border-[#9B2226] focus:ring-1 focus:ring-[#9B2226] transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-gray-700">Message *</label>
                      <textarea
                        rows={4}
                        required
                        placeholder="Type details of your message here..."
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 text-sm outline-none focus:border-[#9B2226] focus:ring-1 focus:ring-[#9B2226] transition-all resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 bg-[#9B2226] hover:bg-[#7a181b] text-white flex justify-center items-center gap-2 font-bold uppercase rounded-xl transition-all shadow-md"
                    >
                      <Send className="w-3.5 h-3.5" /> {loading ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
export default Contact;
