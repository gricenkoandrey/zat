import React, { useState } from 'react';
import { Heart, Calendar, MessageCircle, Share2, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DateInvitation } from '../types/invitation';
import { playChimeSound, playCutePopSound } from '../utils/audio';

interface ResponseCardProps {
  invitation: DateInvitation;
  onAccepted: () => void;
  isAccepted: boolean;
}

export const ResponseCard: React.FC<ResponseCardProps> = ({
  invitation,
  onAccepted,
  isAccepted,
}) => {
  const [hesitateCount, setHesitateCount] = useState(0);
  const [hesitatePos, setHesitatePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const triggerAcceptanceCelebration = () => {
    playCutePopSound();
    playChimeSound();
    onAccepted();

    // Heart explosion confetti
    const duration = 2.5 * 1000;
    const animationEnd = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff4d6d', '#ff758f', '#ffb3c1', '#d4af37'],
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff4d6d', '#ff758f', '#ffb3c1', '#d4af37'],
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleHesitateHover = () => {
    playCutePopSound();
    setHesitateCount((prev) => prev + 1);

    // If hovered multiple times, displace button
    if (hesitateCount < 3) {
      const randomX = (Math.random() - 0.5) * 160;
      const randomY = (Math.random() - 0.5) * 80;
      setHesitatePos({ x: randomX, y: randomY });
    }
  };

  // Google Calendar URL generator
  const getGoogleCalendarUrl = () => {
    const title = encodeURIComponent(`Свидание: ${invitation.question}`);
    const details = encodeURIComponent(
      `${invitation.message}\n\nДресс-код: ${invitation.dressCode}\nОт: ${invitation.sender}`
    );
    const location = encodeURIComponent(invitation.location);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  };

  // Share response via Telegram
  const getTelegramShareUrl = () => {
    const text = encodeURIComponent(
      `Я стёрла скретч-записку... и мой ответ: ДА, я с радостью пойду на свидание! ❤️\n\n«${invitation.question}»\n📍 ${invitation.location}\n🗓️ ${invitation.dateTime}`
    );
    return `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${text}`;
  };

  // Share response via WhatsApp
  const getWhatsAppShareUrl = () => {
    const text = encodeURIComponent(
      `Я стёрла скретч-записку... и мой ответ: ДА, я иду на свидание! ❤️\n«${invitation.question}»\n📍 ${invitation.location}\n🗓️ ${invitation.dateTime}`
    );
    return `https://wa.me/?text=${text}`;
  };

  if (isAccepted) {
    return (
      <div className="w-full max-w-lg mx-auto mt-6 p-6 rounded-2xl bg-gradient-to-br from-rose-950/80 via-[#260e18]/90 to-amber-950/70 border border-rose-500/30 backdrop-blur-md shadow-2xl text-center text-white">
        <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center">
          <Heart className="w-8 h-8 fill-rose-500 text-rose-500 animate-pulse" />
        </div>

        <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-rose-200 mb-1">
          Ура! Это свидание! ✨
        </h3>
        <p className="text-sm text-rose-100/80 mb-5 max-w-md mx-auto">
          Твой ответ принят. Теперь остаётся только считать часы до этой особенной встречи.
        </p>

        {/* Confirmed message */}
        <div className="py-2.5 px-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-sm font-semibold">
          Свидание официально подтверждено ❤️
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto mt-5 text-center">
      <p className="text-white/70 text-xs uppercase tracking-widest font-medium mb-3">
        Что ты ответишь?
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {/* Main enthusiastic YES */}
        <button
          type="button"
          onClick={triggerAcceptanceCelebration}
          className="group relative px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 hover:from-rose-500 hover:to-pink-500 text-white font-semibold text-sm sm:text-base shadow-lg shadow-rose-900/40 border border-rose-400/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          <Heart className="w-4 h-4 fill-white text-white group-hover:scale-125 transition-transform" />
          <span>Да, с удовольствием! 💕</span>
        </button>

        {/* Humorous YES button */}
        <button
          type="button"
          onClick={triggerAcceptanceCelebration}
          className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white/90 hover:text-white font-medium text-xs sm:text-sm border border-white/15 transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
        >
          <span>Конечно да! 🥰</span>
        </button>

        {/* Playful teasing / runaway button */}
        {hesitateCount < 3 ? (
          <button
            type="button"
            onMouseEnter={handleHesitateHover}
            onClick={handleHesitateHover}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white/80 text-xs border border-white/10 transition-transform duration-200"
            style={{
              transform: `translate(${hesitatePos.x}px, ${hesitatePos.y}px)`,
            }}
          >
            <span>Подумаю... 😏</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={triggerAcceptanceCelebration}
            className="px-5 py-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200 font-medium text-xs sm:text-sm transition-all animate-pulse"
          >
            <span>Ладно, сдаюсь — я согласна! 🙈💖</span>
          </button>
        )}
      </div>
    </div>
  );
};
