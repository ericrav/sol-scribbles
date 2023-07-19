var pointInPolygon = require('point-in-polygon');

export function sketch(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#f2f2f2';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = 'darken';

  const cursor = { x: center[0], y: center[1] };
  const cursor2 = { ...cursor };
  const cursor3 = { ...cursor };
  const cursor4 = { ...cursor };

  let r = 54;
  let g = 69;
  let b = 79;
  let alpha = 0.1;

  ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;

  const startTime = Date.now();
  const draw = () => {
    const elapsed = Date.now() - startTime;

    if (elapsed > 5000) {
      r *= 0.99991;
      g *= 0.99991;
      b *= 0.99991;
      ctx.strokeStyle = `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${alpha})`;
    }

    if (elapsed > 15000) {
      alpha = 0.14;
    }

    scribble(ctx, cursor);
    scribble(ctx, cursor2);
    scribble(ctx, cursor3);
    scribble(ctx, cursor4);
    requestAnimationFrame(draw);
  };

  requestAnimationFrame(draw);
}

interface Point {
  x: number;
  y: number;
}

// 5-pointed star
const star = [
  [200, 62],
  [222, 145],
  [311, 145],
  [239, 197],
  [266, 281],
  [200, 230],
  [134, 281],
  [161, 197],
  [89, 145],
  [178, 145],
];

const center = star.reduce((acc, [x, y]) => ([acc[0] + x, acc[1] + y]), [0, 0]).map(n => n / star.length) as [number, number];

function scribble(ctx: CanvasRenderingContext2D, cursor: Point) {
  const weight = 150;
  let hVel = Math.random() * weight - weight / 2;
  let vVel = Math.random() * weight - weight / 2;
  let hFreq = Math.random() * weight - weight / 2;
  let vFreq = Math.random() * weight - weight / 2;
  let hPhase = Math.random() * weight - weight / 2;
  let vPhase = Math.random() * weight - weight / 2;
  let hSweep = Math.random() * 2 - 1;
  let vSweep = Math.random() * 2 - 1;

  let t = 0;
  const maxT = 250;

  ctx.beginPath();
  ctx.moveTo(cursor.x, cursor.y);

  const points = [] as { x: number; y: number }[];

  while (t++ < maxT) {
    cursor.x += hVel * Math.sin(hFreq * t + hPhase) + hSweep;
    cursor.y += vVel * Math.sin(vFreq * t + vPhase) + vSweep;

    hVel += Math.random() - 0.5;
    vVel += Math.random() - 0.5;
    hFreq += Math.random() - 0.5;
    vFreq += Math.random() - 0.5;
    hPhase += Math.random() - 0.5;
    vPhase += Math.random() - 0.5;
    hSweep += Math.random() - 0.5;
    vSweep += Math.random() - 0.5;
    // ctx.lineTo(nextX, nextY);

    if (pointInPolygon([cursor.x, cursor.y], star)) {
      points.push({ ...cursor });
    } else {
      cursor.x = center[0];
      cursor.y = center[1];
      break;
      // if (cursor.x < 0) cursor.x = 0;
      // if (cursor.x >= ctx.canvas.width) cursor.x = ctx.canvas.width - 1;
      // if (cursor.y < 0) cursor.y = 0;
      // if (cursor.y >= ctx.canvas.height) cursor.y = ctx.canvas.height - 1;
    }
  }

  points.forEach((point, i) => {
    const xc = (point.x + points[i + 1]?.x) / 2;
    const yc = (point.y + points[i + 1]?.y) / 2;
    ctx.quadraticCurveTo(point.x, point.y, xc, yc);
  });

  ctx.stroke();
}

// PVector oscillation(float x, float y, int maxT) {
//   int weight = 5;
//   float hVel   = (random(1) * weight) - (weight/2);
//   float vVel   = (random(1) * weight) - (weight/2);
//   float hFreq  = (random(1) * weight) - (weight/2);
//   float vFreq  = (random(1) * weight) - (weight/2);
//   float hPhase = (random(1) * weight) - (weight/2);
//   float vPhase = (random(1) * weight) - (weight/2);
//   float hSweep = (random(1) * 2) - 1;
//   float vSweep = (random(1) * 2) - 1;
//   noFill();
//   beginShape();
//   vertex(x, y);
//   PVector lastPoint = draw(maxT, 0, x, y, hVel, vVel, hFreq, vFreq, hPhase, vPhase, hSweep, vSweep);
//   return lastPoint;
// }

// PVector draw(int maxT, float t, float x, float y, float hVel, float vVel, float hFreq, float vFreq, float hPhase, float vPhase, float hSweep, float vSweep) {
//   float nextX = x + (hVel * sin(hFreq * t + hPhase) + hSweep);
//   float nextY = y + (vVel * sin(vFreq * t + vPhase) + vSweep);
//   t += dt;
//   //line(x, y, nextX, nextY);
//   curveVertex(nextX, nextY);
//   if (t < maxT) {
//     return draw(maxT, t, nextX, nextY, hVel, vVel, hFreq, vFreq, hPhase, vPhase, hSweep, vSweep);
//   } else {
//     endShape();
//     return new PVector(x, y);
//   }
// }
