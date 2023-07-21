'use client';

import { MouseEvent, useEffect, useRef, useState } from 'react';
import { sketch } from './sketch';
import { PointsPreview } from './PointsPreview';

export function Canvas() {
  const ref = useRef<HTMLCanvasElement>(null!);
  const ctx = useRef<CanvasRenderingContext2D>(null!);

  const [step, setStep] = useState(0);
  const [cursors, setCursors] = useState<{ x: number; y: number }[]>([]);

  const stopRef = useRef<() => void>();

  const [isDrawing, setIsDrawing] = useState(false);
  const [polygon, setPolygon] = useState<[number, number][]>([]);

  const handleClick = (e: MouseEvent) => {
    stopRef.current?.();

    if (isDrawing) {
      setIsDrawing(false);
      if (step === 2) setStep(3);
      return;
    }

    const newPoints = [...polygon, [e.clientX * 2, e.clientY * 2]] as [
      number,
      number
    ][];
    setPolygon(newPoints);

    if (step === 0 && newPoints.length > 2) setStep(1);
    if (step === 2) setStep(3);
  };

  const startDraw = () => {
    const center = polygon
      .reduce((acc, [x, y]) => [acc[0] + x, acc[1] + y], [0, 0])
      .map((n) => n / polygon.length) as [number, number];

    const startingCursor = { x: center[0], y: center[1] };
    const numberOfCursors = 5;
    const cursors = Array.from({ length: numberOfCursors }).map(() => ({ ...startingCursor }));
    setCursors(cursors);
    stopRef.current = sketch(ctx.current, polygon, center, cursors);
    setIsDrawing(true);
    setPolygon([]);
    if (step === 1) setStep(2);
  };

  useEffect(() => {
    const canvas = ref.current;
    canvas.width = window.innerWidth * 2;
    canvas.height = window.innerHeight * 2;

    requestAnimationFrame(() => {
      ctx.current = canvas.getContext('2d')!;
      ctx.current.fillStyle = '#efeeee';
      ctx.current.fillRect(0, 0, canvas.width, canvas.height);
      ctx.current.globalCompositeOperation = 'darken';
    });

    let raf: number;
    const resize = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const currentImage = ctx.current.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );
        canvas.width = window.innerWidth * 2;
        canvas.height = window.innerHeight * 2;
        ctx.current.fillStyle = '#efeeee';
        ctx.current.fillRect(0, 0, canvas.width, canvas.height);
        ctx.current.putImageData(currentImage, 0, 0);
      });
    };

    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    const clearPoints = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        stopRef.current?.();
        setIsDrawing(false);
        setPolygon([]);
      }

      if (e.key === 'Enter' && polygon.length > 2) {
        stopRef.current?.();
        startDraw();
      }
    };

    window.addEventListener('keydown', clearPoints);
    return () => window.removeEventListener('keydown', clearPoints);
  }, [polygon]);

  return (
    <div
      className={
        'w-full h-full relative ' +
        (isDrawing ? 'cursor-progress' : 'cursor-crosshair')
      }
      onClick={handleClick}
    >
      <div className='fixed bottom-2 right-2 z-40'>
        <button
          type='button'
          className='p-3 border-4 text-[#efeeee] bg-black text-sm shadow-sm'
          onClick={(e) => {
            e.stopPropagation();
            const link = document.createElement('a');
            link.download = `sol-scribbles-${Date.now()}.png`;
            link.href = ref.current.toDataURL();
            link.click();
          }}
        >
          download
        </button>
      </div>

      <canvas className='w-full h-full' ref={ref}></canvas>
      <PointsPreview
        points={polygon}
        isDrawing={isDrawing}
        cursors={cursors}
        onPlay={() => startDraw()}
      />
      {step < 3 && (
        <div className='absolute bottom-8 inset-x-0 text-center pointer-events-none'>
          <div className='inline-block p-4 text-[#efeeee] bg-blue-700'>
            {step === 0 && 'click to place points'}
            {step === 1 && 'click the green circle to fill'}
            {step === 2 && 'click again to stop scribbling'}
          </div>
        </div>
      )}
    </div>
  );
}
