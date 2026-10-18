import React, { useEffect, useRef } from 'react';
import { X, Sparkles, Wand2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playChimeSound, playCutePopSound } from '../utils/audio';

interface PatronusSpellProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PatronusSpell: React.FC<PatronusSpellProps> = ({ isOpen, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    playChimeSound();
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.4 },
      colors: ['#38bdf8', '#bae6fd', '#ffffff', '#7dd3fc', '#ffd700'],
    });

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Ethereal silver-cyan luminous wisp particles
    interface Wisp {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      life: number;
      decay: number;
    }

    const wisps: Wisp[] = [];
    let rabbitX = width * 0.15;
    let rabbitY = height * 0.55;
    let rabbitVx = 3.2;
    let rabbitAngle = 0;

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Rabbit moves across the sky in a gentle leaping sinusoidal arc
      rabbitX += rabbitVx;
      rabbitY = height * 0.52 + Math.sin(frame * 0.05) * 45;
      rabbitAngle = Math.cos(frame * 0.05) * 0.18;

      if (rabbitX > width + 100) {
        rabbitX = -100;
      }

      // Emit luminous silver-blue stardust trail behind the Patronus rabbit
      for (let i = 0; i < 3; i++) {
        wisps.push({
          x: rabbitX - 20 + (Math.random() - 0.5) * 15,
          y: rabbitY + (Math.random() - 0.5) * 20,
          vx: -(Math.random() * 2 + 1),
          vy: (Math.random() - 0.5) * 1.5,
          size: Math.random() * 5 + 2,
          alpha: 0.9,
          life: 1,
          decay: 0.016 + Math.random() * 0.015,
        });
      }

      // Draw wisps
      for (let i = wisps.length - 1; i >= 0; i--) {
        const w = wisps[i];
        w.x += w.vx;
        w.y += w.vy;
        w.alpha -= w.decay;

        if (w.alpha <= 0) {
          wisps.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = w.alpha;
        ctx.fillStyle = '#bae6fd';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 12;

        ctx.beginPath();
        ctx.arc(w.x, w.y, w.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Draw Glowing Silver Rabbit Patronus
      ctx.save();
      ctx.translate(rabbitX, rabbitY);
      ctx.rotate(rabbitAngle);

      // Huge ethereal moonlit aura
      const aura = ctx.createRadialGradient(0, 0, 10, 0, 0, 120);
      aura.addColorStop(0, 'rgba(224, 242, 254, 0.85)');
      aura.addColorStop(0.35, 'rgba(56, 189, 248, 0.45)');
      aura.addColorStop(0.7, 'rgba(14, 165, 233, 0.15)');
      aura.addColorStop(1, 'rgba(14, 165, 233, 0)');
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(0, 0, 120, 0, Math.PI * 2);
      ctx.fill();

      // Silver Rabbit Body
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 25;

      // Torso
      ctx.beginPath();
      ctx.ellipse(0, 0, 36, 22, -0.2, 0, Math.PI * 2);
      ctx.fill();

      // Head
      ctx.beginPath();
      ctx.arc(28, -12, 16, 0, Math.PI * 2);
      ctx.fill();

      // Long Ethereal Ears
      ctx.beginPath();
      ctx.ellipse(34, -32, 7, 20, 0.3, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(25, -34, 6, 20, -0.1, 0, Math.PI * 2);
      ctx.fill();

      // Front leaping paws
      const pawKick = Math.sin(frame * 0.1) * 8;
      ctx.beginPath();
      ctx.ellipse(22, 18 + pawKick, 6, 14, 0.4, 0, Math.PI * 2);
      ctx.fill();

      // Back leaping legs
      ctx.beginPath();
      ctx.ellipse(-26, 14 - pawKick, 10, 20, -0.5, 0, Math.PI * 2);
      ctx.fill();

      // Fluffy Tail
      ctx.beginPath();
      ctx.arc(-36, -4, 9, 0, Math.PI * 2);
      ctx.fill();

      // Radiant Blue Eye
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.arc(33, -14, 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between p-4 sm:p-8 select-none overflow-hidden">
      {/* Night sky backdrop with cosmic cyan aura */}
      <div
        className="fixed inset-0 bg-[#080d1a]/90 backdrop-blur-md transition-opacity duration-700"
        onClick={onClose}
      />

      {/* Canvas for animated leaping Patronus Rabbit */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10" />

      {/* Top Bar with close */}
      <div className="relative z-20 w-full max-w-2xl flex items-center justify-between pt-2">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-950/80 border border-sky-400/40 text-sky-200 text-xs font-cinzel font-bold shadow-lg">
          <Wand2 className="w-3.5 h-3.5 text-sky-300 animate-pulse" />
          <span>ЗАКЛИНАНИЕ ВЫСШЕЙ ЛЮБВИ</span>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-full bg-sky-950/80 hover:bg-sky-900 border border-sky-400/40 text-sky-200 transition-all hover:scale-105"
          title="Скрыть заклинание"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Central Whisper of Love */}
      <div className="relative z-20 text-center max-w-md my-auto px-4 py-6 rounded-3xl bg-black/60 border border-sky-400/30 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_40px_rgba(56,189,248,0.25)]">
        <span className="text-[11px] font-cinzel tracking-[0.3em] uppercase text-sky-300 font-bold block mb-1">
          ✦ EXPECTO PATRONUM ✦
        </span>
        <h2 className="font-magical text-3xl sm:text-4xl font-extrabold text-white drop-shadow-[0_0_20px_rgba(56,189,248,0.8)]">
          Серебряная Заюшка
        </h2>
        <p className="font-quill text-lg sm:text-xl text-sky-150 text-sky-100 mt-2 leading-relaxed italic">
          «Патронус рождается из самого счастливого воспоминания на свете...»
        </p>
        <p className="font-quill text-base text-amber-200/90 mt-1.5 leading-snug">
          Ночь 11 числа в 3:00 ночи. Голубоглазая кудрявая заюшка, я тебя очень сильно люблю! 💙
        </p>

        <button
          type="button"
          onClick={() => {
            playCutePopSound();
            onClose();
          }}
          className="mt-5 px-6 py-2.5 rounded-full bg-gradient-to-r from-sky-600 via-sky-500 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-cinzel text-xs font-bold uppercase tracking-wider shadow-lg shadow-sky-900/50 border border-sky-300/50 transition-all hover:scale-105 active:scale-95"
        >
          Lumos Maxima ✨
        </button>
      </div>

      <div className="relative z-20 text-sky-300/50 text-[11px] font-cinzel tracking-widest pb-2">
        HOGWARTS • ПАТРОНУС ЧИСТОЙ ЛЮБВИ
      </div>
    </div>
  );
};
