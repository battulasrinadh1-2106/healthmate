import React, { useState, useEffect, useRef } from 'react';

export default function ScratchCard({ 
  onComplete, 
  coverColor = "#1e293b", 
  children 
}: { 
  onComplete: () => void; 
  coverColor?: string; 
  children: React.ReactNode 
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scratchActiveRef = useRef(false);
  const [scratchDone, setScratchDone] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas size sync
    const width = containerRef.current?.offsetWidth || 340;
    const height = containerRef.current?.offsetHeight || 220;
    canvas.width = width;
    canvas.height = height;

    // Draw opaque cover resembling a secure temporal static layer
    ctx.fillStyle = "#0c1524"; // Rich charcoal deep slate
    ctx.fillRect(0, 0, width, height);

    // Render thin subtle cyber/grid horizontal static lines
    ctx.strokeStyle = "rgba(16, 185, 129, 0.12)";
    ctx.lineWidth = 1;
    for (let i = 0; i < height; i += 8) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }

    // Glowing target orbits in the center
    ctx.strokeStyle = "rgba(16, 185, 129, 0.25)";
    ctx.beginPath();
    ctx.arc(width / 2, height / 2 - 10, 50, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = "rgba(245, 158, 11, 0.15)"; // Soft amber secondary orbit
    ctx.beginPath();
    ctx.arc(width / 2, height / 2 - 10, 75, 0, Math.PI * 2);
    ctx.stroke();

    // Small cybernetic crosshair bars at corners
    ctx.strokeStyle = "rgba(16, 185, 129, 0.4)";
    const gap = 15;
    const len = 10;
    // Top-left
    ctx.beginPath(); ctx.moveTo(gap, gap); ctx.lineTo(gap + len, gap); ctx.moveTo(gap, gap); ctx.lineTo(gap, gap + len); ctx.stroke();
    // Top-right
    ctx.beginPath(); ctx.moveTo(width - gap, gap); ctx.lineTo(width - gap - len, gap); ctx.moveTo(width - gap, gap); ctx.lineTo(width - gap, gap + len); ctx.stroke();
    // Bottom-left
    ctx.beginPath(); ctx.moveTo(gap, height - gap); ctx.lineTo(gap + len, height - gap); ctx.moveTo(gap, height - gap); ctx.lineTo(gap, height - gap - len); ctx.stroke();
    // Bottom-right
    ctx.beginPath(); ctx.moveTo(width - gap, height - gap); ctx.lineTo(width - gap - len, height - gap); ctx.moveTo(width - gap, height - gap); ctx.lineTo(width - gap, height - gap - len); ctx.stroke();

    // Holographic digital watermark labels
    ctx.font = 'bold 8px "JetBrains Mono", "Fira Code", monospace';
    ctx.fillStyle = 'rgba(16, 185, 129, 0.4)';
    ctx.textAlign = 'left';
    ctx.fillText('RECORD SYNC: ACTIVE', gap + 5, height - gap - 5);
    ctx.textAlign = 'right';
    ctx.fillText('SEAL: SECURE', width - gap - 5, height - gap - 5);

    // Circular digital wax seal in center
    ctx.fillStyle = "#0c1f2e";
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(width / 2, height / 2 - 10, 28, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Instruction lettering inside and around orbit
    ctx.font = 'bold 15px "Playfair Display", "Times New Roman", serif';
    ctx.fillStyle = '#f59e0b'; // Mysterious amber
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SEALED MEMORY', width / 2, height / 2 - 14);

    ctx.font = 'bold 9px "JetBrains Mono", "Inter", sans-serif';
    ctx.fillStyle = '#10b981'; // Green status
    ctx.fillText('ERASE STATIC', width / 2, height / 2 + 6);

    ctx.font = '500 11px "Inter", sans-serif';
    ctx.fillStyle = '#94a3b8'; // Slate instructions
    ctx.fillText('Rub with finger or pointer to open yours', width / 2, height / 2 + 45);

    const checkPercentage = () => {
      const imgData = ctx.getImageData(0, 0, width, height);
      let cleared = 0;
      for (let i = 3; i < imgData.data.length; i += 4) {
        if (imgData.data[i] === 0) cleared++;
      }
      const percentage = cleared / (width * height);
      if (percentage > 0.42 && !scratchDone) {
        setScratchDone(true);
        onComplete();
        ctx.clearRect(0, 0, width, height);
      }
    };

    const drawScratch = (x: number, y: number) => {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 22, 0, Math.PI * 2);
      ctx.fill();
      checkPercentage();
    };

    const getCoords = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    const handleStart = (e: MouseEvent | TouchEvent) => {
      e.stopPropagation();
      scratchActiveRef.current = true;
      const coords = getCoords(e);
      drawScratch(coords.x, coords.y);
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!scratchActiveRef.current) return;
      e.stopPropagation();
      const coords = getCoords(e);
      drawScratch(coords.x, coords.y);
    };

    const handleEnd = () => {
      scratchActiveRef.current = false;
    };

    canvas.addEventListener('mousedown', handleStart);
    canvas.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);

    canvas.addEventListener('touchstart', handleStart, { passive: false });
    canvas.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleEnd);

    return () => {
      canvas.removeEventListener('mousedown', handleStart);
      canvas.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);

      canvas.removeEventListener('touchstart', handleStart);
      canvas.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [coverColor, scratchDone]);

  return (
    <div ref={containerRef} className="relative w-full min-h-[220px] rounded-3xl overflow-hidden shadow-2xl border border-slate-850 bg-slate-950/20 p-6 flex flex-col justify-center">
      <div className="z-0 w-full text-left">
        {children}
      </div>
      {!scratchDone && (
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 z-10 cursor-pointer touch-none hover:opacity-95 transition-opacity"
        />
      )}
    </div>
  );
}
