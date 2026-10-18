import React, { useState, useEffect } from 'react';
import { X, Sparkles, Compass, RotateCcw, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playChimeSound, playCutePopSound, playFootstepSound } from '../utils/audio';

interface MaraudersMapProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName?: string;
  senderName?: string;
}

export const MaraudersMap: React.FC<MaraudersMapProps> = ({
  isOpen,
  onClose,
}) => {
  const [step, setStep] = useState<number>(1); // 1 = walking, 2 = met at турники
  const [footstepProgress, setFootstepProgress] = useState<number>(0);

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setFootstepProgress(0);
      return;
    }
    setStep(1);
    setFootstepProgress(0);
    playCutePopSound();
  }, [isOpen]);

  // Animate footsteps walking towards each other (left from Жилгородок, right from Дом с друзьями to Турники)
  useEffect(() => {
    if (!isOpen || step !== 1) return;

    let localProgress = 0;
    const interval = setInterval(() => {
      localProgress += 2;
      setFootstepProgress(localProgress);

      // Play soft parchment footstep audio every ~4 steps
      if (localProgress % 8 === 0) {
        playFootstepSound();
      }

      if (localProgress >= 100) {
        clearInterval(interval);
        setStep(2);
        playChimeSound();
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#d97706', '#fbbf24', '#fef08a', '#38bdf8', '#ffffff'],
        });
      }
    }, 75);

    return () => clearInterval(interval);
  }, [isOpen, step]);

  const handleClose = () => {
    playCutePopSound();
    onClose();
  };

  const handleRestartRoute = () => {
    setFootstepProgress(0);
    setStep(1);
    playCutePopSound();
  };

  if (!isOpen) return null;

  // Pre-calculate fixed steps along the route for vintage ink footprint stamps
  const boyFootstepPoints = [
    { x: 14, y: 52, angle: 12, label: '02:40' },
    { x: 20, y: 56, angle: -8 },
    { x: 26, y: 50, angle: 10 },
    { x: 32, y: 54, angle: -10 },
    { x: 38, y: 49, angle: 8 },
    { x: 44, y: 52, angle: -6 },
  ];

  const girlFootstepPoints = [
    { x: 86, y: 52, angle: -12, label: '02:45' },
    { x: 80, y: 56, angle: 8 },
    { x: 74, y: 50, angle: -10 },
    { x: 68, y: 55, angle: 10 },
    { x: 62, y: 49, angle: -8 },
    { x: 56, y: 52, angle: 6 },
  ];

  // Friend tracks accompanying her in the first segment
  const friendFootstepPoints = [
    { x: 88, y: 38, angle: -10 },
    { x: 82, y: 41, angle: 6 },
    { x: 77, y: 39, angle: -8 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 select-none overflow-y-auto">
      {/* Dark mystic parchment backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity duration-500"
        onClick={handleClose}
      />

      {/* MARAUDER'S MAP PARCHMENT CARD */}
      <div className="relative z-10 w-full max-w-2xl my-auto rounded-3xl overflow-hidden border-2 border-[#b8860b] shadow-[0_25px_70px_rgba(0,0,0,0.95),0_0_50px_rgba(212,175,55,0.3)] bg-[#f7ebd4] text-[#382212] transition-all animate-in fade-in zoom-in-95 duration-500">
        {/* Antique aged parchment texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40 mix-blend-multiply"
          style={{
            backgroundImage: `radial-gradient(#b8860b 0.75px, transparent 0.75px), radial-gradient(#8b5a2b 0.75px, #f7ebd4 0.75px)`,
            backgroundSize: '32px 32px',
            backgroundPosition: '0 0, 16px 16px',
          }}
        />

        {/* Burned vintage parchment edges & inner border */}
        <div className="absolute inset-0 pointer-events-none border-[10px] border-[#e4d1ae] shadow-inner" />
        <div className="absolute inset-2.5 pointer-events-none border border-[#8b5a2b]/35 rounded-2xl" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3.5 right-3.5 z-30 p-2 rounded-full bg-[#382212]/10 hover:bg-[#382212]/20 text-[#382212] border border-[#8b5a2b]/40 transition-all hover:scale-105 active:scale-95"
          title="Свернуть карту (Шалость удалась)"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content Container */}
        <div className="relative z-10 p-5 sm:p-7 flex flex-col justify-between min-h-[580px]">
          {/* Header in authentic Gothic & Quill script */}
          <div className="text-center border-b border-[#8b5a2b]/30 pb-3 mb-2">
            <span className="font-cinzel text-[10px] tracking-[0.28em] text-[#8b5a2b] uppercase font-bold block">
              ✦ КАРТА МАРОДЁРОВ • СЕКРЕТНЫЙ МАРШРУТ 11 ЧИСЛА ✦
            </span>
            <h2 className="font-magical text-2xl sm:text-3xl font-extrabold text-[#2a170a] tracking-wide mt-1">
              Как мы шли к нашей первой встрече
            </h2>
            <p className="font-quill text-base sm:text-lg text-[#5c381e] italic mt-0.5">
              «Торжественно клянусь, что замышляю только романтику...»
            </p>
          </div>

          {/* Interactive Map Canvas / SVG Stage */}
          <div className="relative flex-1 rounded-2xl bg-[#eee0c3] border-2 border-[#b8860b]/40 p-3 sm:p-4 overflow-hidden shadow-inner flex flex-col justify-between my-2 min-h-[340px]">
            {/* Castle / City architectural map blueprint lines */}
            <svg
              className="absolute inset-0 w-full h-full opacity-30 pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id="parchmentGrid" width="28" height="28" patternUnits="userSpaceOnUse">
                  <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#78350f" strokeWidth="0.4" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#parchmentGrid)" />

              {/* Street roads from Жилгородок to Турники */}
              <path
                d="M 50 240 Q 140 220 220 230 T 320 180"
                fill="none"
                stroke="#6b3d1b"
                strokeWidth="1.5"
                strokeDasharray="5, 4"
              />
              {/* Street roads from Дом to Турники */}
              <path
                d="M 590 240 Q 500 220 420 230 T 320 180"
                fill="none"
                stroke="#6b3d1b"
                strokeWidth="1.5"
                strokeDasharray="5, 4"
              />
              {/* Decorative vintage compass rose outline in background */}
              <circle cx="320" cy="180" r="75" fill="none" stroke="#8b5a2b" strokeWidth="0.5" strokeDasharray="3, 5" />
            </svg>

            {/* TOP BAR: Point A (Жилгородок) & Point B (Дом с друзьями) */}
            <div className="relative z-10 flex items-start justify-between gap-2">
              {/* Checkpoint 1: Boy's departure location (Жилгородок) */}
              <div className="flex items-center gap-2 bg-[#f9edd8]/95 px-3 py-2 rounded-xl border border-[#8b5a2b]/35 shadow-sm max-w-[210px]">
                <div className="w-8 h-8 rounded-lg bg-[#382212]/10 border border-[#8b5a2b]/30 flex items-center justify-center text-[#5c381e] shrink-0">
                  <Compass className="w-4 h-4 text-[#8b5a2b]" />
                </div>
                <div>
                  <span className="text-[9px] font-cinzel font-bold text-[#8b5a2b] uppercase tracking-wider block">
                    ТОЧКА А • 02:40
                  </span>
                  <span className="text-xs sm:text-sm font-magical font-bold text-[#2a170a] block leading-tight">
                    Жилгородок 🏙️
                  </span>
                  <span className="text-[9px] font-quill text-[#6b3d1b] italic block leading-tight">
                    Я шёл один навстречу
                  </span>
                </div>
              </div>

              {/* Checkpoint 2: Girl's location (Из дома с друзьями) */}
              <div className="flex items-center gap-2 bg-[#f9edd8]/95 px-3 py-2 rounded-xl border border-[#8b5a2b]/35 shadow-sm max-w-[210px] text-right">
                <div className="flex-1">
                  <span className="text-[9px] font-cinzel font-bold text-[#8b5a2b] uppercase tracking-wider block">
                    ТОЧКА Б • 02:45
                  </span>
                  <span className="text-xs sm:text-sm font-magical font-bold text-[#2a170a] block leading-tight">
                    Из дома с друзьями 🏡
                  </span>
                  <span className="text-[9px] font-quill text-[#6b3d1b] italic block leading-tight">
                    Ты шла в компании друзей
                  </span>
                </div>
                <div className="w-8 h-8 rounded-lg bg-[#382212]/10 border border-[#8b5a2b]/30 flex items-center justify-center text-[#5c381e] shrink-0 text-sm">
                  🐰
                </div>
              </div>
            </div>

            {/* CENTER MAP STAGE: The Paths & Animated Footsteps meeting at ТУРНИКИ */}
            <div className="relative my-auto py-5 sm:py-6">
              {/* Dotted paths connecting Zhilgorodok & Home to Pull-up bars */}
              <div className="relative h-32 sm:h-36 w-full flex items-center justify-between px-2 sm:px-6">
                
                {/* SVG Walking Paths with Inked Footsteps */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                  {/* Left Path: Жилгородок to Турники */}
                  <line
                    x1="12%"
                    y1="52%"
                    x2="48%"
                    y2="52%"
                    stroke="#8b5a2b"
                    strokeWidth="1.5"
                    strokeDasharray="4, 4"
                    opacity="0.45"
                  />
                  {/* Right Path: Дом с друзьями to Турники */}
                  <line
                    x1="88%"
                    y1="52%"
                    x2="52%"
                    y2="52%"
                    stroke="#8b5a2b"
                    strokeWidth="1.5"
                    strokeDasharray="4, 4"
                    opacity="0.45"
                  />

                  {/* Stamped Ink Footsteps (revealed as progress advances) */}
                  {boyFootstepPoints.map((pt, idx) => {
                    const isVisible = footstepProgress >= (idx + 1) * 15;
                    return (
                      <g
                        key={`boy-step-${idx}`}
                        className={`transition-opacity duration-300 ${isVisible ? 'opacity-70' : 'opacity-0'}`}
                        transform={`translate(${pt.x * 6.2}, ${pt.y * 1.3}) rotate(${pt.angle})`}
                      >
                        {/* Classical Inked Shoe Prints */}
                        <ellipse cx="-3" cy="0" rx="2.5" ry="4.5" fill="#382212" />
                        <ellipse cx="-3" cy="5" rx="1.8" ry="2" fill="#382212" />
                        <ellipse cx="3" cy="-2" rx="2.5" ry="4.5" fill="#382212" />
                        <ellipse cx="3" cy="3" rx="1.8" ry="2" fill="#382212" />
                      </g>
                    );
                  })}

                  {/* Friends walking partway beside her */}
                  {friendFootstepPoints.map((pt, idx) => {
                    const isVisible = footstepProgress >= (idx + 1) * 10;
                    return (
                      <g
                        key={`friend-step-${idx}`}
                        className={`transition-opacity duration-300 ${isVisible ? 'opacity-40' : 'opacity-0'}`}
                        transform={`translate(${pt.x * 6.2}, ${pt.y * 1.3}) rotate(${pt.angle})`}
                      >
                        <ellipse cx="-2" cy="0" rx="1.8" ry="3.5" fill="#78350f" />
                        <ellipse cx="2" cy="-2" rx="1.8" ry="3.5" fill="#78350f" />
                      </g>
                    );
                  })}

                  {/* Girl Stamped Ink Footsteps */}
                  {girlFootstepPoints.map((pt, idx) => {
                    const isVisible = footstepProgress >= (idx + 1) * 15;
                    return (
                      <g
                        key={`girl-step-${idx}`}
                        className={`transition-opacity duration-300 ${isVisible ? 'opacity-75' : 'opacity-0'}`}
                        transform={`translate(${pt.x * 6.2}, ${pt.y * 1.3}) rotate(${pt.angle})`}
                      >
                        {/* Elegant Inked Footprints */}
                        <ellipse cx="-2.5" cy="0" rx="2" ry="4" fill="#6b3d1b" />
                        <ellipse cx="-2.5" cy="4.5" rx="1.5" ry="1.8" fill="#6b3d1b" />
                        <ellipse cx="2.5" cy="-2" rx="2" ry="4" fill="#6b3d1b" />
                        <ellipse cx="2.5" cy="2.5" rx="1.5" ry="1.8" fill="#6b3d1b" />
                      </g>
                    );
                  })}
                </svg>

                {/* Left Dynamic Walker: «Я (из Жилгородка)» */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-100 ease-linear pointer-events-none z-20"
                  style={{
                    left: `${Math.min(43, 8 + footstepProgress * 0.35)}%`,
                  }}
                >
                  <div className="px-2 py-0.5 rounded-md bg-[#2a170a] text-[#f7ebd4] text-[9px] font-cinzel font-bold shadow-md whitespace-nowrap mb-1 flex items-center gap-1 border border-[#b8860b]/40">
                    <span>Я (из Жилгородка)</span>
                    <span className="text-[10px]">👣</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-[#5c381e] animate-bounce">
                    <span className="text-xs transform -rotate-12 inline-block">👞</span>
                    <span className="text-xs transform rotate-12 inline-block">👞</span>
                  </div>
                </div>

                {/* Right Dynamic Walker: «Ты (с друзьями)» */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-100 ease-linear pointer-events-none z-20"
                  style={{
                    right: `${Math.min(43, 8 + footstepProgress * 0.35)}%`,
                  }}
                >
                  <div className="px-2 py-0.5 rounded-md bg-[#6b3d1b] text-[#fef3c7] text-[9px] font-cinzel font-bold shadow-md whitespace-nowrap mb-1 flex items-center gap-1 border border-[#b8860b]/40">
                    <span>Заюшка (с друзьями)</span>
                    <span className="text-[10px]">🐰</span>
                  </div>
                  <div
                    className="flex items-center gap-0.5 text-[#6b3d1b] animate-bounce"
                    style={{ animationDelay: '0.15s' }}
                  >
                    <span className="text-xs transform rotate-12 inline-block">🐾</span>
                    <span className="text-xs transform -rotate-12 inline-block">🐾</span>
                  </div>
                </div>

                {/* CENTER RENDEZVOUS LANDMARK: ТУРНИКИ (Pull-up Workout Bars) */}
                <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex flex-col items-center z-30">
                  {/* Illustrated Inked Pull-up Bars (Турники) Icon Badge */}
                  <div
                    className={`relative rounded-2xl flex flex-col items-center justify-center p-2.5 transition-all duration-500 border-2 ${
                      step === 2
                        ? 'bg-gradient-to-b from-[#2a170a] to-[#451a03] border-amber-400 text-amber-200 shadow-[0_0_35px_rgba(217,119,6,0.85)] scale-110'
                        : 'bg-[#f7ebd4] border-[#8b5a2b] text-[#382212] shadow-md'
                    }`}
                  >
                    {/* Architectural Sketch of Pull-Up Bars (Турники) */}
                    <div className="w-12 h-9 flex items-center justify-center mb-1">
                      <svg viewBox="0 0 60 45" className="w-full h-full">
                        {/* Ground line */}
                        <line x1="6" y1="40" x2="54" y2="40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        {/* Vertical bar uprights */}
                        <line x1="16" y1="40" x2="16" y2="10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                        <line x1="30" y1="40" x2="30" y2="6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                        <line x1="44" y1="40" x2="44" y2="14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                        {/* Horizontal pull-up crossbars */}
                        <line x1="12" y1="11" x2="33" y2="11" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        <line x1="28" y1="7" x2="48" y2="7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        {/* Corner brackets */}
                        <circle cx="16" cy="11" r="2" fill="currentColor" />
                        <circle cx="30" cy="7" r="2" fill="currentColor" />
                        <circle cx="44" cy="7" r="2" fill="currentColor" />
                      </svg>
                    </div>

                    <span className="text-[10px] font-cinzel font-extrabold tracking-widest uppercase leading-none">
                      ТУРНИКИ
                    </span>
                    <span className="text-[8px] font-cinzel tracking-wider leading-tight opacity-90 mt-0.5">
                      11 ЧИСЛО • 03:00
                    </span>

                    {/* Romantic Sparkles Glow when met */}
                    {step === 2 && (
                      <div className="absolute -top-2 -right-2 bg-amber-400 text-stone-950 rounded-full p-1 shadow-md animate-spin">
                        <Sparkles className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Note & Story Text during or after approach */}
              <div className="text-center mt-3">
                {step === 2 ? (
                  <div className="inline-flex flex-col items-center gap-1 px-4 py-2 rounded-2xl bg-[#2a170a] text-[#fde047] text-xs font-magical font-bold shadow-lg border border-amber-400/50 animate-pulse max-w-md mx-auto">
                    <div className="flex items-center gap-1.5 text-amber-300">
                      <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                      <span className="text-xs sm:text-sm font-magical font-extrabold">
                        Следы соединились на турниках! 💙✨
                      </span>
                    </div>
                    <p className="text-[11px] font-quill text-[#fef08a] italic font-normal text-center leading-snug">
                      Ты пришла от дома с друзьями, а я прибежал из Жилгородка... И в 3 часа ночи началась наша история.
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-xs font-quill text-[#5c381e] italic">
                    <MapPin className="w-3.5 h-3.5 text-[#8b5a2b] shrink-0" />
                    <span>
                      Шаги приближаются к турникам... ({Math.round(footstepProgress)}%)
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Checkpoint Bottom: Destination Details Banner */}
            <div className="relative z-10 bg-[#f9edd8]/95 p-3 rounded-xl border border-[#8b5a2b]/35 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
              <div className="text-center sm:text-left">
                <span className="font-cinzel text-[9px] text-[#8b5a2b] font-bold block uppercase tracking-wider">
                  ТОЧКА НАЗНАЧЕНИЯ:
                </span>
                <span className="font-magical font-bold text-[#2a170a] text-xs sm:text-sm block">
                  Турники • 11 число • 03:00 ночи
                </span>
                <span className="font-quill text-[11px] text-[#5c381e] italic block">
                  Место нашей судьбоносной ночной встречи под луной
                </span>
              </div>

              <button
                type="button"
                onClick={handleRestartRoute}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#382212]/10 hover:bg-[#382212]/20 text-[#382212] font-cinzel text-[10px] font-bold transition-all shrink-0 hover:scale-105 active:scale-95"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Пройти маршрут снова 👣</span>
              </button>
            </div>
          </div>

          {/* Footer with Marauder's Oath */}
          <div className="pt-3 border-t border-[#8b5a2b]/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="font-quill text-sm text-[#5c381e] italic text-center sm:text-left">
              «Шалость удалась... Я тебя очень люблю, заюшка!»
            </span>

            <button
              type="button"
              onClick={handleClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#5c381e] to-[#2a170a] hover:from-[#784525] hover:to-[#382212] text-[#fef3c7] font-cinzel font-bold text-xs uppercase tracking-wider shadow-lg border border-[#b8860b]/40 transition-all hover:scale-105 active:scale-95"
            >
              Шалость удалась (Свернуть карту) ✨
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
