import React, { useEffect, useRef } from 'react';

interface Sparkle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  isStar: boolean;
}

interface FloatingEmber {
  x: number;
  y: number;
  vy: number;
  vx: number;
  size: number;
  alpha: number;
  pulseSpeed: number;
  pulseOffset: number;
}

export const HogwartsMagicCursor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparklesRef = useRef<Sparkle[]>([]);
  const embersRef = useRef<FloatingEmber[]>([]);
  const lastMouseRef = useRef<{ x: number; y: number; time: number } | null>(null);

  useEffect(() => {
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

    // Initialize gentle background floating magical embers (like Hogwarts Great Hall floating candle sparks)
    const emberColors = ['#fef08a', '#fbbf24', '#fde047', '#fed7aa', '#ffffff'];
    embersRef.current = Array.from({ length: 28 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vy: -(0.25 + Math.random() * 0.45),
      vx: (Math.random() - 0.5) * 0.25,
      size: 1 + Math.random() * 2.5,
      alpha: 0.15 + Math.random() * 0.45,
      pulseSpeed: 0.02 + Math.random() * 0.03,
      pulseOffset: Math.random() * Math.PI * 2,
    }));

    const goldPalette = [
      '#fef08a', // Pale gold
      '#fde047', // Glowing yellow gold
      '#fbbf24', // Amber gold
      '#f59e0b', // Deep warm gold
      '#ffffff', // Pure white starlight
      '#fed7aa', // Champagne peach
    ];

    const spawnWandSparkles = (x: number, y: number, speed: number) => {
      const count = Math.min(6, Math.max(2, Math.floor(speed * 0.18) + 2));
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const velocity = (Math.random() * 2.5 + 0.8) * Math.min(speed * 0.04 + 1, 2.5);
        sparklesRef.current.push({
          x: x + (Math.random() - 0.5) * 6,
          y: y + (Math.random() - 0.5) * 6,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity - 0.4, // Slight upward float
          size: Math.random() * 3.5 + 1.2,
          alpha: 1,
          decay: 0.018 + Math.random() * 0.022,
          color: goldPalette[Math.floor(Math.random() * goldPalette.length)],
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.12,
          isStar: Math.random() > 0.45,
        });
      }

      // Cap sparkle count for smooth 60fps
      if (sparklesRef.current.length > 120) {
        sparklesRef.current.splice(0, sparklesRef.current.length - 120);
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      const now = performance.now();
      const current = { x: e.clientX, y: e.clientY };

      let speed = 5;
      if (lastMouseRef.current) {
        const dist = Math.hypot(current.x - lastMouseRef.current.x, current.y - lastMouseRef.current.y);
        const dt = Math.max(1, now - lastMouseRef.current.time);
        speed = (dist / dt) * 15;
      }

      lastMouseRef.current = { x: current.x, y: current.y, time: now };
      spawnWandSparkles(current.x, current.y, speed);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    // Helper to draw a sparkling 4-pointed Hogwarts stardust star
    const drawFourPointStar = (
      context: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      spikes: number,
      outerRadius: number,
      innerRadius: number
    ) => {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      context.beginPath();
      context.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        context.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        context.lineTo(x, y);
        rot += step;
      }
      context.lineTo(cx, cy - outerRadius);
      context.closePath();
      context.fill();
    };

    let tick = 0;
    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // 1. Render gentle floating Hogwarts ambient candle embers
      embersRef.current.forEach((ember) => {
        ember.y += ember.vy;
        ember.x += ember.vx + Math.sin(tick * 0.02 + ember.pulseOffset) * 0.2;
        if (ember.y < -10) {
          ember.y = height + 10;
          ember.x = Math.random() * width;
        }

        const currentAlpha =
          ember.alpha * (0.6 + 0.4 * Math.sin(tick * ember.pulseSpeed + ember.pulseOffset));

        // Soft glow halo
        ctx.beginPath();
        const rad = ember.size * 2.2;
        const grad = ctx.createRadialGradient(
          ember.x,
          ember.y,
          0,
          ember.x,
          ember.y,
          rad
        );
        grad.addColorStop(0, `rgba(254, 240, 138, ${currentAlpha})`);
        grad.addColorStop(1, 'rgba(251, 191, 36, 0)');
        ctx.fillStyle = grad;
        ctx.arc(ember.x, ember.y, rad, 0, Math.PI * 2);
        ctx.fill();

        // Bright ember core
        ctx.beginPath();
        ctx.arc(ember.x, ember.y, ember.size * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha})`;
        ctx.fill();
      });

      // 2. Render Wand Stardust Trail (following cursor)
      const activeSparkles: Sparkle[] = [];
      for (let i = 0; i < sparklesRef.current.length; i++) {
        const s = sparklesRef.current[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.04; // Gentle gravity
        s.alpha -= s.decay;
        s.rotation += s.rotationSpeed;

        if (s.alpha > 0) {
          ctx.save();
          ctx.translate(s.x, s.y);
          ctx.rotate(s.rotation);

          // Golden glow
          ctx.shadowBlur = s.size * 3.5;
          ctx.shadowColor = s.color;
          ctx.fillStyle = s.color;
          ctx.globalAlpha = Math.max(0, s.alpha);

          if (s.isStar) {
            drawFourPointStar(ctx, 0, 0, 4, s.size * 1.8, s.size * 0.45);
          } else {
            ctx.beginPath();
            ctx.arc(0, 0, s.size, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
          activeSparkles.push(s);
        }
      }
      sparklesRef.current = activeSparkles;

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-40 select-none"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
