import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  RefreshCw,
  Camera,
  Check,
  Wand2,
  Download,
  Loader2,
  Sparkles,
  MapPin,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import jsPDF from 'jspdf';
import { toJpeg } from 'html-to-image';
import { DateInvitation, DEFAULT_INVITATION } from '../types/invitation';
import {
  playScratchSound,
  playChimeSound,
  playCutePopSound,
} from '../utils/audio';
import { FloatingPetals } from './FloatingPetals';
import { HogwartsFloatingMagic } from './HogwartsFloatingMagic';
import { GoldenTicket } from './GoldenTicket';
import { BackgroundMusic } from './BackgroundMusic';
import { HogwartsMagicCursor } from './HogwartsMagicCursor';
import { OwlDeliveryCinematic } from './OwlDeliveryCinematic';
import { MaraudersMap } from './MaraudersMap';
import { PatronusSpell } from './PatronusSpell';
import pampasBgImg from '../assets/images/warm_pampas_sunset_bg_1791349666062.jpg';

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
  isFoilCrumb?: boolean;
}

let particleIdSequence = 0;

export const PostcardScratch: React.FC = () => {
  // Always reset to DEFAULT_INVITATION on reload so recipient is never stuck!
  const [invitation, setInvitation] = useState<DateInvitation>(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash.includes('invite=')) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    }
    return DEFAULT_INVITATION;
  });

  const [bgImage, setBgImage] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('romantic_custom_bg') || pampasBgImg;
    }
    return pampasBgImg;
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [percentage, setPercentage] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isOwlDelivering, setIsOwlDelivering] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isPatronusOpen, setIsPatronusOpen] = useState(false);
  const [hesitateCount, setHesitateCount] = useState(0);
  const [hesitatePos, setHesitatePos] = useState({ x: 0, y: 0 });

  // PDF Export State
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);

  // 3D Card Tilt state
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0 });

  // 3D Gold Galleon scratch coin cursor state
  const [wandPos, setWandPos] = useState({ x: 0, y: 0, visible: false, isPressing: false });

  const containerRef = useRef<HTMLDivElement>(null);
  const cardUnderneathRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isScratchingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const strokeCountRef = useRef(0);
  const [particles, setParticles] = useState<Particle[]>([]);

  // Particle physics for peeling metallic foil crumbs & Hogwarts stardust sparks
  useEffect(() => {
    let animId: number;
    const updateParticles = () => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.isFoilCrumb ? p.vy + 0.35 : p.vy + 0.1, // Realistic crumb gravity!
            vx: p.vx * 0.95, // air friction
            opacity: p.opacity - (p.isFoilCrumb ? 0.03 : 0.02),
            rotation: p.rotation + (p.isFoilCrumb ? 10 : 4),
          }))
          .filter((p) => p.opacity > 0)
      );
      animId = requestAnimationFrame(updateParticles);
    };
    animId = requestAnimationFrame(updateParticles);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Spawn realistic metallic foil shavings & glowing stardust
  const spawnParticles = (x: number, y: number) => {
    const foilPalette = ['#e6c35c', '#d4af37', '#ffd700', '#2b1b38', '#543666', '#a16207', '#fff8db'];
    const newItems: Particle[] = [];
    
    // 4-5 foil peeling crumbs falling with gravity
    for (let i = 0; i < 4; i++) {
      newItems.push({
        id: ++particleIdSequence,
        x: x + (Math.random() - 0.5) * 18,
        y: y + (Math.random() - 0.5) * 14,
        vx: (Math.random() - 0.5) * 4.8,
        vy: 1.2 + Math.random() * 2.8, // tumbling downwards!
        color: foilPalette[Math.floor(Math.random() * foilPalette.length)],
        size: 2 + Math.random() * 3,
        opacity: 0.95,
        rotation: Math.random() * 360,
        isFoilCrumb: true,
      });
    }

    // 2 golden stardust lumos sparks
    for (let i = 0; i < 2; i++) {
      newItems.push({
        id: ++particleIdSequence,
        x: x + (Math.random() - 0.5) * 12,
        y: y + (Math.random() - 0.5) * 12,
        vx: (Math.random() - 0.5) * 2.5,
        vy: -1.2 - Math.random() * 2, // float upward
        color: '#fef08a',
        size: 1.5 + Math.random() * 2.5,
        opacity: 0.9,
        rotation: Math.random() * 360,
        isFoilCrumb: false,
      });
    }

    setParticles((prev) => [...prev.slice(-60), ...newItems]);
  };

  // Draw authentic Hogwarts Wax Seal & Gilded Lottery Scratch Cover
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

    // 1. Brushed Metallic Deep Garnet & Gold Foil Gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#1c1328');
    grad.addColorStop(0.2, '#2f1b3e');
    grad.addColorStop(0.4, '#42244c');
    grad.addColorStop(0.6, '#311c3a');
    grad.addColorStop(0.8, '#21142c');
    grad.addColorStop(1, '#110b19');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // 2. Realistic Brushed Foil Hairline Grooves (fine horizontal & diagonal texture)
    ctx.fillStyle = 'rgba(255, 235, 170, 0.04)';
    for (let y = 0; y < height; y += 3) {
      ctx.fillRect(0, y, width, 1);
    }

    // 3. Subtle golden starlight stippling
    ctx.fillStyle = 'rgba(254, 240, 138, 0.08)';
    for (let i = 0; i < 90; i++) {
      const sx = (Math.sin(i * 101) * 0.5 + 0.5) * width;
      const sy = (Math.cos(i * 41) * 0.5 + 0.5) * height;
      ctx.beginPath();
      ctx.arc(sx, sy, 1 + (i % 2), 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. Antique Golden Double Border & Security Perimeter
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1.8;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    ctx.strokeStyle = 'rgba(254, 240, 138, 0.45)';
    ctx.setLineDash([5, 4]);
    ctx.strokeRect(15, 15, width - 30, height - 30);
    ctx.setLineDash([]);

    // Corner Filigree Ornaments
    const drawCornerFiligree = (cx: number, cy: number) => {
      ctx.save();
      ctx.fillStyle = '#fbbf24';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = '#d4af37';
      ctx.beginPath();
      ctx.moveTo(cx - 8, cy);
      ctx.lineTo(cx + 8, cy);
      ctx.moveTo(cx, cy - 8);
      ctx.lineTo(cx, cy + 8);
      ctx.stroke();
      ctx.restore();
    };

    drawCornerFiligree(22, 22);
    drawCornerFiligree(width - 22, 22);
    drawCornerFiligree(width - 22, height - 22);
    drawCornerFiligree(22, height - 22);

    // 5. Central Hogwarts Real Scratch-Off Lottery Plaque
    const badgeW = Math.min(330, width - 34);
    const badgeH = 176;
    const bx = (width - badgeW) / 2;
    const by = (height - badgeH) / 2;

    // Plaque background with warm magical aura
    ctx.save();
    ctx.shadowColor = 'rgba(251, 191, 36, 0.45)';
    ctx.shadowBlur = 24;
    ctx.fillStyle = 'rgba(22, 16, 32, 0.96)';
    ctx.beginPath();
    ctx.roundRect(bx, by, badgeW, badgeH, 20);
    ctx.fill();
    ctx.restore();

    // Ornate gold border on badge
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Dotted scratch perimeter boundary
    ctx.strokeStyle = 'rgba(254, 240, 138, 0.35)';
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(bx + 6, by + 6, badgeW - 12, badgeH - 12);
    ctx.setLineDash([]);

    // Security Banner at top of plaque
    ctx.font = '700 9.5px "Cinzel", Georgia, serif';
    ctx.fillStyle = '#fbbf24';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('★ ЗАЩИТНЫЙ СЛОЙ СЮРПРИЗА ★', width / 2, by + 22);

    // Crest: Flying Hedwig & Golden Sparkles
    ctx.fillStyle = '#fde047';
    ctx.font = '22px serif';
    ctx.fillText('🦉 ✨ ⚡', width / 2, by + 45);

    // Main Title in EB Garamond
    ctx.font = '700 18px "EB Garamond", Georgia, serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('ТАЙНА 11 ЧИСЛА', width / 2, by + 72);

    // Scratch Instruction Banner
    ctx.font = '700 12px "Cinzel", Georgia, serif';
    ctx.fillStyle = '#ffd700';
    ctx.fillText('СОТРИ МОНЕТОЙ СЮРПРИЗ ✨', width / 2, by + 95);

    // Romantic Subtitle
    ctx.font = '500 13px "Marck Script", cursive';
    ctx.fillStyle = '#fef08a';
    ctx.fillText('Сотри заклятие — сова уже летит к тебе', width / 2, by + 118);

    ctx.font = '400 12.5px "Marck Script", cursive';
    ctx.fillStyle = '#bae6fd';
    ctx.fillText('Для любимой голубоглазой заюшки 🐰💙', width / 2, by + 136);

    // Spell Tag in elegant small serif
    ctx.font = '700 9.5px "Cinzel", Georgia, serif';
    ctx.fillStyle = '#fcd34d';
    ctx.fillText('✦ ALOHOMORA • СТИРАЙ ЗДЕСЬ • 03:00 ✦', width / 2, by + 158);

    setPercentage(0);
    setIsRevealed(false);
  }, []);

  useEffect(() => {
    initCanvas();
    const handleResize = () => initCanvas();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initCanvas]);

  // Scratch progress checking
  const checkPercentage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    if (w === 0 || h === 0) return;

    const sampleStep = 8;
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;
    let transparentCount = 0;
    let totalCount = 0;

    for (let y = 0; y < h; y += sampleStep) {
      for (let x = 0; x < w; x += sampleStep) {
        const index = (y * w + x) * 4;
        if (data[index + 3] < 128) {
          transparentCount++;
        }
        totalCount++;
      }
    }

    const pct = Math.round((transparentCount / totalCount) * 100);
    setPercentage(pct);

    // Once scratched 55%, reveal completely with Hogwarts chime & auto-launch Owl Flight Delivery
    if (pct >= 55 && !isRevealed) {
      setIsRevealed(true);
      playChimeSound();
      confetti({
        particleCount: 85,
        spread: 90,
        origin: { y: 0.55 },
        colors: ['#38bdf8', '#ffd700', '#fef08a', '#f59e0b', '#ffffff'],
      });
      // Launch the gorgeous owl delivery flight sequence
      setTimeout(() => {
        setIsOwlDelivering(true);
      }, 700);
    }
  }, [isRevealed]);

  // Scratch stroke drawing with continuous sub-step interpolation for real smooth erasing!
  const scratchAt = useCallback(
    (x: number, y: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      
      // 56px width (28px radius) for natural coin scratch feel
      const scratchRadius = 28 * dpr;
      ctx.lineWidth = scratchRadius * 2;

      const lastPoint = lastPointRef.current;

      if (lastPoint) {
        const dx = x - lastPoint.x;
        const dy = y - lastPoint.y;
        const dist = Math.hypot(dx, dy);

        // Smooth connected line stroke
        ctx.beginPath();
        ctx.moveTo(lastPoint.x * dpr, lastPoint.y * dpr);
        ctx.lineTo(x * dpr, y * dpr);
        ctx.stroke();

        // Interpolate crumbs along fast swipes so crumbs emit continuously
        const steps = Math.min(5, Math.max(1, Math.floor(dist / 14)));
        for (let s = 1; s <= steps; s++) {
          const px = lastPoint.x + (dx * s) / steps;
          const py = lastPoint.y + (dy * s) / steps;
          spawnParticles(px, py);
        }
      } else {
        ctx.beginPath();
        ctx.arc(x * dpr, y * dpr, scratchRadius, 0, Math.PI * 2);
        ctx.fill();
        spawnParticles(x, y);
      }
      ctx.restore();

      lastPointRef.current = { x, y };

      strokeCountRef.current++;
      // Realistic scratch audio on movement
      if (strokeCountRef.current % 2 === 0) {
        playScratchSound(1.2);
      }

      if (strokeCountRef.current % 5 === 0) {
        checkPercentage();
      }
    },
    [checkPercentage]
  );

  // PDF Export Function for pristine keepsake download (fully compatible with Tailwind v4 oklab/oklch colors)
  const handleDownloadPDF = async () => {
    if (!cardUnderneathRef.current) return;
    setIsDownloadingPdf(true);
    try {
      playCutePopSound();
      setCardTilt({ x: 0, y: 0 }); // reset tilt for pristine capture

      const element = cardUnderneathRef.current;
      const rect = element.getBoundingClientRect();
      const elemWidth = rect.width || 440;
      const elemHeight = rect.height || 620;

      // Use html-to-image toJpeg: natively supports oklab/oklch and modern CSS!
      let imgData: string;
      try {
        imgData = await toJpeg(element, {
          quality: 0.96,
          pixelRatio: 2.5,
          backgroundColor: '#140e1e',
          cacheBust: true,
        });
      } catch {
        // Fallback with standard settings
        imgData = await toJpeg(element, {
          quality: 0.95,
          pixelRatio: 2,
          backgroundColor: '#140e1e',
        });
      }

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a5',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Midnight luxury background
      pdf.setFillColor(18, 13, 26);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');

      // Ornate gold border on PDF
      pdf.setDrawColor(212, 175, 55);
      pdf.setLineWidth(0.8);
      pdf.rect(6, 6, pageWidth - 12, pageHeight - 12);

      pdf.setDrawColor(254, 240, 138);
      pdf.setLineWidth(0.3);
      pdf.rect(8, 8, pageWidth - 16, pageHeight - 16);

      const margin = 10;
      const availWidth = pageWidth - margin * 2;
      const availHeight = pageHeight - margin * 2;
      const imgWidth = availWidth;
      const imgHeight = (elemHeight * imgWidth) / elemWidth;
      const yOffset = Math.max(margin, (pageHeight - imgHeight) / 2);

      pdf.addImage(imgData, 'JPEG', margin, yOffset, imgWidth, Math.min(imgHeight, availHeight));

      const safeName = invitation.to.replace(/[^\w\u0400-\u04FF]/g, '_').slice(0, 20);
      pdf.save(`Hogwarts_Invitation_11_${safeName || 'Love'}.pdf`);

      playChimeSound();
      confetti({
        particleCount: 70,
        spread: 75,
        origin: { y: 0.35 },
        colors: ['#ffd700', '#fde047', '#38bdf8', '#ffffff'],
      });
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 4000);
    } catch (err) {
      console.error('PDF export error:', err);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const getCanvasCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    isScratchingRef.current = true;
    const { x, y } = getCanvasCoords(e);
    lastPointRef.current = { x, y };
    setWandPos((prev) => ({ ...prev, isPressing: true }));
    scratchAt(x, y);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasCoords(e);
    setWandPos({
      x: e.clientX,
      y: e.clientY,
      visible: true,
      isPressing: isScratchingRef.current,
    });

    if (!isScratchingRef.current) return;
    e.preventDefault();
    scratchAt(x, y);
  };

  const handlePointerUp = () => {
    isScratchingRef.current = false;
    lastPointRef.current = null;
    setWandPos((prev) => ({ ...prev, isPressing: false }));
    checkPercentage();
  };

  const handleMouseMoveContainer = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setCardTilt({
      x: -y * 8,
      y: x * 8,
    });
  };

  const handleMouseLeaveContainer = () => {
    setCardTilt({ x: 0, y: 0 });
    setWandPos((prev) => ({ ...prev, visible: false }));
  };

  const handleRevealAll = () => {
    playChimeSound();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    setPercentage(100);
    setIsRevealed(true);
    confetti({
      particleCount: 75,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#38bdf8', '#ffd700', '#fef08a', '#f59e0b'],
    });
    // Launch owl delivery
    setTimeout(() => {
      setIsOwlDelivering(true);
    }, 700);
  };

  const handleReset = () => {
    playCutePopSound();
    initCanvas();
    setIsAccepted(false);
    setHesitateCount(0);
    setHesitatePos({ x: 0, y: 0 });
  };

  const handleAccept = () => {
    setIsAccepted(true);
    playChimeSound();
    confetti({
      particleCount: 130,
      spread: 110,
      origin: { y: 0.6 },
      colors: ['#ffd700', '#ff4d6d', '#ffffff', '#fbbf24', '#f43f5e'],
    });
  };

  const handleHesitate = () => {
    playCutePopSound();
    setHesitateCount((prev) => prev + 1);
    if (hesitateCount < 3) {
      const rx = (Math.random() - 0.5) * 110;
      const ry = (Math.random() - 0.5) * 60;
      setHesitatePos({ x: rx, y: ry });
    }
  };

  // Drag & drop photo upload
  const [isDragging, setIsDragging] = useState(false);

  const saveImageToServer = async (base64Image: string) => {
    try {
      await fetch('/api/save-background', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image }),
      });
    } catch {
      // dev
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setBgImage(result);
        saveImageToServer(result);
        try {
          localStorage.setItem('romantic_custom_bg', result);
        } catch {
          // quota
        }
        playCutePopSound();
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.2 },
          colors: ['#ffd700', '#ffffff', '#f43f5e'],
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setBgImage(result);
          saveImageToServer(result);
          try {
            localStorage.setItem('romantic_custom_bg', result);
          } catch {
            // quota
          }
          playCutePopSound();
          confetti({
            particleCount: 40,
            spread: 60,
            origin: { y: 0.2 },
            colors: ['#ffd700', '#ffffff', '#f43f5e'],
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Date parsing for cards
  const dayText = invitation.dateTime.match(/\b\d{1,2}\b/)?.[0] || '11';
  const monthText = invitation.dateTime.includes('ночи') || invitation.dateTime.includes('число')
    ? 'Число'
    : (invitation.dateTime.match(/[А-Яа-яA-Za-z]{3,}/)?.[0] || 'Ночь');
  const timeText = invitation.dateTime.match(/\b\d{1,2}:\d{2}\b/)?.[0] || '03:00';
  const spotText = invitation.location.split(',')[0] || invitation.location || 'Наше место';

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="min-h-screen relative flex flex-col items-center justify-center p-3 sm:p-6 select-none overflow-x-hidden"
    >
      {/* Background Image with Hogwarts Warm Candlelight Sunset Vignette */}
      <div
        className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center transition-all duration-700"
        style={{
          backgroundImage: `url('${bgImage}')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-[#130f1e]/60 to-black/65" />
      </div>

      {/* Floating Hogwarts Magic Layer (Hedwig Owls, Golden Snitches, Winged Letters, Lumos Stars) */}
      <HogwartsFloatingMagic />

      {/* Floating Rose Petals / Embers Ambient Layer */}
      <FloatingPetals />

      {/* Official Audio Player */}
      <BackgroundMusic />

      {/* Hogwarts Magic Wand Cursor & Floating Embers */}
      <HogwartsMagicCursor />

      {/* Hogwarts Owl Delivery Cinematic Modal */}
      <OwlDeliveryCinematic
        invitation={invitation}
        isOpen={isOwlDelivering}
        onClose={() => setIsOwlDelivering(false)}
        onAccepted={() => setIsAccepted(true)}
      />

      {/* Marauder's Map Interactive Footprints Modal */}
      <MaraudersMap
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        recipientName={invitation.to}
        senderName={invitation.sender}
      />

      {/* Silver Rabbit Patronus Spell Modal */}
      <PatronusSpell
        isOpen={isPatronusOpen}
        onClose={() => setIsPatronusOpen(false)}
      />

      {/* Drag & Drop Visual Indicator Overlay */}
      {isDragging && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center border-4 border-dashed border-amber-400 p-6 text-center animate-fade-in pointer-events-none">
          <Camera className="w-16 h-16 text-amber-400 mb-3 animate-bounce" />
          <h2 className="text-2xl sm:text-3xl font-magical font-bold text-amber-100 mb-1">
            Отпустите фото сюда!
          </h2>
          <p className="text-amber-200 text-sm font-quill text-lg">
            Оно станет волшебным фоном для вашей открытки ✨
          </p>
        </div>
      )}

      {/* Hidden file input for custom photo upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Realistic 3D Hogwarts Galleon Gold Coin Scratch Cursor */}
      {wandPos.visible && percentage < 55 && (
        <div
          className="fixed pointer-events-none z-50 transition-transform duration-75 ease-out select-none"
          style={{
            left: `${wandPos.x}px`,
            top: `${wandPos.y}px`,
            transform: `translate(-50%, -50%) scale(${wandPos.isPressing ? 0.94 : 1.08}) rotate(${wandPos.isPressing ? '-22deg' : '-8deg'})`,
          }}
        >
          {/* Coin drop shadow onto card */}
          <div
            className={`relative w-14 h-14 rounded-full transition-all duration-100 ${
              wandPos.isPressing
                ? 'shadow-[0_4px_14px_rgba(0,0,0,0.95),0_0_20px_rgba(251,191,36,0.6)]'
                : 'shadow-[0_15px_30px_rgba(0,0,0,0.85),0_0_25px_rgba(251,191,36,0.35)]'
            }`}
          >
            {/* 3D Coin Body with milled edge */}
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
              <defs>
                <radialGradient id="coinGrad" cx="35%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#fff8db" />
                  <stop offset="25%" stopColor="#fde047" />
                  <stop offset="65%" stopColor="#d97706" />
                  <stop offset="90%" stopColor="#92400e" />
                  <stop offset="100%" stopColor="#78350f" />
                </radialGradient>
                <linearGradient id="rimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="50%" stopColor="#b45309" />
                  <stop offset="100%" stopColor="#fef08a" />
                </linearGradient>
              </defs>

              {/* Outer Milled Rim */}
              <circle cx="50" cy="50" r="48" fill="url(#rimGrad)" stroke="#78350f" strokeWidth="1.5" />

              {/* Serrated Coin Rim Notches */}
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="#451a03"
                strokeWidth="2.5"
                strokeDasharray="2, 2.5"
              />

              {/* Inner Coin Surface */}
              <circle cx="50" cy="50" r="43" fill="url(#coinGrad)" stroke="#b45309" strokeWidth="1.2" />
              <circle cx="50" cy="50" r="39" fill="none" stroke="#fef08a" strokeWidth="0.8" opacity="0.7" />

              {/* Embossed Hogwarts Owl Silhouette */}
              <path
                d="M 38 42 Q 50 35 62 42 Q 65 52 50 63 Q 35 52 38 42 Z"
                fill="#78350f"
                opacity="0.85"
              />
              <circle cx="45" cy="45" r="2.2" fill="#fef08a" />
              <circle cx="55" cy="45" r="2.2" fill="#fef08a" />
              <polygon points="50,47 48,51 52,51" fill="#fef08a" />

              {/* Milled text around coin */}
              <path
                id="coinTextCurve"
                d="M 50 18 A 32 32 0 1 1 49.9 18"
                fill="none"
              />
              <text fontSize="6.8" fill="#451a03" fontWeight="bold" letterSpacing="1.2">
                <textPath href="#coinTextCurve" startOffset="10%">
                  HOGWARTS • 11 • GALLEON
                </textPath>
              </text>

              {/* Center 11 number */}
              <text
                x="50"
                y="74"
                textAnchor="middle"
                fontSize="11"
                fontWeight="900"
                fill="#451a03"
                fontFamily="Cinzel, serif"
              >
                11
              </text>
            </svg>

            {/* Dynamic contact spark when pressing & scratching */}
            {wandPos.isPressing && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-amber-300 rounded-full blur-sm animate-ping opacity-80" />
            )}
          </div>
        </div>
      )}

      {/* Top Floating Mini-Nav for Owl cinematic delivery, Marauder's Map, Patronus & PDF */}
      <div className="relative z-20 flex flex-wrap items-center justify-center gap-2 mb-3 max-w-xl mx-auto px-2">
        <button
          type="button"
          onClick={() => setIsOwlDelivering(true)}
          className="px-3.5 py-1.5 rounded-full bg-[#1f172f]/85 hover:bg-[#2d2244] border border-amber-400/40 text-amber-200 text-xs font-magical font-semibold flex items-center gap-1.5 shadow-lg shadow-black/50 backdrop-blur-md transition-all hover:scale-105 active:scale-95"
          title="Призвать сову Буклю с письмом"
        >
          <span>🦉 Букля</span>
        </button>

        <button
          type="button"
          onClick={() => setIsMapOpen(true)}
          className="px-3.5 py-1.5 rounded-full bg-[#1f172f]/85 hover:bg-[#2d2244] border border-amber-400/40 text-amber-200 text-xs font-magical font-semibold flex items-center gap-1.5 shadow-lg shadow-black/50 backdrop-blur-md transition-all hover:scale-105 active:scale-95"
          title="Открыть интерактивную Карту Мародёров"
        >
          <span>📜 Карта Мародёров</span>
        </button>

        <button
          type="button"
          onClick={() => setIsPatronusOpen(true)}
          className="px-3.5 py-1.5 rounded-full bg-sky-950/85 hover:bg-sky-900 border border-sky-400/50 text-sky-200 text-xs font-magical font-semibold flex items-center gap-1.5 shadow-lg shadow-black/50 backdrop-blur-md transition-all hover:scale-105 active:scale-95"
          title="Вызвать серебряного Патронуса Заюшки"
        >
          <Sparkles className="w-3.5 h-3.5 text-sky-300" />
          <span>Патронус</span>
        </button>

        {/* PDF Download Button in Top Bar */}
        <button
          type="button"
          onClick={handleDownloadPDF}
          disabled={isDownloadingPdf}
          className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-600/90 via-amber-500/90 to-amber-700/90 hover:from-amber-500 hover:to-amber-600 border border-amber-300/60 text-white text-xs font-magical font-bold flex items-center gap-1.5 shadow-lg shadow-black/50 backdrop-blur-md transition-all hover:scale-105 active:scale-95 disabled:opacity-60"
          title="Скачать открытку в формате PDF"
        >
          {isDownloadingPdf ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-200" />
              <span>Создаю PDF...</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5 text-amber-200" />
              <span>PDF</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-1.5 rounded-full bg-[#1f172f]/85 hover:bg-[#2d2244] border border-white/20 text-white/70 hover:text-white transition-all shadow-md backdrop-blur-md"
          title="Сменить фоновое фото"
        >
          <Camera className="w-4 h-4" />
        </button>
      </div>

      {/* PDF Download Success Toast */}
      {pdfSuccess && (
        <div className="fixed top-5 z-50 animate-bounce bg-emerald-950/95 border-2 border-emerald-400 text-emerald-200 px-4 py-2 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-magical font-bold backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-emerald-300" />
          <span>Открытка сохранена в PDF! 💌</span>
        </div>
      )}

      {/* Center Stage: Hogwarts Romantic Scratch Card */}
      <div className="relative z-10 w-full max-w-[440px] sm:max-w-[480px] my-auto">
        {/* Main Card with 3D Tilt */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMoveContainer}
          onMouseLeave={handleMouseLeaveContainer}
          className="relative w-full min-h-[580px] sm:min-h-[620px] rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95),0_0_40px_rgba(251,191,36,0.25)] overflow-hidden border-2 border-amber-500/50 bg-[#140e1e] transition-transform duration-200 ease-out flex flex-col"
          style={{
            transform: `perspective(1000px) rotateX(${cardTilt.x}deg) rotateY(${cardTilt.y}deg)`,
            touchAction: 'none',
          }}
        >
          {/* UNDERNEATH LAYER: Hogwarts Secret Acceptance Letter (Captured for PDF) */}
          <div
            ref={cardUnderneathRef}
            className="relative z-10 w-full flex-1 p-4 sm:p-5 flex flex-col justify-between text-white bg-gradient-to-b from-[#1c1529] via-[#150f20] to-[#0d0914] gap-2.5"
          >
            {/* Top Hogwarts Crest Header */}
            <div className="relative z-10 flex items-center justify-between border-b border-amber-400/20 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 text-sm">🏰</span>
                <div>
                  <span className="text-[11px] font-cinzel tracking-[0.16em] text-amber-300 font-bold block leading-tight">
                    HOGWARTS • OWL POST
                  </span>
                  <span className="text-[10px] font-magical italic text-amber-200/70 block leading-none">
                    Министерство свиданий
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-amber-400/30 text-amber-300 font-cinzel text-[10px] font-bold shrink-0 shadow-sm">
                <span>№ 9¾</span>
                <span className="text-amber-400/50">•</span>
                <span>03:00</span>
              </div>
            </div>

            {/* Recipient Box in authentic Quill Ink script */}
            <div className="relative z-10 flex items-center justify-between gap-3 bg-white/[0.04] p-2.5 sm:p-3 rounded-2xl border border-amber-400/25 mt-1 shadow-inner">
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-magical italic tracking-wide text-amber-300/80 block">
                  Для самой волшебной:
                </span>
                <h2 className="font-quill text-2xl sm:text-3xl text-amber-100 tracking-normal leading-tight drop-shadow-sm break-words">
                  {invitation.to}
                </h2>
              </div>
              <div className="flex items-center px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 font-cinzel text-[10px] font-bold shrink-0 self-center">
                <span>ПЕРСОНАЛЬНО</span>
              </div>
            </div>

            {/* Hogwarts Engraved Medallions for Date, Time & Spot */}
            <div className="relative z-10 space-y-1.5 my-auto">
              <div className="grid grid-cols-2 gap-2">
                {/* Day Tile */}
                <div className="bg-amber-950/20 border border-amber-500/25 rounded-xl p-2 sm:p-2.5 text-center flex flex-col justify-center">
                  <span className="text-[10px] font-press uppercase tracking-wider text-amber-300/80 font-bold">
                    ДАТА
                  </span>
                  <span className="font-magical text-xl sm:text-2xl font-bold text-amber-200 leading-tight">
                    {dayText} число
                  </span>
                  <span className="text-[10px] font-magical italic text-amber-100/90 leading-tight">
                    ночь нашего знакомства
                  </span>
                </div>

                {/* Time Tile */}
                <div className="bg-amber-950/20 border border-amber-500/25 rounded-xl p-2 sm:p-2.5 text-center flex flex-col justify-center">
                  <span className="text-[10px] font-press uppercase tracking-wider text-amber-300/80 font-bold">
                    ВРЕМЯ
                  </span>
                  <span className="font-cinzel text-xl sm:text-2xl font-bold text-white leading-tight">
                    {timeText}
                  </span>
                  <span className="text-[10px] font-magical italic text-amber-200/80 leading-tight">
                    Вылет совы
                  </span>
                </div>
              </div>

              {/* Spot Tile - Full text, no truncation, opens Marauder's Map on click */}
              <div
                onClick={() => setIsMapOpen(true)}
                className="bg-amber-950/20 hover:bg-amber-900/30 border border-amber-500/25 hover:border-amber-400/50 rounded-xl p-2 sm:p-2.5 flex items-center gap-2.5 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] group shadow-sm"
                title="Нажмите, чтобы развернуть интерактивную Карту Мародёров 📜"
              >
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 group-hover:animate-bounce" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-press uppercase tracking-wider text-amber-300/80 font-bold shrink-0">
                      МЕСТО ВСТРЕЧИ
                    </span>
                    <span className="text-[10px] font-quill text-amber-300 group-hover:text-amber-200 underline decoration-amber-400/40 italic">
                      (Карта Мародёров 📜)
                    </span>
                  </div>
                  <p className="font-magical text-xs sm:text-sm font-bold text-amber-100 leading-snug break-words mt-0.5">
                    {invitation.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Proposal Question & Quill Handwritten Message */}
            <div className="relative z-10 text-center my-1">
              <h1 className="font-magical text-lg sm:text-xl text-amber-100 font-bold tracking-wide leading-tight">
                {invitation.question}
              </h1>
              <p className="text-amber-200 font-quill text-base sm:text-lg mt-1 leading-snug break-words max-w-sm mx-auto">
                «{invitation.message}»
              </p>
            </div>

            {/* Details Box: Dress Code / Equipment */}
            {invitation.dressCode && (
              <div className="relative z-10 bg-white/[0.04] p-2.5 rounded-xl border border-amber-400/20 text-xs flex items-start gap-2">
                <span className="text-amber-300 font-magical italic font-semibold text-xs shrink-0 mt-0.5">
                  Мантия / Дресс-код:
                </span>
                <span className="text-amber-100 font-medium break-words leading-snug flex-1">
                  {invitation.dressCode}
                </span>
              </div>
            )}

            {/* Signature & Hogwarts Seal Footer */}
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pt-2 border-t border-amber-400/20 text-xs">
              <div className="flex items-center flex-wrap gap-1 min-w-0">
                <span className="font-magical italic text-amber-300/80 text-xs shrink-0">
                  Искренне твой(я),
                </span>
                <span className="font-quill text-lg sm:text-xl text-rose-300 font-bold leading-tight break-words">
                  {invitation.sender}
                </span>
              </div>
              <div className="flex items-center gap-1 text-emerald-400 font-magical font-semibold text-xs shrink-0 self-end sm:self-auto">
                <Check className="w-3.5 h-3.5" />
                <span className="font-cinzel text-[10px] tracking-wider uppercase font-bold">НАВЕЧНО</span>
              </div>
            </div>
          </div>

          {/* OVERLAY LAYER: Canvas Scratch Foil */}
          <canvas
            ref={canvasRef}
            data-scratch-canvas="true"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="absolute inset-0 w-full h-full z-20 cursor-grab active:cursor-grabbing touch-none transition-opacity duration-700"
            style={{
              opacity: percentage >= 55 ? 0 : 1,
              pointerEvents: percentage >= 55 ? 'none' : 'auto',
            }}
          />

          {/* Flying golden & rose magic particles */}
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
                  boxShadow: `0 0 8px ${p.color}`,
                }}
              />
            ))}
          </div>

          {/* Shimmer Light Sweep */}
          {percentage < 55 && (
            <div className="absolute inset-0 pointer-events-none z-25 overflow-hidden">
              <div className="absolute -inset-full w-[200%] h-[200%] bg-gradient-to-r from-transparent via-amber-200/20 to-transparent animate-shimmer" />
            </div>
          )}
        </div>

        {/* Micro status / Progress bar right below card */}
        <div className="mt-3.5 space-y-1.5 px-1 select-none">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <span>🪄</span>
              {percentage >= 55 ? (
                <span className="text-emerald-400 font-magical font-semibold text-xs">
                  Заклятие снято! Письмо открыто ✨
                </span>
              ) : percentage > 0 ? (
                <span className="text-xs text-amber-200 font-medium">
                  Стерто: <strong className="text-amber-400 font-bold">{percentage}%</strong> из 55%
                </span>
              ) : (
                <span className="text-xs text-amber-200/90 font-magical italic animate-pulse">
                  Сотри защитный слой монеткой ✨
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Quick Reveal All Alohomora button */}
              {percentage < 55 && (
                <button
                  type="button"
                  onClick={handleRevealAll}
                  className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors font-magical font-semibold"
                  title="Открыть сразу заклинанием Alohomora"
                >
                  <Wand2 className="w-3 h-3" />
                  <span>Взмахнуть палочкой ✨</span>
                </button>
              )}

              {percentage > 0 && (
                <button
                  type="button"
                  onClick={handleReset}
                  title="Потереть заново"
                  className="text-xs text-white/50 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Заново</span>
                </button>
              )}
            </div>
          </div>

          {/* Harry Potter Golden Starlight Progress Bar */}
          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden border border-amber-500/20">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-rose-400 transition-all duration-300"
              style={{ width: `${Math.min(100, (percentage / 55) * 100)}%` }}
            />
          </div>
        </div>

        {/* Dedicated PDF Download Action under Card */}
        <div className="mt-3 flex items-center justify-center">
          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={isDownloadingPdf}
            className="w-full max-w-sm py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-700/60 via-amber-600/70 to-amber-800/60 hover:from-amber-600 hover:to-amber-700 border border-amber-400/40 text-amber-100 font-magical font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-black/50 backdrop-blur-md transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
          >
            {isDownloadingPdf ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-amber-200" />
                <span>Создаю памятную открытку в PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-amber-300" />
                <span>Скачать эту карточку в PDF 💌</span>
              </>
            )}
          </button>
        </div>

        {/* RESPONSE BLOCK: Exactly 2 cute buttons side by side */}
        {isRevealed && !isAccepted && (
          <div className="mt-4 text-center animate-fade-in">
            <p className="text-amber-200/90 text-xs font-magical italic tracking-wider font-semibold mb-2.5">
              Твой ответ на послание:
            </p>

            <div className="flex items-center justify-center gap-3 w-full max-w-sm mx-auto">
              {/* Button 1: "Летим! 🦉✨" */}
              <button
                type="button"
                onClick={handleAccept}
                className="flex-1 flex items-center justify-center gap-1.5 py-3 px-3 sm:px-4 rounded-xl bg-gradient-to-r from-amber-600 via-rose-600 to-amber-700 hover:from-amber-500 hover:to-rose-500 text-white font-magical font-bold text-sm sm:text-base shadow-lg shadow-amber-950/60 border border-amber-400/50 transition-all hover:scale-105 active:scale-95 uppercase tracking-wider"
              >
                <span>Летим! 🦉✨</span>
              </button>

              {/* Button 2: "Подумаю..." playfully dodging */}
              {hesitateCount < 3 ? (
                <button
                  type="button"
                  onMouseEnter={handleHesitate}
                  onClick={handleHesitate}
                  className="flex-1 py-3 px-3 sm:px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-magical text-sm border border-white/20 transition-transform duration-200"
                  style={{
                    transform: `translate(${hesitatePos.x}px, ${hesitatePos.y}px)`,
                  }}
                >
                  <span className="whitespace-nowrap">Подумаю... 😏</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleAccept}
                  className="flex-1 py-3 px-3 sm:px-4 rounded-xl bg-amber-500/30 border border-amber-400 text-amber-200 font-magical font-bold text-sm transition-all animate-pulse uppercase tracking-wider"
                >
                  <span className="whitespace-nowrap">Ладно, согласна! 🪄💖</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* AFTER ACCEPTED: Hogwarts Magic VIP Ticket */}
        {isAccepted && <GoldenTicket invitation={invitation} />}
      </div>
    </div>
  );
};
