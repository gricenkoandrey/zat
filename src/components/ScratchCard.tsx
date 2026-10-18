import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Sparkles, RefreshCw, Eye, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DateInvitation, FoilStyle } from '../types/invitation';
import { playScratchSound, playChimeSound, playCutePopSound } from '../utils/audio';

interface ScratchCardProps {
  invitation: DateInvitation;
  onRevealComplete: () => void;
  isRevealed: boolean;
}

type ScratchTool = 'coin' | 'heart' | 'wand';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  opacity: number;
  rotation: number;
}

let scratchCardParticleId = 0;

export const ScratchCard: React.FC<ScratchCardProps> = ({
  invitation,
  onRevealComplete,
  isRevealed,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isScratchingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const strokeCountRef = useRef(0);

  const [percentage, setPercentage] = useState(0);
  const [selectedTool, setSelectedTool] = useState<ScratchTool>('coin');
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number; visible: boolean }>({
    x: 0,
    y: 0,
    visible: false,
  });
  const [particles, setParticles] = useState<Particle[]>([]);
  const [canvasReady, setCanvasReady] = useState(false);

  // Particle animation loop
  useEffect(() => {
    let animId: number;
    const updateParticles = () => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.15, // gravity
            opacity: p.opacity - 0.025,
            rotation: p.rotation + 4,
          }))
          .filter((p) => p.opacity > 0)
      );
      animId = requestAnimationFrame(updateParticles);
    };
    animId = requestAnimationFrame(updateParticles);
    return () => cancelAnimationFrame(animId);
  }, []);

  const spawnParticles = (x: number, y: number, foil: FoilStyle) => {
    const colors: Record<FoilStyle, string[]> = {
      rosegold: ['#ffd1dc', '#b76e79', '#fbf5b7', '#ffb6c1', '#e8a598'],
      gold: ['#ffd700', '#ffec8b', '#d4af37', '#ffffff', '#e6c66d'],
      silver: ['#ffffff', '#e0e0e0', '#c0c0c0', '#b8c5d6', '#f5f5f5'],
      amethyst: ['#e9d5ff', '#c084fc', '#d8b4fe', '#fdf4ff', '#a855f7'],
    };
    const palette = colors[foil] || colors.rosegold;

    const newParticles: Particle[] = [];
    const count = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: ++scratchCardParticleId,
        x,
        y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 1.2) * 3,
        color: palette[Math.floor(Math.random() * palette.length)],
        size: 2.5 + Math.random() * 3.5,
        opacity: 0.9,
        rotation: Math.random() * 360,
      });
    }

    setParticles((prev) => [...prev.slice(-35), ...newParticles]);
  };

  // Draw the foil cover
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    if (width === 0 || height === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(dpr, dpr);
    ctx.globalCompositeOperation = 'source-over';

    // Base foil background
    const grad = ctx.createLinearGradient(0, 0, width, height);
    if (invitation.foilStyle === 'rosegold') {
      grad.addColorStop(0, '#b76e79');
      grad.addColorStop(0.25, '#ffd1dc');
      grad.addColorStop(0.5, '#c47b85');
      grad.addColorStop(0.75, '#ffe4e9');
      grad.addColorStop(1, '#9b5862');
    } else if (invitation.foilStyle === 'gold') {
      grad.addColorStop(0, '#a3761c');
      grad.addColorStop(0.25, '#fef3a7');
      grad.addColorStop(0.5, '#b8860b');
      grad.addColorStop(0.75, '#fdf4a5');
      grad.addColorStop(1, '#8c6012');
    } else if (invitation.foilStyle === 'silver') {
      grad.addColorStop(0, '#8e9eab');
      grad.addColorStop(0.3, '#eef2f3');
      grad.addColorStop(0.6, '#b0bec5');
      grad.addColorStop(0.85, '#ffffff');
      grad.addColorStop(1, '#78909c');
    } else {
      // amethyst
      grad.addColorStop(0, '#4a2545');
      grad.addColorStop(0.3, '#c084fc');
      grad.addColorStop(0.6, '#6b21a8');
      grad.addColorStop(0.85, '#e9d5ff');
      grad.addColorStop(1, '#3b0764');
    }

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Add fine metallic shimmer noise/stippling
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    for (let i = 0; i < 400; i++) {
      const rx = Math.random() * width;
      const ry = Math.random() * height;
      const rad = Math.random() * 1.5;
      ctx.beginPath();
      ctx.arc(rx, ry, rad, 0, Math.PI * 2);
      ctx.fill();
    }

    // Outer and Inner Ornate Gold Border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(16, 16, width - 32, height - 32);
    ctx.setLineDash([]);

    // Corner decorative accents
    const drawCorner = (cx: number, cy: number, rot: number) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 14);
      ctx.lineTo(0, 0);
      ctx.lineTo(14, 0);
      ctx.stroke();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.beginPath();
      ctx.arc(4, 4, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    drawCorner(22, 22, 0);
    drawCorner(width - 22, 22, Math.PI / 2);
    drawCorner(width - 22, height - 22, Math.PI);
    drawCorner(22, height - 22, -Math.PI / 2);

    // Center emblem badge
    const badgeW = Math.min(280, width - 60);
    const badgeH = 110;
    const bx = (width - badgeW) / 2;
    const by = (height - badgeH) / 2;

    // Soft badge backing
    ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
    ctx.beginPath();
    ctx.roundRect(bx, by, badgeW, badgeH, 16);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Central Icon / Shimmer Text
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
    ctx.fillText('✨ СЕКРЕТНОЕ ПОСЛАНИЕ ✨', width / 2, by + 34);

    ctx.font = '500 14px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillText('Потри монеткой здесь, чтобы стереть слой', width / 2, by + 64);

    ctx.font = '12px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillText('🪙 проведи пальцем или мышкой', width / 2, by + 86);

    setPercentage(0);
    setCanvasReady(true);
  }, [invitation.foilStyle]);

  useEffect(() => {
    initCanvas();
    const handleResize = () => {
      initCanvas();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initCanvas]);

  // Calculate percentage cleared
  const checkScratchPercentage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.width;
      const height = canvas.height;

      // Sample every 24 pixels for high performance
      const step = Math.floor(20 * dpr);
      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;
      let transparentPixels = 0;
      let totalPixels = 0;

      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const idx = (y * width + x) * 4;
          const alpha = data[idx + 3];
          if (alpha < 60) {
            transparentPixels++;
          }
          totalPixels++;
        }
      }

      const percent = Math.min(100, Math.round((transparentPixels / totalPixels) * 100));
      setPercentage(percent);

      if (percent >= 60 && !isRevealed) {
        playChimeSound();
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#e07a5f', '#f4a261', '#ffd166', '#ff758f'],
        });
        onRevealComplete();
      }
    } catch {
      // Ignore security errors in sandboxes if any
    }
  }, [isRevealed, onRevealComplete]);

  // Scratch stroke handler
  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    if (x < 0 || x > rect.width || y < 0 || y > rect.height) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.globalCompositeOperation = 'destination-out';

    const brushRadius = selectedTool === 'coin' ? 24 : selectedTool === 'heart' ? 28 : 22;

    const drawCircle = (cx: number, cy: number) => {
      ctx.beginPath();
      ctx.arc(cx, cy, brushRadius, 0, Math.PI * 2);
      ctx.fill();
    };

    if (lastPointRef.current) {
      const p1 = lastPointRef.current;
      const p2 = { x, y };
      const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);

      // Interpolate along the line to prevent patchy dots
      const step = 6;
      for (let d = 0; d < dist; d += step) {
        const ix = p1.x + Math.cos(angle) * d;
        const iy = p1.y + Math.sin(angle) * d;
        drawCircle(ix, iy);
      }
      drawCircle(p2.x, p2.y);
    } else {
      drawCircle(x, y);
    }

    ctx.restore();
    lastPointRef.current = { x, y };

    // Emit sparks / dust particles
    spawnParticles(x, y, invitation.foilStyle);

    // Audio feedback
    playScratchSound();

    strokeCountRef.current += 1;
    if (strokeCountRef.current % 8 === 0) {
      checkScratchPercentage();
    }
  };

  // Pointer event handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    isScratchingRef.current = true;
    lastPointRef.current = null;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    scratch(e.clientX, e.clientY);
    setCursorPos({ x: e.clientX, y: e.clientY, visible: true });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    setCursorPos({ x: e.clientX, y: e.clientY, visible: true });
    if (!isScratchingRef.current) return;
    scratch(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isScratchingRef.current) {
      isScratchingRef.current = false;
      lastPointRef.current = null;
      checkScratchPercentage();
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Safe ignore
      }
    }
  };

  const handlePointerLeave = () => {
    isScratchingRef.current = false;
    lastPointRef.current = null;
    setCursorPos((prev) => ({ ...prev, visible: false }));
  };

  // Reveal all function
  const handleRevealAll = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    playChimeSound();
    playCutePopSound();

    // Clear entire canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setPercentage(100);
    onRevealComplete();

    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.55 },
      colors: ['#f43f5e', '#ec4899', '#fb7185', '#ffd700'],
    });
  };

  // Reset function
  const handleReset = () => {
    playCutePopSound();
    initCanvas();
  };

  return (
    <div className="relative w-full max-w-lg mx-auto select-none">
      {/* Tool Selector Bar */}
      <div className="flex items-center justify-between gap-2 px-3 py-2 mb-3 bg-[#1d141e]/90 backdrop-blur-md rounded-xl border border-white/10 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-white/60 font-medium">Инструмент:</span>
          <button
            type="button"
            onClick={() => {
              playCutePopSound();
              setSelectedTool('coin');
            }}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
              selectedTool === 'coin'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40 font-semibold'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>🪙</span>
            <span>Монета</span>
          </button>
          <button
            type="button"
            onClick={() => {
              playCutePopSound();
              setSelectedTool('heart');
            }}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
              selectedTool === 'heart'
                ? 'bg-rose-500/20 text-rose-200 border border-rose-500/40 font-semibold'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>💖</span>
            <span>Сердце</span>
          </button>
          <button
            type="button"
            onClick={() => {
              playCutePopSound();
              setSelectedTool('wand');
            }}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
              selectedTool === 'wand'
                ? 'bg-purple-500/20 text-purple-200 border border-purple-500/40 font-semibold'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>🪄</span>
            <span>Магия</span>
          </button>
        </div>

        {/* Progress % */}
        <div className="flex items-center gap-2">
          <div className="text-[11px] text-white/70">
            Стерто: <span className="text-amber-300 font-semibold tabular-nums">{percentage}%</span>
          </div>
          {percentage >= 25 && percentage < 100 && (
            <button
              type="button"
              onClick={handleRevealAll}
              className="text-[11px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-200 border border-rose-500/30 hover:bg-rose-500/30 transition-colors flex items-center gap-1"
            >
              <Eye className="w-3 h-3" />
              <span>Открыть</span>
            </button>
          )}
          {percentage > 0 && (
            <button
              type="button"
              onClick={handleReset}
              title="Заново затереть"
              className="p-1 text-white/50 hover:text-white hover:bg-white/10 rounded transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Card Container */}
      <div
        ref={containerRef}
        className="relative w-full aspect-[4/5] sm:aspect-[4/4.8] rounded-2xl shadow-2xl overflow-hidden border border-[#d4af37]/40 bg-[#fdfaf5] transition-all"
        style={{
          boxShadow: '0 20px 50px -10px rgba(0, 0, 0, 0.7), 0 0 25px rgba(212, 175, 55, 0.15)',
        }}
      >
        {/* UNDERNEATH LAYER: The Revealed Date Invitation Note */}
        <div className="absolute inset-0 p-5 sm:p-7 flex flex-col justify-between paper-pattern text-slate-800">
          {/* Ornate Gold Border and Corners inside note */}
          <div className="absolute inset-3 sm:inset-4 border border-[#d4af37]/40 pointer-events-none rounded-xl" />
          <div className="absolute inset-4 sm:inset-5 border border-dashed border-[#d4af37]/25 pointer-events-none rounded-lg" />

          {/* Top greeting */}
          <div className="relative z-10 text-center pt-2">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="h-[1px] w-8 bg-[#d4af37]/60" />
              <span className="text-[#a47e24] text-xs uppercase tracking-widest font-medium">
                Особенное послание
              </span>
              <span className="h-[1px] w-8 bg-[#d4af37]/60" />
            </div>
            <h2 className="font-handwriting text-2xl sm:text-3xl text-rose-800 font-bold tracking-wide">
              {invitation.to || 'Для самой особенной ✨'}
            </h2>
          </div>

          {/* Center Question & Proposal */}
          <div className="relative z-10 text-center my-auto py-2">
            <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-[40px] text-slate-900 font-bold leading-tight mb-3">
              {invitation.question}
            </h1>
            <p className="text-slate-600 text-sm sm:text-base italic leading-relaxed max-w-sm mx-auto font-serif-luxury">
              «{invitation.message}»
            </p>
          </div>

          {/* Date Details Grid */}
          <div className="relative z-10 bg-white/70 backdrop-blur-xs p-3.5 sm:p-4 rounded-xl border border-[#d4af37]/30 text-xs sm:text-sm space-y-2">
            <div className="flex items-start gap-2.5">
              <span className="text-base leading-none">🗓️</span>
              <div>
                <span className="text-slate-500 font-medium">Когда: </span>
                <span className="text-slate-800 font-semibold">{invitation.dateTime}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="text-base leading-none">📍</span>
              <div>
                <span className="text-slate-500 font-medium">Где: </span>
                <span className="text-slate-800 font-semibold">{invitation.location}</span>
              </div>
            </div>

            {invitation.dressCode && (
              <div className="flex items-start gap-2.5">
                <span className="text-base leading-none">👗</span>
                <div>
                  <span className="text-slate-500 font-medium">Дресс-код: </span>
                  <span className="text-slate-800 font-semibold">{invitation.dressCode}</span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom signature */}
          <div className="relative z-10 text-center pb-1">
            <p className="font-handwriting text-lg text-slate-700">
              С любовью, {invitation.sender}
            </p>
          </div>
        </div>

        {/* OVERLAY LAYER: Canvas Scratch Foil */}
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerLeave={handlePointerLeave}
          className="absolute inset-0 w-full h-full z-20 cursor-grab active:cursor-grabbing touch-none transition-opacity duration-700"
          style={{
            opacity: percentage >= 95 ? 0 : 1,
            pointerEvents: percentage >= 95 ? 'none' : 'auto',
          }}
        />

        {/* Sparkle particles coming off scratch */}
        <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute rounded-full shadow-sm"
              style={{
                left: `${p.x}px`,
                top: `${p.y}px`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                backgroundColor: p.color,
                opacity: p.opacity,
                transform: `rotate(${p.rotation}deg)`,
                boxShadow: `0 0 6px ${p.color}`,
              }}
            />
          ))}
        </div>

        {/* Subtle Shimmer Ray over Foil */}
        {percentage < 90 && (
          <div className="absolute inset-0 pointer-events-none z-25 overflow-hidden">
            <div className="absolute -inset-full w-[200%] h-[200%] bg-gradient-to-r from-transparent via-white/15 to-transparent animate-shimmer" />
          </div>
        )}
      </div>

      {/* Helper Scratch Hint */}
      {percentage === 0 && canvasReady && (
        <div className="text-center mt-3 animate-bounce text-xs text-amber-200/80 font-medium flex items-center justify-center gap-1.5">
          <span>👇 Нажми и води по открытке, чтобы стереть фольгу</span>
        </div>
      )}
    </div>
  );
};
