/**
 * The organism's body as metaballs, in the 1000-unit organism space (centre at 500, 500; y down).
 * Two lobes strain apart along a diagonal and slump back together while the neck between them thins;
 * three satellites orbit and a small bud wanders. The whole body leans toward the light.
 */
export const BALL_COUNT = 7;

const AXIS = [-0.82, -0.57] as const;
const C = 500;

export function bodyBalls(t: number, lean: readonly [number, number], out: Float32Array): void {
  const strain = (0.5 - 0.5 * Math.cos((t / 9) * Math.PI * 2)) ** 1.6;
  const [ax, ay] = AXIS;
  const set = (i: number, x: number, y: number, r: number) => {
    out[i * 3] = x + lean[0];
    out[i * 3 + 1] = y + lean[1];
    out[i * 3 + 2] = r;
  };
  const orbit = (i: number, radius: number, angle: number, r: number) =>
    set(i, C + Math.cos(angle) * radius, C + Math.sin(angle) * radius, r);

  const pullA = 18 + 28 * strain;
  const pullB = 20 + 26 * strain;
  set(0, C + ax * pullA, C + ay * pullA, 50 - 4 * strain);
  set(1, C - ax * pullB, C - ay * pullB, 46 - 3 * strain);
  set(2, C, C, 36 * (1 - 0.45 * strain));
  orbit(3, 64, t * 0.21, 22);
  orbit(4, 74, -t * 0.17 + 2.4, 18);
  orbit(5, 58, t * 0.13 + 4.1, 20);
  set(6, C + Math.sin(t * 0.3) * 42, C + Math.cos(t * 0.23) * 48, 15);
}
