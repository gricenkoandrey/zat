import React, { useEffect, useRef } from 'react';

interface Particle {
  type: 'snitch' | 'bird' | 'envelope' | 'star' | 'feather' | 'sparkle';
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  angle: number;
  wingAngle: number;
  wingSpeed: number;
  color: string;
  opacity: number;
  scale: number;
  swayFreq: number;
  swayAmp: number;
  timeOffset: number;
}

export const HogwartsFloatingMagic: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    // Create magical entities:
    // 2 Golden Snitches flying fast with fluttering golden wings
    // 5-6 Magical White/Golden Hedwig Courier Birds gliding softly
    // 4 Floating Wax-Sealed Hogwarts Letters drifting gently
    // 8 Floating Glowing Magic Feathers
    // 16 Drifting Golden Starlight Orbs
    const particles: Particle[] = [];

    // 1. Golden Snitches
    for (let i = 0; i < 2; i++) {
      particles.push({
        type: 'snitch',
        x: Math.random() * width,
        y: Math.random() * (height * 0.7) + 50,
        vx: (Math.random() > 0.5 ? 1 : -1) * (1.8 + Math.random() * 1.5),
        vy: (Math.random() - 0.5) * 1.2,
        size: 9,
        angle: 0,
        wingAngle: 0,
        wingSpeed: 0.35 + Math.random() * 0.1,
        color: '#facc15',
        opacity: 0.9,
        scale: 1,
        swayFreq: 0.04,
        swayAmp: 2.5,
        timeOffset: Math.random() * 100,
      });
    }

    // 2. Flying Magical Birds / Snowy Courier Birds
    for (let i = 0; i < 5; i++) {
      const dir = Math.random() > 0.3 ? 1 : -1;
      particles.push({
        type: 'bird',
        x: Math.random() * width,
        y: Math.random() * (height * 0.8) + 40,
        vx: dir * (0.8 + Math.random() * 0.8),
        vy: (Math.random() - 0.5) * 0.4,
        size: 14 + Math.random() * 6,
        angle: 0,
        wingAngle: 0,
        wingSpeed: 0.12 + Math.random() * 0.05,
        color: '#f8fafc',
        opacity: 0.75 + Math.random() * 0.25,
        scale: 1,
        swayFreq: 0.02,
        swayAmp: 1.2,
        timeOffset: Math.random() * 100,
      });
    }

    // 3. Floating Hogwarts Envelopes with Wax Seal
    for (let i = 0; i < 4; i++) {
      particles.push({
        type: 'envelope',
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -(0.3 + Math.random() * 0.4), // gently floating up/down
        size: 18 + Math.random() * 6,
        angle: (Math.random() - 0.5) * 0.3,
        wingAngle: 0,
        wingSpeed: 0,
        color: '#fef3c7',
        opacity: 0.7 + Math.random() * 0.25,
        scale: 1,
        swayFreq: 0.015,
        swayAmp: 0.8,
        timeOffset: Math.random() * 100,
      });
    }

    // 4. Floating Enchanted Feathers
    for (let i = 0; i < 6; i++) {
      particles.push({
        type: 'feather',
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: 0.35 + Math.random() * 0.4, // gently drifting downwards
        size: 12 + Math.random() * 6,
        angle: Math.random() * Math.PI,
        wingAngle: 0,
        wingSpeed: 0,
        color: '#fed7aa',
        opacity: 0.6 + Math.random() * 0.3,
        scale: 1,
        swayFreq: 0.02,
        swayAmp: 1.5,
        timeOffset: Math.random() * 100,
      });
    }

    // 5. Lumos Starlight Magic Orbs
    for (let i = 0; i < 18; i++) {
      particles.push({
        type: 'star',
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(0.2 + Math.random() * 0.5),
        size: 2 + Math.random() * 3,
        angle: 0,
        wingAngle: 0,
        wingSpeed: 0,
        color: Math.random() > 0.4 ? '#fde047' : '#f472b6',
        opacity: 0.4 + Math.random() * 0.5,
        scale: 1,
        swayFreq: 0.03,
        swayAmp: 0.6,
        timeOffset: Math.random() * 100,
      });
    }

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.timeOffset += 0.02;
        p.wingAngle += p.wingSpeed;

        // Position updates
        p.x += p.vx + Math.sin(p.timeOffset * 2) * p.swayAmp * 0.3;
        p.y += p.vy + Math.cos(p.timeOffset) * p.swayAmp * 0.4;

        // Wrap around boundaries smoothly
        if (p.x < -60) p.x = width + 50;
        if (p.x > width + 60) p.x = -50;
        if (p.y < -60) p.y = height + 50;
        if (p.y > height + 60) p.y = -50;

        ctx.save();
        ctx.globalAlpha = p.opacity;

        // DRAW PARTICLES BASED ON TYPE
        if (p.type === 'snitch') {
          // GOLDEN SNITCH
          ctx.translate(p.x, p.y);
          // Facing direction
          const dir = p.vx >= 0 ? 1 : -1;
          ctx.scale(dir, 1);

          // Golden glow
          const snitchGlow = ctx.createRadialGradient(0, 0, 1, 0, 0, p.size * 2.5);
          snitchGlow.addColorStop(0, 'rgba(254, 240, 138, 0.9)');
          snitchGlow.addColorStop(0.5, 'rgba(234, 179, 8, 0.4)');
          snitchGlow.addColorStop(1, 'rgba(234, 179, 8, 0)');
          ctx.fillStyle = snitchGlow;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 2.5, 0, Math.PI * 2);
          ctx.fill();

          // Golden Body with shine
          const bodyGrad = ctx.createRadialGradient(-2, -2, 1, 0, 0, p.size);
          bodyGrad.addColorStop(0, '#ffffff');
          bodyGrad.addColorStop(0.4, '#fde047');
          bodyGrad.addColorStop(0.8, '#eab308');
          bodyGrad.addColorStop(1, '#a16207');
          ctx.fillStyle = bodyGrad;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();

          // Delicate Flapping Silver-Gold Wings
          const wingFlap = Math.sin(p.wingAngle) * 0.65;

          // Upper Wing
          ctx.save();
          ctx.translate(-2, -3);
          ctx.rotate(-0.4 + wingFlap);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.strokeStyle = '#fde047';
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(-15, -12, -28, -8, -32, -4);
          ctx.bezierCurveTo(-22, 1, -10, 2, 0, 0);
          ctx.fill();
          ctx.stroke();
          ctx.restore();

          // Lower Wing
          ctx.save();
          ctx.translate(-2, 2);
          ctx.rotate(0.3 - wingFlap * 0.7);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
          ctx.strokeStyle = '#fde047';
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(-14, 8, -26, 6, -30, 2);
          ctx.bezierCurveTo(-20, -1, -8, 0, 0, 0);
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        } else if (p.type === 'bird') {
          // MAGICAL FLYING WHITE OWL / BIRDS (Hedwig)
          ctx.translate(p.x, p.y);
          const dir = p.vx >= 0 ? 1 : -1;
          ctx.scale(dir, 1);

          // Soft aura
          ctx.shadowColor = 'rgba(254, 243, 199, 0.6)';
          ctx.shadowBlur = 12;

          const flap = Math.sin(p.wingAngle) * 0.55;

          // Body
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 0.75, p.size * 0.42, 0.1, 0, Math.PI * 2);
          ctx.fill();

          // Head & Beak
          ctx.beginPath();
          ctx.arc(p.size * 0.6, -p.size * 0.1, p.size * 0.32, 0, Math.PI * 2);
          ctx.fill();

          // Golden Beak
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.moveTo(p.size * 0.88, -p.size * 0.1);
          ctx.lineTo(p.size * 1.05, -p.size * 0.05);
          ctx.lineTo(p.size * 0.88, 0);
          ctx.fill();

          // Big cute eye
          ctx.fillStyle = '#1e1b4b';
          ctx.beginPath();
          ctx.arc(p.size * 0.7, -p.size * 0.18, 1.8, 0, Math.PI * 2);
          ctx.fill();

          // Left Wing (Flapping up/down)
          ctx.fillStyle = '#f8fafc';
          ctx.save();
          ctx.translate(-p.size * 0.15, -p.size * 0.15);
          ctx.rotate(-0.5 + flap);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(-p.size * 0.8, -p.size * 1.1, -p.size * 1.5, -p.size * 0.8, -p.size * 1.8, -p.size * 0.3);
          ctx.bezierCurveTo(-p.size * 1.1, p.size * 0.1, -p.size * 0.4, 0, 0, 0);
          ctx.fill();
          ctx.restore();

          // Tail Feathers
          ctx.fillStyle = '#e2e8f0';
          ctx.beginPath();
          ctx.moveTo(-p.size * 0.65, 0);
          ctx.lineTo(-p.size * 1.1, p.size * 0.15);
          ctx.lineTo(-p.size * 0.95, -p.size * 0.1);
          ctx.fill();

          // Tiny letter held in beak/talons!
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(p.size * 0.2, p.size * 0.25, 7, 5);
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(p.size * 0.2 + 3.5, p.size * 0.25 + 2.5, 1.2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'envelope') {
          // FLOATING PARCHMENT ENVELOPE WITH RED WAX SEAL
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle + Math.sin(p.timeOffset) * 0.15);

          // Envelope paper shadow
          ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
          ctx.shadowBlur = 8;

          // Envelope body
          const w = p.size * 1.4;
          const h = p.size * 0.95;
          ctx.fillStyle = '#fef7ed';
          ctx.strokeStyle = '#d97706';
          ctx.lineWidth = 0.8;

          ctx.beginPath();
          ctx.roundRect(-w / 2, -h / 2, w, h, 2);
          ctx.fill();
          ctx.stroke();

          // Flap lines
          ctx.strokeStyle = 'rgba(217, 119, 6, 0.5)';
          ctx.beginPath();
          ctx.moveTo(-w / 2, -h / 2);
          ctx.lineTo(0, 0);
          ctx.lineTo(w / 2, -h / 2);
          ctx.stroke();

          // Crimson Wax Seal
          ctx.fillStyle = '#b91c1c';
          ctx.shadowColor = 'rgba(185, 28, 28, 0.6)';
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
          ctx.fill();

          // Cute tiny wings on the letter! (Like enchanted flying letters)
          const lw = Math.sin(p.timeOffset * 4) * 0.3;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          // Left wing
          ctx.save();
          ctx.translate(-w / 2, 0);
          ctx.rotate(-0.3 + lw);
          ctx.beginPath();
          ctx.ellipse(-7, -4, 8, 3, -0.3, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
          // Right wing
          ctx.save();
          ctx.translate(w / 2, 0);
          ctx.rotate(0.3 - lw);
          ctx.beginPath();
          ctx.ellipse(7, -4, 8, 3, 0.3, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else if (p.type === 'feather') {
          // GLOWING MAGIC FEATHER
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle + Math.sin(p.timeOffset) * 0.3);

          const grad = ctx.createLinearGradient(0, -p.size, 0, p.size);
          grad.addColorStop(0, '#ffffff');
          grad.addColorStop(0.5, '#fde68a');
          grad.addColorStop(1, '#f472b6');
          ctx.fillStyle = grad;

          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.quadraticCurveTo(p.size * 0.45, -p.size * 0.3, 0, p.size);
          ctx.quadraticCurveTo(-p.size * 0.45, -p.size * 0.3, 0, -p.size);
          ctx.fill();

          // Shaft
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.lineTo(0, p.size + 2);
          ctx.stroke();
        } else if (p.type === 'star') {
          // LUMOS STARLIGHT SPARKLE
          ctx.translate(p.x, p.y);
          const pulse = 1 + Math.sin(p.timeOffset * 3) * 0.35;
          ctx.scale(pulse, pulse);

          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 10;

          // 4-pointed diamond star
          ctx.beginPath();
          ctx.moveTo(0, -p.size * 2);
          ctx.lineTo(p.size * 0.6, 0);
          ctx.lineTo(0, p.size * 2);
          ctx.lineTo(-p.size * 0.6, 0);
          ctx.closePath();
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(-p.size * 2, 0);
          ctx.lineTo(0, p.size * 0.6);
          ctx.lineTo(p.size * 2, 0);
          ctx.lineTo(0, -p.size * 0.6);
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[2] overflow-hidden"
    />
  );
};
