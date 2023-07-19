'use client';

import { MouseEvent, useEffect, useRef, useState } from 'react';
import { sketch } from './sketch';
import { PointsPreview } from './PointsPreview';

export function Canvas() {
  const ref = useRef<HTMLCanvasElement>(null!);
  const ctx = useRef<CanvasRenderingContext2D>(null!);

  const [step, setStep] = useState(0);

  const stopRef = useRef<() => void>();

  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState<[number, number][]>([]);

  const handleClick = (e: MouseEvent) => {
    stopRef.current?.();

    if (isDrawing) {
      setIsDrawing(false);
      if (step === 2) setStep(3);
      return;
    }

    const newPoints = [...points, [e.clientX * 2, e.clientY * 2]] as [
      number,
      number
    ][];
    setPoints(newPoints);

    if (step === 0 && newPoints.length > 2) setStep(1);
    if (step === 2) setStep(3);
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
  }, []);

  useEffect(() => {
    const clearPoints = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        stopRef.current?.();
        setIsDrawing(false);
        setPoints([]);
      }

      if (e.key === 'Enter' && points.length > 2) {
        stopRef.current?.();
        stopRef.current = sketch(ctx.current, points);
        setIsDrawing(true);
        setPoints([]);
      }
    };

    window.addEventListener('keydown', clearPoints);
    return () => window.removeEventListener('keydown', clearPoints);
  }, [points]);

  return (
    <div
      className={
        'w-full h-full relative ' +
        (isDrawing ? 'cursor-progress' : 'cursor-crosshair')
      }
      onClick={handleClick}
    >
      <canvas className='w-full h-full' ref={ref}></canvas>
      <PointsPreview
        points={points}
        onPlay={() => {
          stopRef.current = sketch(ctx.current, points);
          setIsDrawing(true);
          setPoints([]);
          if (step === 1) setStep(2);
        }}
      />
      {step < 3 && (
        <div className='absolute bottom-8 inset-x-0 text-center pointer-events-none'>
          <span className='inline-block p-4 text-[#efeeee] bg-black'>
            {step === 0 && 'click to place points'}
            {step === 1 && 'click the green circle to fill'}
            {step === 2 && 'click again to stop scribbling'}
          </span>
        </div>
      )}
    </div>
  );
}
