import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { motion } from 'framer-motion';

const THEMES = {
  gold: {
    primary: '#c9b37d',
    secondary: '#1B1F3B',
    bg: 'bg-white',
    text: 'text-[#1B1F3B]',
    border: 'border-[#c9b37d]',
    sealBg: 'rgba(201, 179, 125, 0.05)',
    line: 'bg-[#c9b37d]',
    accent: 'text-[#c9b37d]'
  },
  emerald: {
    primary: '#10b981',
    secondary: '#064e3b',
    bg: 'bg-white',
    text: 'text-[#064e3b]',
    border: 'border-[#10b981]',
    sealBg: 'rgba(16, 185, 129, 0.05)',
    line: 'bg-[#10b981]',
    accent: 'text-[#10b981]'
  },
  sapphire: {
    primary: '#3b82f6',
    secondary: '#1e3a8a',
    bg: 'bg-white',
    text: 'text-[#1e3a8a]',
    border: 'border-[#3b82f6]',
    sealBg: 'rgba(59, 130, 246, 0.05)',
    line: 'bg-[#3b82f6]',
    accent: 'text-[#3b82f6]'
  },
  ruby: {
    primary: '#ef4444',
    secondary: '#7f1d1d',
    bg: 'bg-white',
    text: 'text-[#7f1d1d]',
    border: 'border-[#ef4444]',
    sealBg: 'rgba(239, 68, 68, 0.05)',
    line: 'bg-[#ef4444]',
    accent: 'text-[#ef4444]'
  },
  midnight: {
    primary: '#94a3b8',
    secondary: '#f8fafc',
    bg: 'bg-[#0f172a]',
    text: 'text-white',
    border: 'border-[#94a3b8]',
    sealBg: 'rgba(148, 163, 184, 0.1)',
    line: 'bg-[#94a3b8]',
    accent: 'text-[#94a3b8]'
  }
};

const CertificatePreview = forwardRef(({ data, theme = 'gold' }, ref) => {
  const {
    name = "STUDENT NAME",
    college = "COLLEGE NAME",
    workshop = "WORKSHOP NAME",
    startDate = "2026-06-01",
    endDate = "2026-06-15",
    certificateId = "TFI-2026-000"
  } = data;

  const certificateRef = useRef(null);
  const verifyUrl = `${window.location.origin}/verify/${certificateId}`;
  const currentTheme = THEMES[theme] || THEMES.gold;
  const logoUrl = '/logo.png'; 

  useImperativeHandle(ref, () => ({
    getCertificateNode: () => certificateRef.current
  }));

  return (
    <div className="flex justify-center items-center overflow-auto p-4 bg-gray-900/10 min-h-[400px]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] origin-top scale-[0.3] xss:scale-[0.35] xs:scale-[0.4] sm:scale-[0.5] md:scale-[0.6] lg:scale-[0.75] xl:scale-[0.8] 2xl:scale-100 transition-transform duration-300"
      >
        <div 
          ref={certificateRef}
          className={`w-[1123px] h-[794px] ${currentTheme.bg} relative p-0 overflow-hidden font-sans ${currentTheme.text} border-[24px] ${theme === 'midnight' ? 'border-[#1e293b]' : 'border-white'}`}
          style={{ minWidth: '1123px', minHeight: '794px' }}
        >
          {/* Advanced Background Decoration */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
          
          {/* Corner Decorations */}
          <div className={`absolute top-0 left-0 w-32 h-32 border-t-8 border-l-8 ${currentTheme.border} opacity-20`}></div>
          <div className={`absolute top-0 right-0 w-32 h-32 border-t-8 border-r-8 ${currentTheme.border} opacity-20`}></div>
          <div className={`absolute bottom-0 left-0 w-32 h-32 border-b-8 border-l-8 ${currentTheme.border} opacity-20`}></div>
          <div className={`absolute bottom-0 right-0 w-32 h-32 border-b-8 border-r-8 ${currentTheme.border} opacity-20`}></div>

          {/* Borders */}
          <div className={`absolute inset-[16px] border-[3px] ${currentTheme.border} opacity-30 pointer-events-none z-10`}></div>
          <div className={`absolute inset-[32px] border ${theme === 'midnight' ? 'border-gray-700' : 'border-gray-200'} pointer-events-none z-10`}></div>
          
          <div className="w-full h-full relative p-[60px] box-border flex flex-col items-center justify-between text-center">
            
            {/* TOP SECTION */}
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center w-full"
            >
              <div className="flex flex-col items-center mb-6">
                <img src={logoUrl} alt="Logo" className={`h-[85px] mb-[12px] ${theme === 'midnight' ? 'brightness-200' : ''}`} crossOrigin="anonymous" />
                <p className="text-[11px] tracking-[0.5em] uppercase text-gray-400 font-sans italic font-bold">"we are here to Make IT"</p>
              </div>
              
              <div className="w-full flex flex-col items-center">
                <h1 className="text-[84px] font-bold uppercase tracking-[0.15em] font-serif leading-none" style={{ fontFamily: "'Playfair Display', serif" }}>Certificate</h1>
                <p className={`text-2xl tracking-[0.6em] uppercase ${currentTheme.accent} mt-4 font-sans font-semibold`}>of Completion</p>
                <div className={`w-56 h-[1.5px] ${currentTheme.line} mt-8`}></div>
              </div>
            </motion.div>

            {/* CENTER SECTION */}
            <div className="flex flex-col items-center w-full">
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-base tracking-[0.4em] font-sans text-gray-400 font-bold uppercase mb-8"
              >
                PROUDLY PRESENTED TO
              </motion.p>
              
              <motion.h3 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, type: "spring" }}
                className="text-[76px] font-bold italic font-serif leading-tight mb-4" 
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {name.toUpperCase()}
              </motion.h3>
              
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="space-y-4"
              >
                <p className={`text-2xl ${theme === 'midnight' ? 'text-gray-300' : 'text-gray-600'} font-sans italic`}>
                  A student of <span className={`font-bold ${theme === 'midnight' ? 'text-white' : 'text-gray-900'} not-italic uppercase tracking-wide`}>{college}</span>
                </p>
                <p className={`text-2xl ${theme === 'midnight' ? 'text-gray-300' : 'text-gray-600'} font-sans italic max-w-[850px] leading-relaxed`}>
                  has successfully completed an Internship in 
                  <span className={`block mt-3 text-[34px] font-black uppercase tracking-wider not-italic`}>{workshop}</span>
                </p>
                <p className="text-xl text-gray-500 font-sans mt-6">
                  from <span className={`font-bold ${theme === 'midnight' ? 'text-white' : 'text-gray-800'} underline decoration-${currentTheme.primary} decoration-2 underline-offset-8`}>{startDate}</span> to <span className={`font-bold ${theme === 'midnight' ? 'text-white' : 'text-gray-800'} underline decoration-${currentTheme.primary} decoration-2 underline-offset-8`}>{endDate}</span>
                </p>
              </motion.div>
            </div>

            {/* BOTTOM SECTION */}
            <div className="w-full flex justify-between items-end px-16 pb-2">
              {/* Left: QR Code & ID */}
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col items-center gap-3"
              >
                <div className={`p-2 border ${theme === 'midnight' ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-white'} shadow-sm`}>
                  <QRCodeCanvas 
                    value={verifyUrl} 
                    size={95} 
                    bgColor={theme === 'midnight' ? '#1f2937' : '#ffffff'}
                    fgColor={theme === 'midnight' ? '#ffffff' : '#000000'}
                  />
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-sans text-gray-400 font-bold tracking-widest uppercase">Certificate ID</p>
                  <p className="text-xs font-mono font-bold">{certificateId}</p>
                </div>
              </motion.div>

              {/* Center: Seal */}
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1, type: "spring" }}
                className="relative mb-2"
              >
                <div className={`w-[140px] h-[140px] rounded-full border-[6px] ${currentTheme.border} border-opacity-20 flex items-center justify-center relative`}>
                  <div className="absolute inset-0 rounded-full" style={{ backgroundColor: currentTheme.sealBg }}></div>
                  <div className={`z-10 text-[11px] font-black ${currentTheme.accent} text-center uppercase leading-tight font-sans tracking-tighter`}>
                    OFFICIAL<br/>TECHFORGE<br/>VERIFIED SEAL
                  </div>
                  <div className={`absolute inset-2 border border-dashed ${currentTheme.border} border-opacity-30 rounded-full animate-spin-slow`}></div>
                </div>
              </motion.div>

              {/* Right: Signature */}
              <motion.div 
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col items-center"
              >
                <p className="font-serif italic text-5xl opacity-90 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>Hariprasad S</p>
                <div className={`h-[2px] w-56 ${theme === 'midnight' ? 'bg-gray-700' : 'bg-gray-200'} mb-3`}></div>
                <p className="text-[15px] font-bold tracking-widest uppercase font-sans">Hariprasad S</p>
                <p className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase font-sans mt-1">Founder & CEO</p>
              </motion.div>
            </div>

            <div className="absolute bottom-6 left-0 right-0">
              <p className="text-[11px] tracking-[0.6em] uppercase text-gray-400 font-sans font-bold">www.techforgesolutions.com</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
});

export default CertificatePreview;