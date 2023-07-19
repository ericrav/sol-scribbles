'use client';

import { MouseEvent, use, useEffect, useRef, useState } from 'react';
import { sketch } from './sketch';

export function Canvas() {
  const ref = useRef<HTMLCanvasElement>(null!);
  const ctx = useRef<CanvasRenderingContext2D>(null!);

  const [points, setPoints] = useState<[number, number][]>([]);

  const handleClick = (e: MouseEvent) => {
    setPoints([...points, [e.clientX * 2, e.clientY * 2]]);

    console.log(points);

    if (points.length > 7) {
      sketch(ctx.current, points);
    }
  };

  useEffect(() => {
    const canvas = ref.current;
    canvas.width = window.innerWidth * 2;
    canvas.height = window.innerHeight * 2;

    requestAnimationFrame(() => {
      ctx.current = canvas.getContext('2d')!;
      ctx.current.fillStyle = '#f2f2f2';
      ctx.current.fillRect(0, 0, canvas.width, canvas.height);
    });
    // ctx.current.globalCompositeOperation = 'darken';

    // const resize = () => {
    //   canvas.width = window.innerWidth * 2;
    //   canvas.height = window.innerHeight * 2;
    // };
    // window.addEventListener('resize', resize);
    // resize();
    // return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <canvas className='w-full h-full' ref={ref} onClick={handleClick}></canvas>
  );
}
