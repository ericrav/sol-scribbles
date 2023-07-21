import { useEffect, useState } from 'react';

interface Props {
  points: [number, number][];
  onPlay: () => void;
}

export function PointsPreview({ points, onPlay }: Props) {
  const [viewBox, setViewBox] = useState('0 0 400 400');
  const [cursor, setCursor] = useState<[number, number]>([0, 0]);
  useEffect(() => {
    setViewBox(`0 0 ${window.innerWidth * 2} ${window.innerHeight * 2}`);
    let raf: number;
    const resize = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setViewBox(`0 0 ${window.innerWidth * 2} ${window.innerHeight * 2}`);
      });
    };

    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursor([e.clientX * 2, e.clientY * 2]);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <svg
      className='absolute inset-0'
      xmlns='http://www.w3.org/2000/svg'
      viewBox={viewBox}
    >
      <polyline
        points={points.map(([x, y]) => `${x},${y}`).join(' ') + ` ${cursor[0]},${cursor[1]}`}
        fill='none'
        stroke='orange'
        opacity={0.5}
        strokeWidth={5}
        strokeDasharray={'16 4'}
      />
      {points.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={20}
          fill='none'
          stroke='orange'
          strokeWidth={6}
          strokeDasharray={'16 4'}
          className='animate-[spin_3s_linear_infinite] origin-center'
          style={{ transformBox: 'fill-box' }}
        />
      ))}

      {points.length > 1 && (
        <g
          className={
            'transition-opacity duration-500 cursor-pointer ' +
            (points.length > 2 ? 'opacity-100' : 'opacity-0')
          }
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onPlay();
          }}
        >
          <circle
            cx={points[0][0]}
            cy={points[0][1]}
            r={40}
            fill='green'
            stroke='none'
            style={{ transformBox: 'fill-box' }}
            className={
              'cursor-pointer origin-center ' +
              'transition-all origin-center duration-500 ' +
              (points.length > 2
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-0')
            }
          />

          <polygon
            className='origin-center'
            style={{ transformBox: 'fill-box' }}
            points={playIcon(points[0][0] + 3, points[0][1])}
            fill='white'
          />
        </g>
      )}
    </svg>
  );
}

function playIcon(x: number, y: number) {
  const w = 30;
  return `${x - w / 2}, ${y - w / 2} ${x + w / 2}, ${y} ${x - w / 2}, ${
    y + w / 2
  }`;
}
