import React, { useEffect, useRef, useState } from 'react';
import lottie from 'lottie-web';
import desktopLottieData from '../../assets/Maa_Durga_eyes_shot_202606291655.json';
import mobileLottieData from '../../assets/ai-artwork-video_334dd38e-8c51-4c59-8881-cedcd60b6584.json';

interface DivineIntroProps {
  forcePlay?: boolean;
  onComplete?: () => void;
}

export function DivineIntro({ forcePlay = false, onComplete }: DivineIntroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<any>(null);

  const [visible, setVisible] = useState(true);
  const [stage, setStage] = useState<'black' | 'ambience' | 'auragrow' | 'opening' | 'typography' | 'flash' | 'hidden'>('black');
  const [canSkip, setCanSkip] = useState(false);
  const [duration, setDuration] = useState(12);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Dynamic breakpoint state
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  // Track window resizing for orientation and breakpoint changes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Play a metallic, highly resonant spiritual temple bell chime synthesized via Web Audio API
  const playBellChime = () => {
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) return;

      const audioCtx = new AudioCtxClass();
      
      // Combine multiple frequency oscillators to emulate brass temple bell harmonic resonance.
      const frequencies = [329.63, 440.0, 554.37, 659.25, 880.0];
      frequencies.map((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const decay = 4 - i * 0.5;

        osc.type = i === 1 || i === 3 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq / 2, audioCtx.currentTime + decay);

        gain.gain.setValueAtTime(0.08 / frequencies.length, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + decay);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + decay);
        return gain;
      });
    } catch (e) {
      console.log('Chime deferred until user gesture.');
    }
  };

  const handleComplete = () => {
    sessionStorage.setItem('durgaIntroPlayed', 'true');
    setStage('hidden');
    setVisible(false);
    if (onComplete) onComplete();
  };

  useEffect(() => {
    // Respect reduced motion query
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const loadIntroSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        const result = await res.json();
        if (result.success && result.data) {
          const settings = result.data;
          setDuration(settings.introDuration || 12);

          const urlParams = new URLSearchParams(window.location.search);
          const forceUrlIntro = urlParams.get('intro') === 'true';

          // Skip if disabled or already played
          if (settings.introEnabled === false && !forcePlay && !forceUrlIntro) {
            handleComplete();
            return;
          }

          const sessionPlayed = sessionStorage.getItem('durgaIntroPlayed');
          if (sessionPlayed && !forcePlay && !forceUrlIntro) {
            handleComplete();
            return;
          }
        }
      } catch (err) {
        console.error('Failed to load database settings for intro:', err);
      }
    };

    loadIntroSettings();
  }, [forcePlay]);

  useEffect(() => {
    if (!visible) return;

    // Load Lottie
    if (containerRef.current) {
      // Destroy previous instance to switch assets on resize/breakpoint changes cleanly
      if (animRef.current) {
        animRef.current.destroy();
      }

      animRef.current = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        animationData: isMobile ? mobileLottieData : desktopLottieData,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice', // Fullscreen background scaling (cover mode)
        },
      });

      // Stop at closed frame initially
      animRef.current.addEventListener('DOMLoaded', () => {
        if (animRef.current) {
          animRef.current.goToAndStop(0, true);
        }
      });
    }

    // Timeline Sequence triggers
    setStage('ambience');

    // 2s: Closed eyes, Divine Aura behind starts growing
    const tAura = setTimeout(() => {
      setStage('auragrow');
    }, 2000);

    // 5s: Eyes Open/Artwork animation starts + Chime triggers
    const tOpen = setTimeout(() => {
      setStage('opening');
      if (animRef.current) {
        animRef.current.play();
      }
      playBellChime();
    }, 5000);

    // 8s: Gold typography fades in
    const tTypo = setTimeout(() => {
      setStage('typography');
    }, 8000);

    // 10s: Golden flash / exit transition initiates
    const tFlash = setTimeout(() => {
      setStage('flash');
    }, 10000);

    // Complete sequence
    const tEnd = setTimeout(() => {
      handleComplete();
    }, (duration - 0.2) * 1000);

    // Skip button enabled after 3 seconds
    const tSkip = setTimeout(() => {
      setCanSkip(true);
    }, 3000);

    return () => {
      clearTimeout(tAura);
      clearTimeout(tOpen);
      clearTimeout(tTypo);
      clearTimeout(tFlash);
      clearTimeout(tEnd);
      clearTimeout(tSkip);
      if (animRef.current) {
        animRef.current.destroy();
      }
    };
  }, [visible, isMobile, duration]);

  if (!visible) return null;

  return (
    <div 
      className={`fixed inset-0 w-screen overflow-hidden flex flex-col items-center justify-center select-none z-[999999] transition-all duration-1000 ease-in-out ${
        stage === 'flash' ? 'opacity-0 scale-95 blur-md pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        height: '100dvh', // Modern dynamic viewport height support
        background: 'radial-gradient(circle at center, #160708 0%, #050202 100%)',
      }}
    >
      {/* 1. Fullscreen Lottie Background Canvas (Cover Mode) */}
      <div 
        ref={containerRef}
        className={`absolute inset-0 w-full h-full pointer-events-none transition-all duration-[3000ms] ease-out ${
          stage === 'black' ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        } ${
          stage === 'opening' ? 'animate-[rumble_0.6s_ease-in-out_infinite]' : ''
        }`}
        style={{
          filter: 'drop-shadow(0 0 35px rgba(249,168,37,0.2))',
          transform: 'translateZ(0)', // GPU Hardware Acceleration trigger
          willChange: 'transform',
        }}
      />

      {/* 2. Volumetric Light Rays */}
      <div 
        className={`absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(249,168,37,0.08)_0%,_transparent_65%)] pointer-events-none transition-opacity duration-1500 mix-blend-screen ${
          stage !== 'black' ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* 3. Soft Radial Eye Aura */}
      <div 
        className={`absolute w-[40rem] h-[40rem] rounded-full bg-[#F9A825]/10 blur-[120px] pointer-events-none transition-all duration-[2500ms] ${
          stage === 'auragrow' || stage === 'opening' || stage === 'typography'
            ? 'opacity-100 scale-125' 
            : 'opacity-0 scale-90'
        }`}
      />

      {/* 4. Light bloom burst during opening */}
      <div 
        className={`absolute w-[30rem] h-[30rem] rounded-full bg-white/5 blur-[80px] pointer-events-none transition-all duration-1000 ${
          stage === 'opening' || stage === 'typography' ? 'opacity-100 scale-110' : 'opacity-0 scale-75'
        }`}
      />

      {/* 5. Rotating Mandalas (Slow and Subtle) */}
      <div 
        className={`absolute w-[700px] h-[700px] opacity-[0.025] border-4 border-dashed border-[#CFB53B] rounded-full pointer-events-none ${
          reducedMotion ? '' : 'animate-spin'
        }`}
        style={{ animationDuration: '70s' }}
      />
      <div 
        className={`absolute w-[500px] h-[500px] opacity-[0.015] border border-double border-[#CFB53B] rounded-full pointer-events-none ${
          reducedMotion ? '' : 'animate-spin'
        }`}
        style={{ animationDuration: '100s', animationDirection: 'reverse' }}
      />

      {/* 6. Incense Smoke */}
      {!reducedMotion && (
        <div className="absolute inset-0 pointer-events-none opacity-40 z-10">
          <div className="absolute left-[15%] bottom-0 w-48 h-[85vh] bg-gradient-to-t from-transparent via-white/5 to-transparent blur-3xl animate-[smokeRise_18s_infinite_ease-in-out]" />
          <div className="absolute right-[15%] bottom-0 w-48 h-[85vh] bg-gradient-to-t from-transparent via-white/5 to-transparent blur-3xl animate-[smokeRise_22s_infinite_ease-in-out_3s]" />
        </div>
      )}

      {/* 7. Golden Embers & Floating Dust */}
      {!reducedMotion && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-[#CFB53B]/60 blur-[0.2px] animate-[emberFloat_8s_infinite_linear]"
              style={{
                top: `${80 + Math.random() * 20}%`,
                left: `${5 + Math.random() * 90}%`,
                animationDuration: `${6 + Math.random() * 7}s`,
                animationDelay: `${Math.random() * 6}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* 8. Gold Sacred Typography Sequence */}
      <div className="relative z-20 mt-auto mb-16 flex flex-col items-center justify-center text-center px-4 min-h-[90px]">
        <h1 
          className={`text-2xl md:text-4xl font-bold tracking-[0.35em] uppercase transition-all duration-[2000ms] ease-out ${
            stage === 'typography' ? 'opacity-100 translate-y-0 text-glow' : 'opacity-0 translate-y-6'
          }`}
          style={{
            background: 'linear-gradient(to bottom, #FFF7D6 0%, #CFB53B 50%, #90761A 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 4px 12px rgba(0,0,0,0.8)',
          }}
        >
          Sri Durga Mata Temple
        </h1>
        
        <h2 
          className={`text-xl md:text-3xl font-bold text-[#F9A825] mt-4 transition-all duration-[2000ms] ease-out delay-700 ${
            stage === 'typography' ? 'opacity-90 translate-y-0 text-glow-telugu' : 'opacity-0 translate-y-6'
          }`}
          style={{
            textShadow: '0 2px 10px rgba(0,0,0,0.9)',
          }}
        >
          శ్రీ శ్రీ శ్రీ దుర్గామాత నల్లపోచమ్మ దేవాలయం
        </h2>
      </div>

      {/* Skip Button */}
      {canSkip && (
        <button
          onClick={handleComplete}
          className="absolute bottom-8 right-8 z-30 px-6 py-3 bg-black/60 hover:bg-black/90 text-white/70 hover:text-white rounded-full border border-white/10 backdrop-blur-sm text-[10px] tracking-widest uppercase font-sans font-bold cursor-pointer transition-all hover:scale-105"
        >
          Skip Intro
        </button>
      )}

      {/* CSS Keyframes */}
      <style>{`
        @keyframes emberFloat {
          0% {
            transform: translateY(0) translateX(0) scale(0.6);
            opacity: 0;
          }
          15% {
            opacity: 0.8;
          }
          85% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-600px) translateX(40px) scale(1.3);
            opacity: 0;
          }
        }
        @keyframes smokeRise {
          0% {
            transform: translateY(100px) translateX(0);
            opacity: 0;
          }
          50% {
            transform: translateY(-250px) translateX(20px);
            opacity: 0.12;
          }
          100% {
            transform: translateY(-600px) translateX(-20px);
            opacity: 0;
          }
        }
        @keyframes rumble {
          0%, 100% { transform: translate(0, 0) scale(1); }
          10% { transform: translate(-1px, 1px) scale(1.001); }
          30% { transform: translate(1px, -1px) scale(0.999); }
          50% { transform: translate(-1.5px, -1px) scale(1.002); }
          75% { transform: translate(1.5px, 1px) scale(0.998); }
          90% { transform: translate(-1px, 1.5px) scale(1.001); }
        }
        .text-glow {
          filter: drop-shadow(0 0 12px rgba(255, 247, 214, 0.45));
        }
        .text-glow-telugu {
          filter: drop-shadow(0 0 10px rgba(249, 168, 37, 0.55));
        }
      `}</style>
    </div>
  );
}
export default DivineIntro;
