import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Clock, MapPin, Calendar, Heart, Flame, Building2, Users, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import durgaIdolImage from '../../assets/ChatGPT Image Jun 29, 2026, 05_33_34 PM.png';
import heritageImage from '../../assets/WhatsApp Image 2026-06-29 at 18.05.38.jpeg';

export function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [publicStats, setPublicStats] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Fetch live MongoDB Atlas statistics
    fetch('/api/settings/public-stats')
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          setPublicStats(res.data);
        }
      })
      .catch(err => console.error('Failed to load public stats:', err));

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col bg-[#FDFBF7]">
      {/* Redesigned Premium Hero Section */}
      <section 
        className="relative min-h-[90vh] lg:min-h-[95vh] flex items-center justify-center overflow-hidden py-16 px-4 md:px-8 border-b-2 border-[#CFB53B]/20"
        style={{
          background: 'radial-gradient(circle at center, #23080c 0%, #0c0203 100%)',
        }}
      >
        {/* Subtle Background Temple Stone Texture & Mandala Grid */}
        <div className="absolute inset-0 opacity-15 mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #CFB53B 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-10 pointer-events-none" />

        {/* Volumetric Light Rays behind the Idol */}
        <div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_center_right,_rgba(207,181,59,0.06)_0%,_transparent_60%)] pointer-events-none"
          style={{ transform: `translateY(${scrollY * 0.05}px)` }}
        />

        {/* Floating Sacred Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-[#CFB53B]/40 blur-[0.5px] animate-[floatUpward_8s_infinite_linear]"
              style={{
                top: `${70 + Math.random() * 30}%`,
                left: `${5 + Math.random() * 90}%`,
                animationDuration: `${6 + Math.random() * 8}s`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Content Column */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
            
            {/* Heritage Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#CFB53B]/10 border border-[#CFB53B]/30 backdrop-blur-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#CFB53B] animate-pulse" />
              <span className="text-[10px] md:text-xs font-sans font-bold tracking-widest text-[#CFB53B] uppercase">
                Divine Heritage Since 1984
              </span>
            </motion.div>

            {/* Title Block */}
            <div className="space-y-3">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="text-4xl md:text-6xl font-bold tracking-wider text-white leading-tight font-serif drop-shadow-lg"
                style={{
                  background: 'linear-gradient(to bottom, #FFFFFF 30%, #FFF3CC 70%, #CFB53B 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                SRI DURGA MATA TEMPLE
              </motion.h1>

              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.0, duration: 1 }}
                className="text-2xl md:text-4xl font-bold text-[#F9A825] leading-tight"
                style={{
                  textShadow: '0 2px 10px rgba(0,0,0,0.8)',
                }}
              >
                శ్రీ శ్రీ శ్రీ దుర్గామాత నల్లపోచమ్మ దేవాలయం, బాపూనగర్.
              </motion.h2>
            </div>

            {/* Ornamental Sanskrit Separatist */}
            <div className="w-full flex items-center justify-center lg:justify-start gap-3 py-1">
              <div className="h-[1px] w-20 bg-gradient-to-r from-transparent to-[#CFB53B]/50" />
              <span className="text-[#CFB53B] text-[10px] tracking-widest">ॐ దేవీ ప్రసన్నే ॐ</span>
              <div className="h-[1px] w-20 bg-gradient-to-l from-transparent to-[#CFB53B]/50" />
            </div>

            {/* Subtitle & Description */}
            <div className="space-y-4 max-w-xl">
              <p className="text-xs md:text-sm font-sans font-bold text-[#CFB53B]/90 tracking-widest uppercase">
                Spiritual Heritage • Cultural Legacy • Transparent Management
              </p>
              <p className="text-sm md:text-base text-gray-300 font-serif leading-relaxed opacity-95">
                Welcome to the sacred abode of Maa Durga. Witness the divine mother emerging from the eternal light, preserving the values of devotion, integrity, and transparent management for over four decades.
              </p>
            </div>

            {/* Call to Actions */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.5, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <Link to="/donate">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-[#CFB53B] to-[#997f1f] hover:from-[#e2c748] hover:to-[#bd9d27] text-black border-0 font-sans font-bold px-8 py-5 text-sm rounded-full shadow-lg transition-transform hover:scale-105">
                  Donate Now
                </Button>
              </Link>
              <a href="#about-section">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-[#CFB53B] text-[#CFB53B] hover:bg-[#CFB53B]/10 font-sans font-bold px-8 py-5 text-sm rounded-full backdrop-blur-sm transition-transform hover:scale-105">
                  Explore Temple
                </Button>
              </a>
              <Link to="/events">
                <Button size="lg" className="w-full sm:w-auto bg-red-800/80 hover:bg-red-800 text-white font-sans font-bold px-8 py-5 text-sm rounded-full transition-transform hover:scale-105">
                  View Events
                </Button>
              </Link>
            </motion.div>

            {/* Real-Time Statistics Row (Swipeable on Mobile) */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.0, duration: 0.8 }}
              className="w-full pt-6"
            >
              <div className="flex md:grid md:grid-cols-4 overflow-x-auto snap-x snap-mandatory gap-4 pb-2 scrollbar-none">
                {[
                  { value: `${publicStats?.yearsOfHeritage || 42} Years`, label: 'Heritage Legacy' },
                  { value: `${publicStats?.registeredDevotees?.toLocaleString() || '25,000'}+`, label: 'Devotee Family' },
                  { value: `₹${((publicStats?.totalAssetsValuation || 150000000) / 10000000).toFixed(1)} Cr`, label: 'Assets Value' },
                  { value: `${publicStats?.activeCommitteeCount || 9} Active`, label: 'Committee Members' }
                ].map((stat, i) => (
                  <div 
                    key={i} 
                    className="snap-center shrink-0 w-36 md:w-auto p-4 rounded-2xl bg-black/40 border border-[#CFB53B]/20 backdrop-blur-sm flex flex-col items-center justify-center text-center shadow-md hover:border-[#CFB53B]/50 transition-colors"
                  >
                    <span className="text-[#CFB53B] font-bold text-base md:text-lg tracking-tight font-sans">{stat.value}</span>
                    <span className="text-[9px] uppercase tracking-wider text-gray-400 font-sans font-bold mt-1">{stat.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>

          {/* Right Column: Divine Showcase */}
          <div className="lg:col-span-6 flex items-center justify-center relative min-h-[350px] md:min-h-[500px]">
            
            {/* Glowing Golden Backlight behind head */}
            <div 
              className="absolute w-72 h-72 md:w-96 md:h-96 rounded-full bg-[#CFB53B]/10 blur-[80px] pointer-events-none"
              style={{ transform: `translateY(${scrollY * 0.08}px)` }}
            />

            {/* Soft Radial Aura */}
            <div className="absolute w-60 h-60 md:w-80 md:h-80 rounded-full bg-[#9B2226]/25 blur-[100px] pointer-events-none" />

            {/* Rotating Mandala Halo */}
            <div 
              className="absolute pointer-events-none opacity-20 w-[280px] h-[280px] md:w-[450px] md:h-[450px] border border-dashed border-[#CFB53B] rounded-full animate-spin"
              style={{ 
                animationDuration: '70s',
                transform: `rotate(${scrollY * 0.06}deg)` 
              }}
            />
            <div 
              className="absolute pointer-events-none opacity-10 w-[240px] h-[240px] md:w-[380px] md:h-[380px] border border-double border-[#CFB53B] rounded-full animate-spin"
              style={{ 
                animationDuration: '100s', 
                animationDirection: 'reverse',
                transform: `rotate(-${scrollY * 0.04}deg)`
              }}
            />

            {/* Main Centerpiece Image of Maa Durga */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 1.2, ease: "easeOut" }}
              className="relative z-10 w-full max-w-[280px] md:max-w-[420px] aspect-square flex items-center justify-center"
              style={{ transform: `translateY(${scrollY * 0.12}px)` }}
            >
              <img 
                src={durgaIdolImage} 
                alt="Sri Maa Durga Idol" 
                className="w-full h-full object-contain pointer-events-none filter drop-shadow-[0_15px_40px_rgba(0,0,0,0.85)]"
                style={{
                  maskImage: 'radial-gradient(circle at 50% 45%, black 50%, transparent 95%)',
                  WebkitMaskImage: 'radial-gradient(circle at 50% 45%, black 50%, transparent 95%)',
                }}
              />
            </motion.div>

            {/* Small Diyas animations */}
            <div className="absolute -bottom-6 left-12 flex items-center justify-center gap-1.5 opacity-60">
              <Flame className="w-5 h-5 text-[#F9A825] animate-pulse" />
              <div className="w-3.5 h-1.5 rounded-full bg-orange-600/40 blur-[1px] mt-2" />
            </div>
            <div className="absolute -bottom-6 right-12 flex items-center justify-center gap-1.5 opacity-60">
              <Flame className="w-5 h-5 text-[#F9A825] animate-pulse" />
              <div className="w-3.5 h-1.5 rounded-full bg-orange-600/40 blur-[1px] mt-2" />
            </div>

          </div>

        </div>

        {/* Traditional Lotus Arch Base Glow */}
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[50rem] h-[30rem] bg-gradient-to-t from-[#CFB53B]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Quick Info Cards */}
      <section className="relative z-20 -mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <Card className="bg-[#FFF]/95 backdrop-blur-xl border-[#EEDCC1] shadow-2xl border-t-4 border-t-[#C09B6A] hover:-translate-y-1 transition-transform duration-300">
            <CardContent className="p-8 flex items-start gap-5">
              <div className="p-4 bg-[#F7F1E5] rounded-2xl text-[#6B4E31] shadow-inner">
                <Clock className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold font-sans tracking-widest text-[#9B2226] mb-2 text-xs uppercase">Temple Timings</h3>
                <p className="text-sm text-gray-800 font-medium mb-1">Morning: 8:00 AM - 12:00 PM</p>
                <p className="text-sm text-gray-800 font-medium">Evening: 5:00 PM - 8:30 PM</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#FFF]/95 backdrop-blur-xl border-[#EEDCC1] shadow-2xl border-t-4 border-t-[#9B2226] hover:-translate-y-1 transition-transform duration-300">
            <CardContent className="p-8 flex items-start gap-5">
              <div className="p-4 bg-[#F7F1E5] rounded-2xl text-[#9B2226] shadow-inner">
                <MapPin className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold font-sans tracking-widest text-[#9B2226] mb-2 text-xs uppercase">Location Address</h3>
                <p className="text-sm text-gray-800 font-medium mb-1">Bapu Nagar, Hyderabad,</p>
                <p className="text-sm text-gray-800 font-medium">Telangana, India.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#FFF]/95 backdrop-blur-xl border-[#EEDCC1] shadow-2xl border-t-4 border-t-[#C09B6A] hover:-translate-y-1 transition-transform duration-300">
            <CardContent className="p-8 flex items-start gap-5">
              <div className="p-4 bg-[#F7F1E5] rounded-2xl text-[#C09B6A] shadow-inner">
                <Calendar className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold font-sans tracking-widest text-[#9B2226] mb-2 text-xs uppercase">Upcoming Festival</h3>
                <p className="text-sm font-bold text-[#3E2723] mb-1">Navratri Mahotsav</p>
                <p className="text-sm text-[#C09B6A] font-medium">Grand Celebrations & Aarti</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Real-time Devotee & Donation Counters */}
      <section className="py-12 bg-white mt-12 border-y border-[#EEDCC1]/50">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-12 text-center divide-x divide-[#EEDCC1]/50 font-sans text-xs">
          <div className="px-8 flex flex-col items-center">
            <Users className="w-5 h-5 text-[#9B2226] mb-1" />
            <p className="text-4xl font-bold text-[#9B2226] mb-2 tracking-tighter">
              {publicStats?.registeredDevotees ? publicStats.registeredDevotees.toLocaleString() : '25,000'}
            </p>
            <p className="text-xs font-sans font-bold uppercase tracking-widest text-gray-500">Registered Devotees</p>
          </div>
          <div className="px-8 flex flex-col items-center">
            <Heart className="w-5 h-5 text-[#9B2226] mb-1" />
            <p className="text-4xl font-bold text-[#9B2226] mb-2 tracking-tighter">
              ₹{publicStats?.totalDonations ? (publicStats.totalDonations / 1000).toFixed(1) + 'K' : '150K'}
            </p>
            <p className="text-xs font-sans font-bold uppercase tracking-widest text-gray-500">Total Devotion Funds</p>
          </div>
          <div className="px-8 flex flex-col items-center">
            <ShieldCheck className="w-5 h-5 text-[#9B2226] mb-1" />
            <p className="text-4xl font-bold text-[#9B2226] mb-2 tracking-tighter">100%</p>
            <p className="text-xs font-sans font-bold uppercase tracking-widest text-gray-500">Audited Ledger</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about-section" className="py-32 bg-[#F7F1E5] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-[#FFF]"
            >
              <img 
                src={heritageImage} 
                alt="Sri Durga Mata Temple Heritage" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
              <div className="absolute bottom-6 left-6 right-6 z-20 text-white font-serif">
                <span className="text-[10px] uppercase tracking-widest text-[#CFB53B] font-sans font-bold">Temple Sanctum</span>
                <h3 className="text-xl font-bold italic mt-1 leading-tight">Sri Nalla Pochamma Devasthanam</h3>
              </div>
            </motion.div>
            
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px w-16 bg-[#C09B6A]" />
                <span className="text-[#C09B6A] font-bold font-sans uppercase tracking-[0.3em] text-xs">Our Heritage</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold italic tracking-tight text-[#3E2723] mb-8 leading-tight">
                A Legacy of Devotion and Spirituality
              </h2>
              <p className="text-xl text-[#6B4E31] font-serif mb-8 leading-relaxed">
                Founded over four decades ago, Sri Durga Mata Temple stands as a beacon of faith and cultural preservation. Our temple is not just a place of worship, but a vibrant enterprise of community service, dedicated to spiritual growth and the celebration of Sanatana Dharma.
              </p>
              <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                From daily rituals performed with strict adherence to Vedic traditions, to grand festivals that bring thousands together, every aspect of the mandir is designed to elevate the soul and connect devotees with the divine mother. Our transparent management ensures every offering serves the community.
              </p>
              <div className="flex gap-4">
                <Link to="/history">
                  <Button variant="outline" size="lg" className="border-[#9B2226] text-[#9B2226] hover:bg-[#9B2226] hover:text-white rounded-full px-8">
                    Read Our Full History
                  </Button>
                </Link>
                <Link to="/committee">
                  <Button variant="ghost" size="lg" className="text-[#6B4E31] hover:bg-[#EEDCC1]/50 rounded-full px-8">
                    Meet the Committee
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services/Offerings */}
      <section className="py-32 bg-white border-t border-[#EEDCC1] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
           <div className="flex justify-center items-center gap-4 mb-4">
             <div className="h-px w-12 bg-[#C09B6A]" />
             <span className="text-[#C09B6A] font-bold font-sans uppercase tracking-[0.3em] text-xs">Seva & Offerings</span>
             <div className="h-px w-12 bg-[#C09B6A]" />
           </div>
           <h2 className="text-4xl md:text-5xl font-bold italic tracking-tight text-[#3E2723] mb-20">Temple Services</h2>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { title: 'Seva Contributions', desc: 'Sponsor daily rituals, abhishekams, and archana services at the mandir.', icon: Flame },
                { title: 'Annadanam', desc: 'Contribute to daily free meals for devotees and the underprivileged.', icon: Heart },
                { title: 'Asset Offerings', desc: 'Donate gold, silver ornaments, or processional vehicles securely.', icon: Building2 },
                { title: 'Events Seva', desc: 'Register to serve the community during Navratri and festivals.', icon: Users }
              ].map((service, i) => {
                const Icon = service.icon || Heart;
                return (
                <div key={i} className="p-10 rounded-3xl bg-[#FDFBF7] border border-[#EEDCC1] hover:shadow-2xl hover:border-[#C09B6A]/50 transition-all duration-300 group hover:-translate-y-2">
                  <div className="w-20 h-20 mx-auto bg-[#FFF] rounded-2xl flex items-center justify-center mb-8 shadow-md border border-[#EEDCC1] group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 group-hover:border-[#C09B6A]">
                    <Icon className="w-8 h-8 text-[#9B2226]" />
                  </div>
                  <h3 className="text-2xl font-bold italic text-[#3E2723] mb-4 tracking-tight">{service.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 font-sans">{service.desc}</p>
                </div>
              )})}
           </div>
           
           <div className="mt-20 text-center">
             <Link to="/donate">
               <Button size="lg" className="bg-[#9B2226] hover:bg-[#7a181b] text-white px-12 py-6 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105 group">
                 <Heart className="w-5 h-5 mr-3 group-hover:animate-pulse" />
                 Make a Secure Donation
               </Button>
             </Link>
           </div>
        </div>
      </section>

      {/* Styles for scrollbar hiding and float keyframes */}
      <style>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes floatUpward {
          0% {
            transform: translateY(0) scale(0.8);
            opacity: 0;
          }
          15% {
            opacity: 0.7;
          }
          85% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(-250px) scale(1.2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
export default Home;
