import React from 'react';
import { Heart, Sparkles, Star, Flame } from 'lucide-react';
import { EnvelopeColor, SealSymbol } from '../types/invitation';
import { playEnvelopeOpenSound, playCutePopSound } from '../utils/audio';

interface EnvelopeProps {
  recipientName: string;
  envelopeColor: EnvelopeColor;
  sealSymbol: SealSymbol;
  isOpen: boolean;
  onOpen: () => void;
}

export const Envelope: React.FC<EnvelopeProps> = ({
  recipientName,
  envelopeColor,
  sealSymbol,
  isOpen,
  onOpen,
}) => {
  const colorStyles: Record<EnvelopeColor, { bg: string; flap: string; accent: string }> = {
    burgundy: {
      bg: 'bg-gradient-to-b from-[#4a0e17] to-[#2d080e]',
      flap: 'bg-[#5c131e]',
      accent: 'border-[#7a1c29]',
    },
    emerald: {
      bg: 'bg-gradient-to-b from-[#063327] to-[#031d16]',
      flap: 'bg-[#0a4233]',
      accent: 'border-[#0f5744]',
    },
    navy: {
      bg: 'bg-gradient-to-b from-[#0b1b36] to-[#050e1f]',
      flap: 'bg-[#0f254a]',
      accent: 'border-[#183a73]',
    },
    rose: {
      bg: 'bg-gradient-to-b from-[#471829] to-[#290d17]',
      flap: 'bg-[#5c2136]',
      accent: 'border-[#7a2c47]',
    },
  };

  const sealIcons = {
    heart: <Heart className="w-6 h-6 fill-current text-[#ffb6c1] drop-shadow" />,
    star: <Star className="w-6 h-6 fill-current text-[#ffe082] drop-shadow" />,
    rose: <Sparkles className="w-6 h-6 fill-current text-[#ffccd5] drop-shadow" />,
    gem: <Flame className="w-6 h-6 fill-current text-[#ffd166] drop-shadow" />,
  };

  const colors = colorStyles[envelopeColor] || colorStyles.burgundy;

  const handleOpenClick = () => {
    playCutePopSound();
    playEnvelopeOpenSound();
    onOpen();
  };

  return (
    <div className="relative w-full max-w-md mx-auto aspect-[16/11] flex items-center justify-center p-4">
      {/* Outer Envelope Body */}
      <div
        onClick={handleOpenClick}
        className={`group relative w-full h-full rounded-2xl shadow-2xl overflow-hidden cursor-pointer border border-white/10 ${colors.bg} transition-transform duration-500 hover:scale-[1.02] active:scale-[0.99]`}
        style={{
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 30px rgba(183, 110, 121, 0.2)',
        }}
      >
        {/* Subtle paper grain overlay */}
        <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-[0.5px] pointer-events-none" />

        {/* Envelope folds / geometric triangles */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Left triangle */}
          <div
            className="absolute top-0 left-0 w-0 h-0 border-solid"
            style={{
              borderTop: '130px solid rgba(255,255,255,0.03)',
              borderRight: '180px solid transparent',
            }}
          />
          {/* Bottom triangle shadow */}
          <div
            className="absolute bottom-0 left-0 right-0 h-1/2"
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.35), transparent)',
            }}
          />
        </div>

        {/* Envelope Top Flap (3D flip effect) */}
        <div
          className={`absolute top-0 left-0 right-0 h-1/2 origin-top transition-transform duration-700 ease-out z-20 ${colors.flap} ${colors.accent} border-b shadow-lg flex items-center justify-center`}
          style={{
            clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
            transform: isOpen ? 'rotateX(180deg)' : 'rotateX(0deg)',
          }}
        >
          {/* Flap gold foil rim */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
              borderBottom: '2px solid rgba(212, 175, 55, 0.4)',
            }}
          />
        </div>

        {/* Recipient Lettering Front */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 pointer-events-none">
          <span className="text-[#e2b76b] text-[11px] uppercase tracking-[0.25em] font-semibold mb-1 opacity-80">
            Лично в руки
          </span>
          <h3 className="font-handwriting text-2xl sm:text-3xl text-white/95 font-bold drop-shadow-sm mb-1">
            {recipientName || 'Для тебя...'}
          </h3>
          <p className="text-white/50 text-xs tracking-wider font-light flex items-center gap-1.5 mt-2">
            <span>✨</span>
            <span>Нажми на печать, чтобы открыть</span>
            <span>✨</span>
          </p>
        </div>

        {/* Wax Seal in Center */}
        <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 transition-transform duration-300 group-hover:scale-110">
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#800e1e] via-[#5c0a15] to-[#38040b] wax-seal-shadow flex items-center justify-center border-2 border-[#a81c30]/60">
            {/* Irregular wax edge simulation */}
            <div className="absolute -inset-1 rounded-full border border-[#800e1e]/40 opacity-70 pointer-events-none" />

            {/* Inner stamped ring */}
            <div className="w-12 h-12 rounded-full border border-amber-300/40 flex items-center justify-center shadow-inner bg-black/20">
              {sealIcons[sealSymbol] || sealIcons.heart}
            </div>

            {/* Little wax drippings visual */}
            <div className="absolute -bottom-1 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#5c0a15] opacity-80" />
            <div className="absolute -top-1 -left-0.5 w-3 h-3 rounded-full bg-[#5c0a15] opacity-80" />
          </div>
        </div>
      </div>
    </div>
  );
};
