'use client';

import { useEffect, useRef } from 'react';
import { sketch } from './sketch';

export function Canvas() {
  const ref = useRef<HTMLCanvasElement>(null!);

  useEffect(() => {
    const canvas = ref.current;
    requestAnimationFrame(() => {
      sketch(canvas);
    });

    const resize = () => {
      canvas.width = window.innerWidth * 2;
      canvas.height = window.innerHeight * 2;
    };
    window.addEventListener('resize', resize);
    resize();
    return () => window.removeEventListener('resize', resize);
  }, []);

  return <canvas className='w-full h-full' ref={ref}></canvas>;
}
