import { useEffect, useState } from 'react';

interface Props {
  points: [number, number][];
  onPlay: () => void;
}

export function PointsPreview({ points, onPlay }: Props) {
  const [viewBox, setViewBox] = useState('0 0 400 400');
  useEffect(() => {
    setViewBox(`0 0 ${window.innerWidth * 2} ${window.innerHeight * 2}`);
  }, []);

  return (
    <svg
      className='absolute inset-0'
      xmlns='http://www.w3.org/2000/svg'
      viewBox={viewBox}
    >
      <polyline
        points={points.map(([x, y]) => `${x},${y}`).join(' ')}
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
          r={40}
          fill='none'
          stroke='orange'
          strokeWidth={10}
          strokeDasharray={'16 4'}
          className='animate-[spin_3s_linear_infinite] origin-center'
          style={{ transformBox: 'fill-box' }}
        />
      ))}

      {points.length > 2 && (
        <circle
          cx={points[0][0]}
          cy={points[0][1]}
          r={50}
          fill='green'
          stroke='none'
          style={{ transformBox: 'fill-box' }}
          className='cursor-pointer origin-center'
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onPlay();
          }}
        />
      )}
    </svg>
  );
}
