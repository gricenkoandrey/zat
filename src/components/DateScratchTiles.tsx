import React, { useRef, useEffect, useState, useCallback } from 'react';
import { playScratchSound } from '../utils/audio';

interface DateScratchTilesProps {
  dayText: string;
  monthText: string;
  timeOrPlaceText: string;
  onAllRevealed?: () => void;
}

interface TileCanvasProps {
  label: string;
  revealedContent: string;
  subLabel?: string;
  onRevealed?: () => void;
}

const SingleScratchTile: React.FC<TileCanvasProps> = ({
  label,
  revealedContent,
  subLabel,
  onRevealed,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isScratchingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  const initTile = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const w = rect.width || 90;
    const h = rect.height || 100;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    // Champagne gold satin gradient
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#e8cf8d');
    grad.addColorStop(0.3, '#fff4cc');
    grad.addColorStop(0.6, '#d9b362');
    grad.addColorStop(1, '#c49a44');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Shimmer stippling
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    for (let i = 0; i < 60; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 1;
    ctx.strokeRect(4, 4, w - 8, h - 8);

    // Subtle label on unscratched foil
    ctx.fillStyle = '#6e511e';
    ctx.font = 'bold 9px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✦ ПОТРИ ✦', w / 2, h / 2);
  }, []);

  useEffect(() => {
    initTile();
    window.addEventListener('resize', initTile);
    return () => window.removeEventListener('resize', initTile);
  }, [initTile]);

  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.globalCompositeOperation = 'destination-out';

    const radius = 22;
    const drawPoint = (px: number, py: number) => {
      ctx.beginPath();
      ctx.arc(px, py, radius, 0, Math.PI * 2);
      ctx.fill();
    };

    if (lastPointRef.current) {
      const p1 = lastPointRef.current;
      const dist = Math.hypot(x - p1.x, y - p1.y);
      const angle = Math.atan2(y - p1.y, x - p1.x);
      const step = 3;
      for (let d = 0; d < dist; d += step) {
        drawPoint(p1.x + Math.cos(angle) * d, p1.y + Math.sin(angle) * d);
      }
      drawPoint(x, y);
    } else {
      drawPoint(x, y);
    }

    ctx.restore();
    lastPointRef.current = { x, y };
    playScratchSound();

    // Check completion
    if (!isRevealed) {
      try {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        let transparent = 0;
        let total = 0;
        const step = Math.floor(8 * dpr);
        for (let py = 0; py < canvas.height; py += step) {
          for (let px = 0; px < canvas.width; px += step) {
            const idx = (py * canvas.width + px) * 4;
            if (data[idx + 3] < 80) transparent++;
            total++;
          }
        }
        if (transparent / total > 0.45) {
          setIsRevealed(true);
          onRevealed?.();
        }
      } catch {
        // ignore
      }
    }
  };

  return (
    <div className="flex flex-col items-center select-none">
      <div className="relative w-20 h-24 sm:w-24 sm:h-28 rounded-2xl bg-[#fffefc] shadow-md border border-amber-200/60 overflow-hidden flex flex-col items-center justify-center p-2 text-center">
        {/* Revealed Content underneath */}
        <span className="text-[9px] uppercase tracking-wider text-amber-800 font-serif font-bold">
          {label}
        </span>
        <span className="text-xl sm:text-2xl font-serif text-slate-900 font-extrabold my-0.5 leading-none">
          {revealedContent}
        </span>
        {subLabel && (
          <span className="text-[8px] text-amber-700/80 font-serif uppercase">
            {subLabel}
          </span>
        )}

        {/* Scratchable Canvas on top */}
        <canvas
          ref={canvasRef}
          onPointerDown={(e) => {
            isScratchingRef.current = true;
            lastPointRef.current = null;
            (e.target as HTMLElement).setPointerCapture(e.pointerId);
            scratch(e.clientX, e.clientY);
          }}
          onPointerMove={(e) => {
            if (!isScratchingRef.current) return;
            scratch(e.clientX, e.clientY);
          }}
          onPointerUp={() => {
            isScratchingRef.current = false;
            lastPointRef.current = null;
          }}
          onPointerCancel={() => {
            isScratchingRef.current = false;
            lastPointRef.current = null;
          }}
          className={`absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing touch-none transition-opacity duration-500 ${
            isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        />
      </div>
      <span className="text-[10px] text-amber-900/70 font-serif uppercase tracking-widest mt-1.5 font-semibold">
        {label}
      </span>
    </div>
  );
};

export const DateScratchTiles: React.FC<DateScratchTilesProps> = ({
  dayText,
  monthText,
  timeOrPlaceText,
  onAllRevealed,
}) => {
  const [revealedCount, setRevealedCount] = useState(0);

  const handleTileRevealed = () => {
    setRevealedCount((prev) => {
      const next = prev + 1;
      if (next >= 3) {
        onAllRevealed?.();
      }
      return next;
    });
  };

  return (
    <div className="w-full my-4 text-center">
      <div className="mb-2">
        <h4 className="font-serif italic text-lg sm:text-xl text-amber-950">
          The Date
        </h4>
        <p className="text-[11px] font-serif text-amber-800/80 uppercase tracking-widest">
          ✦ Scratch to reveal the date ✦
        </p>
      </div>

      <div className="flex items-center justify-center gap-3 sm:gap-4 mt-3">
        <SingleScratchTile
          label="День"
          revealedContent={dayText || '14'}
          subLabel="DATE"
          onRevealed={handleTileRevealed}
        />
        <SingleScratchTile
          label="Месяц"
          revealedContent={monthText || 'Февраля'}
          subLabel="MONTH"
          onRevealed={handleTileRevealed}
        />
        <SingleScratchTile
          label="Время"
          revealedContent={timeOrPlaceText || '19:00'}
          subLabel="TIME"
          onRevealed={handleTileRevealed}
        />
      </div>
    </div>
  );
};
