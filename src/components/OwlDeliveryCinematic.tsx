import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, X, RotateCcw, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DateInvitation } from '../types/invitation';
import { FlyingOwl } from './FlyingOwl';

interface OwlDeliveryCinematicProps {
  invitation: DateInvitation;
  isOpen: boolean;
  onClose: () => void;
  onAccepted?: () => void;
}

export const OwlDeliveryCinematic: React.FC<OwlDeliveryCinematicProps> = ({
  invitation,
  isOpen,
  onClose,
  onAccepted,
}) => {
  // Flight phases:
  // 'distant' -> 'swooping' -> 'hovering' -> 'ticket_ready'
  const [phase, setPhase] = useState<'distant' | 'swooping' | 'hovering' | 'ticket_ready'>('distant');
  const [isAccepted, setIsAccepted] = useState(false);
  const [hesitateCount, setHesitateCount] = useState(0);
  const [hesitatePos, setHesitatePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isOpen) {
      setPhase('distant');
      return;
    }

    setPhase('distant');

    const t1 = setTimeout(() => {
      setPhase('swooping');
    }, 1200);

    const t2 = setTimeout(() => {
      setPhase('hovering');
    }, 2800);

    const t3 = setTimeout(() => {
      setPhase('ticket_ready');
      confetti({
        particleCount: 90,
        spread: 95,
        origin: { y: 0.5 },
        colors: ['#38bdf8', '#ffd700', '#fef08a', '#f59e0b', '#ffffff'],
      });
    }, 4400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isOpen]);

  const handleReplay = () => {
    setPhase('distant');
    setHesitateCount(0);
    setHesitatePos({ x: 0, y: 0 });

    setTimeout(() => setPhase('swooping'), 1200);
    setTimeout(() => setPhase('hovering'), 2800);
    setTimeout(() => {
      setPhase('ticket_ready');
      confetti({
        particleCount: 70,
        spread: 85,
        origin: { y: 0.5 },
        colors: ['#38bdf8', '#ffd700', '#fef08a', '#ffffff'],
      });
    }, 4400);
  };

  const handleAccept = () => {
    setIsAccepted(true);
    onAccepted?.();
    confetti({
      particleCount: 130,
      spread: 110,
      origin: { y: 0.55 },
      colors: ['#38bdf8', '#ff4d6d', '#ffd700', '#fef08a', '#ffffff'],
    });
  };

  const handleHesitate = () => {
    setHesitateCount((prev) => prev + 1);
    if (hesitateCount < 3) {
      const rx = (Math.random() - 0.5) * 120;
      const ry = (Math.random() - 0.5) * 60;
      setHesitatePos({ x: rx, y: ry });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Mystical night background backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity duration-1000"
        onClick={phase === 'ticket_ready' ? onClose : undefined}
      />

      {/* Floating magical background stars & starlight auras */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-indigo-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Close button (active once ticket is ready) */}
      {phase === 'ticket_ready' && (
        <button
          onClick={onClose}
          className="fixed top-4 right-4 z-50 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-amber-200/90 border border-amber-500/30 backdrop-blur-sm transition-all hover:scale-110"
          title="Закрыть"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* CINEMATIC CONTAINER */}
      <div className="relative z-10 w-full max-w-xl mx-auto flex flex-col items-center justify-center min-h-[520px]">
        {/* ================= REAL FLYING FLAPPING OWL SEQUENCE ================= */}
        {phase !== 'ticket_ready' && (
          <div className="relative flex flex-col items-center justify-center select-none py-10 w-full">
            {/* Ambient starlight & celestial aura behind the owl */}
            <div
              className={`absolute rounded-full transition-all duration-1000 ease-out ${
                phase === 'distant'
                  ? 'w-24 h-24 bg-sky-300/20 blur-xl scale-50 opacity-40'
                  : phase === 'swooping'
                  ? 'w-64 h-64 bg-sky-400/30 blur-2xl scale-100 opacity-70'
                  : 'w-96 h-96 bg-amber-300/35 blur-3xl scale-125 opacity-90'
              }`}
            />

            {/* Flying Owl with Real Flapping Wings, Blue Eyes, and Swoop Flight Path */}
            <div
              className={`relative transition-all ease-out transform ${
                phase === 'distant'
                  ? 'scale-[0.22] -translate-y-40 opacity-40 blur-[2px] duration-1200 rotate-4'
                  : phase === 'swooping'
                  ? 'scale-[0.72] -translate-y-8 opacity-95 blur-none duration-1400 -rotate-2'
                  : 'scale-[1.15] translate-y-4 opacity-100 duration-1000 rotate-0'
              }`}
              style={{
                transitionProperty: 'transform, opacity, filter',
                perspective: '1200px',
              }}
            >
              <FlyingOwl size={330} blueEyes={true} />
            </div>

            {/* Cinematic narration badge with the romantic midnight story */}
            <div
              className={`mt-10 text-center transition-all duration-700 max-w-md ${
                phase === 'distant'
                  ? 'opacity-60 translate-y-4'
                  : phase === 'swooping'
                  ? 'opacity-90 translate-y-0'
                  : 'opacity-100'
              }`}
            >
              <div className="inline-flex flex-col items-center gap-1 px-5 py-2.5 rounded-2xl bg-amber-950/80 border border-amber-400/40 backdrop-blur-md shadow-2xl">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-300 animate-spin" style={{ animationDuration: '4s' }} />
                  <span className="font-cinzel text-xs uppercase tracking-wider text-amber-300 font-bold">
                    {phase === 'distant' && 'В ночном небе вдали раздался шорох крыльев...'}
                    {phase === 'swooping' && 'Букля мчится сквозь звёзды ровно в 3 часа ночи... 🦉✨'}
                    {phase === 'hovering' && 'Посылка из Хогвартса прибыла к Заюшке! 💙'}
                  </span>
                </div>
                <span className="font-quill text-base text-amber-100/90 leading-tight">
                  {phase === 'distant' && '11 число. Время, когда наши пути сошлись...'}
                  {phase === 'swooping' && 'Для голубоглазой кудрявой заюшки с огромной любовью'}
                  {phase === 'hovering' && 'В лапках — золотой билет на свидание... 💌'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ================= THE HOGWARTS TICKET ================= */}
        {phase === 'ticket_ready' && (
          <div className="w-full animate-in fade-in zoom-in-95 duration-700 select-none">
            {/* Header delivery badge */}
            <div className="text-center mb-3">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/20 border border-sky-400/40 text-sky-200 text-xs font-cinzel tracking-widest uppercase shadow-lg">
                <Sparkles className="w-3.5 h-3.5 text-sky-300" />
                СОВИНАЯ ПОЧТА • 11 ЧИСЛО • 03:00 НОЧИ
              </span>
            </div>

            {/* THE HOGWARTS VIP DATE PASS CARD */}
            <div className="relative rounded-2xl p-6 sm:p-7 text-white overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95),0_0_40px_rgba(56,189,248,0.25)] border-2 border-amber-400/50 bg-[#150f22]">
              {/* Ticket Perforations on edges */}
              <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-8 h-8 rounded-full bg-[#0a050d] shadow-inner" />
              <div className="absolute top-1/2 -right-4 -translate-y-1/2 w-8 h-8 rounded-full bg-[#0a050d] shadow-inner" />

              {/* Decorative borders */}
              <div className="absolute inset-2 sm:inset-3 border border-amber-400/25 rounded-xl pointer-events-none" />

              {/* Ticket Content */}
              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-amber-400/20 pb-3 mb-3 gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300 shadow-sm font-cinzel text-sm font-bold shrink-0">
                      ⚡
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase font-cinzel font-bold tracking-[0.16em] text-amber-300 block leading-tight">
                        LONDON TO HOGSMEADE • PLATFORM 9¾
                      </span>
                      <h3 className="font-magical text-base sm:text-xl font-bold text-amber-100 leading-tight">
                        БИЛЕТ НА ВОЛШЕБНОЕ СВИДАНИЕ
                      </h3>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-cinzel text-xs font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-400/40">
                      № 11-03
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {/* Recipient info in Quill handwriting */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white/[0.04] p-3 rounded-xl border border-amber-400/20">
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] text-amber-300/80 font-magical italic block">
                        Именной билет для:
                      </span>
                      <p className="font-quill text-2xl sm:text-3xl text-amber-100 leading-tight drop-shadow-sm break-words">
                        {invitation.to}
                      </p>
                    </div>

                    <div className="px-2.5 py-1 rounded-full bg-sky-500/20 border border-sky-400/40 text-sky-300 font-cinzel text-[10px] font-bold shrink-0 self-start sm:self-center flex items-center gap-1">
                      <span>💙 САМАЯ ЛЮБИМАЯ</span>
                    </div>
                  </div>

                  {/* Date & Location Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-white/[0.04] p-2.5 sm:p-3 rounded-xl border border-amber-400/20 shadow-inner">
                    <div>
                      <span className="text-[10px] text-amber-300/80 font-press uppercase tracking-wider block">
                        НАША ДАТА
                      </span>
                      <span className="text-sky-200 font-magical font-bold text-sm block mt-0.5 break-words">
                        {invitation.dateTime}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-300/80 font-press uppercase tracking-wider block">
                        МЕСТО
                      </span>
                      <span className="text-amber-100 font-magical font-bold text-sm block mt-0.5 break-words">
                        {invitation.location}
                      </span>
                    </div>
                  </div>

                  {invitation.dressCode && (
                    <div className="text-xs bg-white/[0.04] p-2.5 rounded-lg border border-amber-400/20 flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
                      <span className="text-amber-300 font-magical italic font-semibold shrink-0">
                        Дресс-код:
                      </span>
                      <span className="text-amber-100 font-medium break-words leading-snug flex-1">
                        {invitation.dressCode}
                      </span>
                    </div>
                  )}

                  {/* Handwritten Romantic note */}
                  <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/10 via-sky-500/15 to-rose-500/10 border border-amber-400/30 text-center">
                    <p className="font-quill text-base sm:text-lg text-amber-100 leading-relaxed break-words">
                      «{invitation.message || '11 число в 3 ночи — навсегда наш момент. Я тебя очень люблю!'}»
                    </p>
                  </div>
                </div>

                {/* Stamp & Sender Footer */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 mt-3 border-t border-amber-400/20">
                  <div className="flex items-center flex-wrap gap-1 min-w-0">
                    <span className="text-xs font-magical italic text-amber-300/80 shrink-0">
                      От всего сердца:
                    </span>
                    <span className="font-quill text-xl sm:text-2xl font-bold text-rose-300 break-words leading-tight">
                      {invitation.sender}
                    </span>
                  </div>

                  {/* Official Stamp */}
                  <div
                    className={`transform -rotate-3 sm:-rotate-6 px-3 py-1 rounded-lg border shadow-md flex items-center gap-1.5 transition-all shrink-0 self-end sm:self-auto ${
                      isAccepted
                        ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                        : 'border-sky-400 bg-sky-500/20 text-sky-300'
                    }`}
                  >
                    <span className="font-cinzel text-xs font-bold uppercase tracking-wider">
                      {isAccepted ? 'СОГЛАСОВАНО 🤍' : 'НАВЕЧНО ⚡'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons: "Летим! 🦉✨" and "Подумаю..." */}
            <div className="mt-4 space-y-3">
              {!isAccepted ? (
                <div className="flex items-center justify-center gap-3">
                  {/* Button 1 */}
                  <button
                    type="button"
                    onClick={handleAccept}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-rose-600 to-amber-700 hover:from-amber-500 hover:to-rose-500 text-white font-magical font-bold text-sm sm:text-base shadow-[0_0_20px_rgba(251,191,36,0.4)] border border-amber-400/50 transition-all hover:scale-105 active:scale-95 uppercase tracking-wider"
                  >
                    <span>Летим! 🦉✨</span>
                  </button>

                  {/* Button 2 */}
                  {hesitateCount < 3 ? (
                    <button
                      type="button"
                      onMouseEnter={handleHesitate}
                      onClick={handleHesitate}
                      className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-magical text-sm border border-white/20 transition-transform duration-200"
                      style={{
                        transform: `translate(${hesitatePos.x}px, ${hesitatePos.y}px)`,
                      }}
                    >
                      <span>Подумаю... 😏</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleAccept}
                      className="flex-1 py-3 px-4 rounded-xl bg-amber-500/30 border border-amber-400 text-amber-200 font-magical font-bold text-sm transition-all animate-pulse uppercase tracking-wider"
                    >
                      <span>Ладно, летим! 🪄💖</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="py-2.5 px-4 rounded-xl bg-emerald-500/20 border border-emerald-400/50 text-emerald-200 text-center text-xs sm:text-sm font-magical font-semibold flex items-center justify-center gap-2">
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Отличный выбор, заюшка! Свидание официально назначено ✨💙</span>
                </div>
              )}

              {/* Utility actions */}
              <div className="flex items-center justify-center pt-1">
                <button
                  onClick={handleReplay}
                  className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white/80 transition-all hover:scale-105 text-xs flex items-center gap-1.5"
                  title="Посмотреть полёт Букли снова"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Повторить полёт совы 🦉</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
