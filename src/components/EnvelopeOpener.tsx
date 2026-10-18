import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playCutePopSound } from '../utils/audio';
import envelopeImg from '../assets/images/ivory_embossed_envelope_1791349626055.jpg';
import waxSealImg from '../assets/images/ivory_wax_seal_monogram_1791349647636.jpg';

interface EnvelopeOpenerProps {
  recipientName: string;
  senderName: string;
  onOpen: () => void;
}

export const EnvelopeOpener: React.FC<EnvelopeOpenerProps> = ({
  recipientName,
  senderName,
  onOpen,
}) => {
  const [isOpening, setIsOpening] = useState(false);

  const handleSealClick = () => {
    if (isOpening) return;
    setIsOpening(true);
    playCutePopSound();

    confetti({
      particleCount: 50,
      spread: 75,
      origin: { y: 0.5 },
      colors: ['#fef3c7', '#fde68a', '#ffffff', '#f43f5e', '#fbbf24'],
    });

    setTimeout(() => {
      onOpen();
    }, 950);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md select-none transition-opacity duration-700">
      <div
        className={`relative w-full max-w-[360px] sm:max-w-[400px] aspect-[9/16] max-h-[85vh] rounded-3xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85),0_0_40px_rgba(251,191,36,0.25)] border border-amber-200/40 transition-all duration-700 transform ${
          isOpening ? 'scale-105 opacity-0 pointer-events-none' : 'scale-100 opacity-100'
        }`}
      >
        {/* Embossed Ivory Envelope Background Image */}
        <img
          src={envelopeImg}
          alt="Luxury Embossed Envelope"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Soft Golden Ambient Glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

        {/* Top Hint Text */}
        <div className="relative z-10 pt-10 sm:pt-14 text-center px-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 backdrop-blur-md text-[11px] font-serif font-semibold text-amber-950 shadow-sm border border-amber-200/50 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-spin" style={{ animationDuration: '6s' }} />
            Особенное послание
          </span>
          <h3 className="font-serif text-xl sm:text-2xl text-amber-950 font-bold mt-2 drop-shadow-xs">
            Для {recipientName}
          </h3>
          <p className="text-[12px] text-amber-900/80 font-serif italic mt-0.5">
            от {senderName}
          </p>
        </div>

        {/* Center Wax Seal Button */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <button
            type="button"
            onClick={handleSealClick}
            className="group relative cursor-pointer focus:outline-none transition-transform active:scale-95 hover:scale-105"
            title="Нажмите на печать, чтобы открыть"
          >
            {/* Shimmer pulse ring around seal */}
            <div className="absolute -inset-3 rounded-full bg-amber-400/30 blur-md animate-pulse pointer-events-none" />

            {/* Wax Seal Image */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.5)] border-2 border-amber-300/60 bg-amber-50">
              <img
                src={waxSealImg}
                alt="Wax Seal Monogram"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Floating Tap Prompt */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-full bg-white/80 backdrop-blur-md shadow-md border border-amber-200/60 text-[11px] font-serif font-bold text-amber-950 animate-bounce">
              Нажми на печать ✦
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
