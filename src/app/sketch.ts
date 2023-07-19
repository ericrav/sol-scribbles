var pointInPolygon = require('point-in-polygon');

export function sketch(
  ctx: CanvasRenderingContext2D,
  polygon: [number, number][]
) {
  const center = polygon
    .reduce((acc, [x, y]) => [acc[0] + x, acc[1] + y], [0, 0])
    .map((n) => n / polygon.length) as [number, number];

  // const cursor = { x: center[0], y: center[1] };
  const cursor = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const cursor2 = { ...cursor };
  const cursor3 = { ...cursor };
  const cursor4 = { ...cursor };

  let r = 54;
  let g = 69;
  let b = 79;
  let alpha = 0.08;

  const startTime = Date.now();
  let stopped = false;
  const draw = () => {
    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
    const elapsed = Date.now() - startTime;

    if (elapsed > 5000) {
      r *= 0.99991;
      g *= 0.99991;
      b *= 0.99991;
    }

    if (elapsed > 15000) {
      alpha = 0.14;
    }

    scribble(ctx, polygon, center, cursor);
    scribble(ctx, polygon, center, cursor2);
    scribble(ctx, polygon, center, cursor3);
    scribble(ctx, polygon, center, cursor4);

    if (!stopped) {
      requestAnimationFrame(draw);
    }
  };

  requestAnimationFrame(draw);

  return () => {
    stopped = true;
  };
}

interface Point {
  x: number;
  y: number;
}

function getRandomPointInPolygon(polygon: [number, number][]) {
  const [minX, maxX] = polygon.reduce(
    (acc, [x]) => [Math.min(acc[0], x), Math.max(acc[1], x)],
    [Infinity, -Infinity]
  );
  const [minY, maxY] = polygon.reduce(
    (acc, [, y]) => [Math.min(acc[0], y), Math.max(acc[1], y)],
    [Infinity, -Infinity]
  );

  let point: Point;

  do {
    point = {
      x: Math.random() * (maxX - minX) + minX,
      y: Math.random() * (maxY - minY) + minY,
    };
  } while (!pointInPolygon([point.x, point.y], polygon));

  return point;
}

function scribble(
  ctx: CanvasRenderingContext2D,
  polygon: [number, number][],
  center: [number, number],
  cursor: Point
) {
  const weight = 125;
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

  if (!pointInPolygon([cursor.x, cursor.y], polygon)) {
    const newPoint = getRandomPointInPolygon(polygon);
    cursor.x = newPoint.x;
    cursor.y = newPoint.y;
  }

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

    if (pointInPolygon([cursor.x, cursor.y], polygon)) {
      points.push({ ...cursor });
    } else {
      cursor.x += center[0] - cursor.x > 0 ? 1 : -1;
      cursor.y += center[1] - cursor.y > 0 ? 1 : -1;
      break;
    }
  }

  if (points.length < 2) {
    return;
  }

  points.forEach((point, i) => {
    const xc = (point.x + points[i + 1]?.x) / 2;
    const yc = (point.y + points[i + 1]?.y) / 2;
    ctx.quadraticCurveTo(point.x, point.y, xc, yc);
  });

  ctx.stroke();
}
