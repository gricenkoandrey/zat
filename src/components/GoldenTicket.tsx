import React from 'react';
import { DateInvitation } from '../types/invitation';
import { Check, Calendar } from 'lucide-react';
import { downloadIcsCalendarEvent } from '../utils/calendar';

interface GoldenTicketProps {
  invitation: DateInvitation;
}

export const GoldenTicket: React.FC<GoldenTicketProps> = ({ invitation }) => {
  return (
    <div className="w-full max-w-md mx-auto mt-5 animate-fade-in select-none">
      {/* Hogwarts Express Platform 9¾ Authentic Enchanted Ticket */}
      <div
        className="relative rounded-2xl p-5 sm:p-6 text-white overflow-hidden shadow-2xl border-2 border-amber-400/60 bg-[#150f22]"
        style={{
          boxShadow: '0 25px 60px -10px rgba(0,0,0,0.95), 0 0 35px rgba(251, 191, 36, 0.35)',
        }}
      >
        {/* Perforated ticket punch cutouts on sides */}
        <div className="absolute top-1/2 -left-3.5 -translate-y-1/2 w-7 h-7 rounded-full bg-[#0d0914] shadow-inner" />
        <div className="absolute top-1/2 -right-3.5 -translate-y-1/2 w-7 h-7 rounded-full bg-[#0d0914] shadow-inner" />

        {/* Ornate Gold Border Inner Inset */}
        <div className="absolute inset-2 sm:inset-2.5 border border-amber-400/30 rounded-xl pointer-events-none" />

        {/* Ticket Header */}
        <div className="relative z-10 flex items-center justify-between border-b border-amber-400/20 pb-3 mb-3.5">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-cinzel text-base font-bold shadow-sm">
              ⚡
            </span>
            <div>
              <span className="text-[10px] uppercase font-cinzel font-bold tracking-[0.2em] text-amber-300 block">
                LONDON TO HOGSMEADE • PLATFORM 9¾
              </span>
              <h3 className="font-magical text-lg sm:text-xl font-bold text-amber-100 leading-tight">
                БИЛЕТ НА ВОЛШЕБНОЕ СВИДАНИЕ
              </h3>
            </div>
          </div>
          <div className="text-right">
            <span className="font-cinzel text-sm font-bold text-amber-300 bg-amber-500/20 px-2.5 py-1 rounded border border-amber-400/40">
              № 9¾
            </span>
          </div>
        </div>

        {/* Main Details */}
        <div className="relative z-10 space-y-2.5">
          {/* Guest Name in beautiful Quill ink */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white/[0.04] p-3 rounded-xl border border-amber-400/20">
            <div className="flex-1 min-w-0">
              <span className="text-[10px] text-amber-300/80 font-magical italic block">
                Выдан для:
              </span>
              <p className="font-quill text-2xl sm:text-3xl text-amber-100 leading-tight drop-shadow-sm break-words">
                {invitation.to}
              </p>
            </div>
            <div className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-cinzel text-[10px] font-bold shrink-0 self-start sm:self-center">
              FIRST CLASS ✨
            </div>
          </div>

          {/* Date & Location Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-white/[0.04] p-2.5 rounded-lg border border-amber-400/20">
            <div>
              <span className="text-[10px] text-amber-300/80 font-press uppercase tracking-wider block">
                КОГДА
              </span>
              <span className="text-amber-100 font-magical font-bold text-sm block mt-0.5 break-words">
                {invitation.dateTime}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-amber-300/80 font-press uppercase tracking-wider block">
                ЛОКАЦИЯ
              </span>
              <span className="text-amber-100 font-magical font-bold text-sm block mt-0.5 break-words">
                {invitation.location}
              </span>
            </div>
          </div>

          {/* Dresscode if present */}
          {invitation.dressCode && (
            <div className="text-xs bg-white/[0.04] p-2.5 rounded-lg border border-amber-400/20 flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
              <span className="text-amber-300 font-magical italic font-semibold shrink-0">
                Мантия / Дресс-код:
              </span>
              <span className="text-amber-100 font-medium break-words leading-snug flex-1">
                {invitation.dressCode}
              </span>
            </div>
          )}

          {/* Romantic handwritten promise */}
          <div className="pt-1 text-center">
            <p className="text-amber-200/90 font-quill text-base sm:text-lg leading-relaxed break-words">
              «{invitation.message || '11 число в 3 часа ночи — навсегда наш момент. Я тебя очень люблю!'}»
            </p>
          </div>
        </div>

        {/* Calendar integration button */}
        <div className="relative z-10 mt-3 pt-2 border-t border-amber-400/20 flex justify-center">
          <button
            type="button"
            onClick={() => downloadIcsCalendarEvent(invitation.to)}
            className="w-full py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 text-xs font-cinzel font-bold flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02] active:scale-95 shadow-md"
            title="Добавить свидание в Google / Apple календарь"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-300" />
            <span>Добавить в календарь: 11 число • 03:00</span>
          </button>
        </div>

        {/* Footer & Status */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 mt-3 border-t border-amber-400/20">
          <div className="text-left flex items-center flex-wrap gap-1 min-w-0">
            <span className="text-xs font-magical italic text-amber-300/80 shrink-0">
              Приглашает:
            </span>
            <span className="font-quill text-lg sm:text-xl font-bold text-rose-300 break-words leading-tight">
              {invitation.sender} 🪄
            </span>
          </div>

          <div className="px-3 py-1 rounded-lg border border-emerald-400/50 bg-emerald-500/15 text-emerald-300 text-xs font-cinzel font-bold uppercase flex items-center gap-1 shadow-sm">
            <Check className="w-3.5 h-3.5" />
            <span>ВХОД РАЗРЕШЁН</span>
          </div>
        </div>

        {/* Vintage Steam Express Stamp Bar */}
        <div className="relative z-10 mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-amber-200/50">
          <div className="font-cinzel text-[10px] tracking-[0.25em]">
            ||| | |||| || | ||||| ||| || ||||
          </div>
          <span className="font-cinzel text-[10px] tracking-wider">
            PLATFORM 9¾ • HOGSMEADE
          </span>
        </div>
      </div>
    </div>
  );
};
